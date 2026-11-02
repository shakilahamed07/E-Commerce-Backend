import dotenv from "dotenv"
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
    node_env: process.env.NODE_ENV,
    salt_rounds: process.env.SALT_ROUNDS,
    nodemailer_host_email:process.env.NODEMAILER_HOST_MAIL,
    nodemailer_host_pass:process.env.NODEMAILER_HOST_PASS
}