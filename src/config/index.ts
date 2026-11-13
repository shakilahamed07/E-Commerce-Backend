import dotenv from "dotenv"
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
    node_env: process.env.NODE_ENV,
    salt_rounds: process.env.SALT_ROUNDS,
    nodemailer_host_email:process.env.NODEMAILER_HOST_MAIL,
    nodemailer_host_password:process.env.NODEMAILER_HOST_PASS,
    jwt_secret:process.env.JWT_SECRET,
    jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN,
    aws_bucket_name:process.env.AWS_BUCKET_NAME,
    aws_bucket_region:process.env.AWS_BUCKET_REGION,
    aws_secret_access_key:process.env.AWS_SECRET_ACCESS_KEY,
    aws_access_key:process.env.AWS_ACCESS_KEY,
}