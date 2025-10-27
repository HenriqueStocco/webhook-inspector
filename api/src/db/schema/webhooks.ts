import { integer } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { pgTable, text } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const webhooks = pgTable('webhoos', {
	id: text().primaryKey().$defaultFn(() => uuidv7()),
	method: text().notNull(),
	pathname: text().notNull(),
	ip: text().notNull(),
	statusCode: integer().notNull().default(200),
	contentType: text(),
	contentLenght: integer(),
	queryParams: jsonb().$type<Record<string, string>>(),
	headers: jsonb().$type<Record<string, string>>().notNull(),
	body: text(),
	createdAt: timestamp().notNull().defaultNow()
})