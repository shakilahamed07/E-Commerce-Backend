import type { Server } from "http";
import app from "./app.js";
import config from "./config/index.js";
import colors from "colors";

let server: Server | undefined;

async function main() {
  server = app.listen(config.port, () => {
    console.log(
      colors.italic.green.bold(`Server is running on port ${config.port}`),
    );
  });
}

main().catch((err) => {
    console.error(colors.red.bold(`Error starting server: ${err}`));
    process.exit(1)
});

process.on("unhandledRejection", err =>{
     console.error(colors.red.bold(`Unhandled Rejection: ${err}`));
     if(server){
        server.close(()=>{
            process.exit(1)
        })
     }
})

process.on("uncaughtException", err =>{
     console.error(colors.red.bold(`UncaughtException Rejection: ${err}`));
     if(server){
        server.close(()=>{
            process.exit(1)
        })
     }
})
