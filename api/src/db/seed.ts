import { db } from './index'
import { webhooks } from './schema/index'
import { faker } from '@faker-js/faker'

// Tipos de eventos comuns do Stripe
const stripeEvents = [
  'charge.succeeded',
  'charge.failed',
  'charge.refunded',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.created',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'invoice.created',
  'invoice.finalized',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.created',
  'customer.updated',
  'checkout.session.completed',
  'checkout.session.expired',
]

// Função para gerar um corpo de webhook do Stripe realista
function generateStripeWebhookBody(eventType: string) {
  const baseEvent = {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: eventType,
    livemode: faker.datatype.boolean(),
    pending_webhooks: faker.number.int({ min: 0, max: 3 }),
    request: {
      id: `req_${faker.string.alphanumeric(14)}`,
      idempotency_key: faker.string.uuid(),
    },
  }

  // Gerar dados específicos baseado no tipo de evento
  let data: any = {}

  if (eventType.startsWith('charge.')) {
    data = {
      object: {
        id: `ch_${faker.string.alphanumeric(24)}`,
        object: 'charge',
        amount: faker.number.int({ min: 1000, max: 50000 }),
        currency: 'brl',
        customer: `cus_${faker.string.alphanumeric(14)}`,
        description: faker.commerce.productDescription(),
        status: eventType === 'charge.succeeded' ? 'succeeded' : 'failed',
        payment_method: `pm_${faker.string.alphanumeric(24)}`,
        receipt_email: faker.internet.email(),
        created: Math.floor(Date.now() / 1000),
      },
    }
  } else if (eventType.startsWith('payment_intent.')) {
    data = {
      object: {
        id: `pi_${faker.string.alphanumeric(24)}`,
        object: 'payment_intent',
        amount: faker.number.int({ min: 1000, max: 100000 }),
        currency: 'brl',
        customer: `cus_${faker.string.alphanumeric(14)}`,
        status:
          eventType === 'payment_intent.succeeded'
            ? 'succeeded'
            : eventType === 'payment_intent.payment_failed'
              ? 'requires_payment_method'
              : 'requires_confirmation',
        payment_method: `pm_${faker.string.alphanumeric(24)}`,
        created: Math.floor(Date.now() / 1000),
      },
    }
  } else if (eventType.startsWith('invoice.')) {
    data = {
      object: {
        id: `in_${faker.string.alphanumeric(24)}`,
        object: 'invoice',
        amount_due: faker.number.int({ min: 2000, max: 80000 }),
        amount_paid:
          eventType === 'invoice.payment_succeeded'
            ? faker.number.int({ min: 2000, max: 80000 })
            : 0,
        currency: 'brl',
        customer: `cus_${faker.string.alphanumeric(14)}`,
        status:
          eventType === 'invoice.payment_succeeded'
            ? 'paid'
            : eventType === 'invoice.payment_failed'
              ? 'open'
              : 'draft',
        subscription: `sub_${faker.string.alphanumeric(14)}`,
        created: Math.floor(Date.now() / 1000),
      },
    }
  } else if (eventType.startsWith('customer.subscription.')) {
    data = {
      object: {
        id: `sub_${faker.string.alphanumeric(14)}`,
        object: 'subscription',
        customer: `cus_${faker.string.alphanumeric(14)}`,
        status:
          eventType === 'customer.subscription.deleted' ? 'canceled' : 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
        created: Math.floor(Date.now() / 1000),
        items: {
          data: [
            {
              id: `si_${faker.string.alphanumeric(14)}`,
              price: {
                id: `price_${faker.string.alphanumeric(24)}`,
                unit_amount: faker.number.int({ min: 2000, max: 50000 }),
                currency: 'brl',
              },
            },
          ],
        },
      },
    }
  } else if (eventType.startsWith('customer.')) {
    data = {
      object: {
        id: `cus_${faker.string.alphanumeric(14)}`,
        object: 'customer',
        email: faker.internet.email(),
        name: faker.person.fullName(),
        created: Math.floor(Date.now() / 1000),
      },
    }
  } else if (eventType.startsWith('checkout.session.')) {
    data = {
      object: {
        id: `cs_${faker.string.alphanumeric(24)}`,
        object: 'checkout.session',
        amount_total: faker.number.int({ min: 1000, max: 100000 }),
        currency: 'brl',
        customer: `cus_${faker.string.alphanumeric(14)}`,
        payment_status:
          eventType === 'checkout.session.completed' ? 'paid' : 'unpaid',
        status:
          eventType === 'checkout.session.completed' ? 'complete' : 'expired',
        created: Math.floor(Date.now() / 1000),
      },
    }
  }

  return {
    ...baseEvent,
    data,
  }
}

// Função para gerar headers realistas do Stripe
function generateStripeHeaders() {
  return {
    'content-type': 'application/json',
    'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=${faker.string.alphanumeric(64)}`,
    'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
    accept: '*/*',
    'content-length': faker.number.int({ min: 500, max: 3000 }).toString(),
  }
}

async function seed() {
  console.log('🌱 Iniciando seed de webhooks do Stripe...')

  const webhookRecords = []

  // Gerar 70 webhooks com distribuição variada de eventos
  for (let i = 0; i < 70; i++) {
    const eventType = faker.helpers.arrayElement(stripeEvents)
    const body = generateStripeWebhookBody(eventType)
    const headers = generateStripeHeaders()

    webhookRecords.push({
      method: 'POST',
      pathname: '/api/webhooks/stripe',
      ip: faker.internet.ipv4(),
      statusCode: faker.helpers.weightedArrayElement([
        { value: 200, weight: 85 },
        { value: 400, weight: 8 },
        { value: 500, weight: 5 },
        { value: 401, weight: 2 },
      ]),
      contentType: 'application/json',
      contentLength: faker.number.int({ min: 500, max: 3000 }),
      queryParams: {},
      headers,
      body: JSON.stringify(body, null, 2),
      createdAt: faker.date.recent({ days: 30 }),
    })
  }

  // Ordenar por data de criação (mais antigos primeiro)
  webhookRecords.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  await db.delete(webhooks)

  // Inserir no banco de dados
  await db.insert(webhooks).values(webhookRecords)

  console.log(`✅ ${webhookRecords.length} webhooks inseridos com sucesso!`)

  // Estatísticas
  const eventCounts = webhookRecords.reduce(
    (acc, record) => {
      const body = JSON.parse(record.body)
      acc[body.type] = (acc[body.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  console.log('\n📊 Distribuição de eventos:')
  Object.entries(eventCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([event, count]) => {
      console.log(`  ${event}: ${count}`)
    })
}

seed()
  .catch((error) => {
    console.error('❌ Erro durante o seed:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
