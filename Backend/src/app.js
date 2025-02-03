import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { handleSuccess } from "./controllers/payment.controllers";
const app = express();

//cors setup to allow cross origin request
app.use(cors(
    {
        origin:process.env.ORIGIN,
        credentials:true
    }
))

app.use(express.static("public"))

app.use(express.urlencoded(
    {
        extended: true,
        limit : "10mb" 
    }
))
app.use(express.json({limit:"10mb"}))
app.use(cookieParser());//to parse cookies

app.get('/payment/success/:transaction_uuid', handleSuccess)
export default app