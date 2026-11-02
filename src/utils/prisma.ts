import { Prisma} from "@prisma/client";
import { PrismaClient } from "../generated/prisma/client.js";

const loggingExtension = Prisma.defineExtension({
    name:"logging",
    query:{
        $allOperations: async ({model, operation, args, query}:any)=>{
            console.log(`[Prisma] Model: ${model}, Action: ${operation}`);

            try{
                const res =  await query(args)
                return res
            }catch(err){
                console.error(`[Prisma] Error in ${model}, ${operation}`, err);
                throw err
            }
        }
    }
})


const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 10000,
        timeout:10000,
    }
}).$extends(loggingExtension)



export default prisma