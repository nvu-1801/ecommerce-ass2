import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  price: z.number().positive(), // dùng z.number + valueAsNumber ở form
  image: z.string().url().optional()
        .or(z.literal('').transform(() => undefined)),
});

export type ProductInput = z.infer<typeof ProductSchema>;
