import { z } from "zod";

export const productIdParam = z.object({
  productId: z.coerce.number().int().positive(),
});

export const reviewBody = z.object({
  author: z.string().trim().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1),
});
