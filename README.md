#   E-Commerce Backend

A scalable and maintainable RESTful Backend API built with **Node.js, Express, TypeScript, and Prisma ORM**, following a clean **Modular Architecture** pattern.

This project demonstrates how to structure a modern Node.js & TypeScript application by separating concerns into distinct modules, utilities, middleware, and database layers using Prisma.

---

## 📁 Project Structure

```text
modular-architecture-user-crud/
├── prisma/
│   └── schema.prisma         # Prisma database schema definition
├── src/
│   ├── config/
│   │   └── index.ts          # Central environment configuration
│   ├── generated/            # Auto-generated Prisma client types
│   ├── interface/            # Custom TypeScript interfaces/types
│   ├── middleware/           # Express middleware functions
│   │   ├── AppError.ts
│   │   ├── globalErrorHandler.ts
│   │   └── notfound.ts
│   ├── modules/              # Feature modules
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.routes.ts
│   │       └── user.service.ts
│   ├── routers/              # Application root router
│   │   └── routes.ts
│   ├── utils/                # Utility and helper modules
│   │   ├── catchAsync.ts
│   │   ├── prisma.ts         # Singleton Prisma client instance
│   │   └── sendResponse.ts
│   ├── app.ts                # Express application initialization
│   └── server.ts             # Server entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts          # Prisma configuration
├── tsconfig.json             # TypeScript compiler settings
└── README.md                 # Project documentation
```

---

## 🛠️ Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: MongoDB (configured via Prisma)

---

## 📝 License

Distributed under the MIT License.

👨‍💻 **Developed by [Shakil Ahamed](https://github.com/shakilahamed07)**