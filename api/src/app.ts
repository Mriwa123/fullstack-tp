import { productsRouter } from "./routes/products.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const app = express();

app.use(helmet());
app.use(cors({ origin: ["http://localhost:4200", "http://localhost:3000"] }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
app.use(errorHandler);