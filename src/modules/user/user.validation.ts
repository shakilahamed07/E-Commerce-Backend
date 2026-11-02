
import z from "zod"

const schema = z.object({
    name: z.string({message: "Name is required"}).min(3, "Name must be minimun 3 chr"),
    email: z.string({ message: "Email is required" }).email("A valid email is required"),
    status:z.enum(["active", "blocked"]).default("active").optional() ,
    profile :z.string().optional(),
    password: z.string({message: "password is required"}).min(4, "Password must be at least 4 characters"),
    role: z.enum(["supper_admin", "sub_admin", "admin", "user"]).default("user").optional(),
    phoneNumber: z.string().optional() ,
    customerId: z.string().optional() ,
    expireAt: z.date().optional() ,
    isDeleted: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

const create = z.object({
    body:schema
})

// const update = z.object({
//     body:schema.partial()
// })

const userValidationSchema = {
    create
}

export default userValidationSchema;