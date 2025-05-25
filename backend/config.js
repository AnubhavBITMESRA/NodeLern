import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ADMIN = process.env.JWT_ADMIN;

const STRIPE_SECRET_KEY=process.env.STRIPE_SECRET_KEY


export default{
    JWT_SECRET,
    JWT_ADMIN,
    STRIPE_SECRET_KEY
}