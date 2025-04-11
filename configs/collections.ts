import { pgTable, text, integer, jsonb } from 'drizzle-orm/pg-core';

export const conversionsTable = pgTable('conversions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    status: text('status', { enum: ['success', 'failed', 'processing'] }).notNull(),
    quality_score: integer('quality_score').notNull(),
    image_url: text('image_url').notNull(),
    description: text('description').notNull(),
    generated_code: text('generated_code').notNull(),
    metadata: jsonb('metadata').notNull().$type<{
        model: string;
        generationTime: number;
        tokens: number;
    }>()
}, (table) => ({
}));
