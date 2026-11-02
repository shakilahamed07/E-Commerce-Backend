import cookieParser from "cookie-parser";
import express from "express";
import type { Application } from "express";
import cors from "cors";
import router from "./routers/routes.js";
import notFound from "./middleware/notfound.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import path from 'path';

const app: Application = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());

app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;