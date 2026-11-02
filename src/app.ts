import cookieParser from "cookie-parser";
import express from "express"
import type { Application } from "express";
import cors from "cors"
import router from "./routers/routes.js";
import notFound from "./middleware/notfound.js";
import golobalErrorHandeler from "./middleware/globalErrorHandler.js";
import prisma from "./utils/prisma.js";

const app:Application = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
}))
app.use("/api/v1", router)

app.post('/users', async (req, res) => {
    const {email, name, age} = await req.body;
    const createUser = await prisma.user.create({data: {email,name, age}})
    res.json(createUser);
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/', (req, res) => {
  res.json("Server is running");
});

// app.post('/users', async (req, res) => {
//     const {email, name} = req.body;
//     const createUser = await Prisma.user.create({data: {email,name}})
//   res.json(createUser);
// });

// // Get Users
// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

app.use(golobalErrorHandeler)
app.use(notFound)

export default app;