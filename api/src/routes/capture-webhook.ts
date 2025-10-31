import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
	app.all(
		'/capture/*',
		{
			schema: {
				summary: 'Capture webhook incoming requests',
				hide: true,
				tags: ['External'],
				response: {
					201: z.object({ id: z.uuidv7() }),
				},
			},
		},
		async (request, reply) => {
			const method = request.method
			const ip = request.ip
			const contentType = request.headers['content-type']
			const contentLength = request.headers['content-length'] ? Number(request.headers['content-length']) : null

			let body: string | null = null

			if (request.body) {
				body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
			}

			const pathname = new URL(request.url).pathname.replace('/capture', '')
			const headers = Object.fromEntries(
				Object.entries(request.headers).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.join(', ') : value || ''
				])
			)

			const result = await db.insert(webhooks).values({
				method,
				pathname,
				ip,
				contentType,
				body,
				contentLength,
				headers
			}).returning()

			return reply.send({ id: result[0].id })
		},
	)
}
