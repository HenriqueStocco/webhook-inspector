import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'
import { inArray } from 'drizzle-orm'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a TypeScript handler',
        tags: ['webhooks'],
        body: z.object({
          webhookIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body

      const result = await db
        .select({ body: webhooks.body })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds))

      const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n')

      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        prompt: `
					I will provide you with the request body code from several webhook events. 
					Please write a TypeScript function that will serve as a handler for these webhooks. 
					
					"""
					${webhooksBodies}
					"""

					The handler function should:

					1. Use the Zod library for validation of incoming webhook data.
					2. Handle each possible event sent by the webhooks.
					3. Ensure that the function validates the webhook body properly according to each event type.
					4. Return an appropriate response for each event.
					5. Provide any necessary error handling in case the data does not match the expected format.

					Please write the TypeScript function that handles multiple webhook events and validates the incoming data using Zod.

					Return only the code and do not return	within \`\`\`typescript or any other markdown symbols, do not include any introduction or text before or after the code.
				`.trim(),
      })

      return reply.status(201).send({ code: text })
    },
  )
}
