import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        layout: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
      }),
    }),
  },
})
