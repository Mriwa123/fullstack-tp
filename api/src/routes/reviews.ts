import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { validate } from "../middlewares/validate.js";
import { productIdParam, reviewBody } from "../schemas/review.js";

export const reviewsRouter = Router({ mergeParams: true });

reviewsRouter.get("/", validate(productIdParam, "params"), async (_req, res) => {
  const { productId } = res.locals.params;
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  res.json(reviews);
});

reviewsRouter.post(
  "/",
  validate(productIdParam, "params"),
  validate(reviewBody),
  async (_req, res) => {
    const { productId } = res.locals.params;
    const review = await prisma.review.create({
      data: { ...res.locals.body, productId },
    });
    res.status(201).json(review);
  }
);