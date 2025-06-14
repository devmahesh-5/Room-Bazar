import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {rateLimit} from 'express-rate-limit'
import { unVerifiedUserRemoval,notifyUnVerifiedUser, makeRoomAvailable } from "./constants.js";
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(',');
console.log('Allowed Origins:', allowedOrigins);
//cors setup to allow cross origin request

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cors({
  origin: function(origin, callback) {
  const allowedOrigins = process.env.CORS_ORIGIN.split(',');
  console.log('Request Origin:', origin);
  
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);  // allow
  } else {
    callback(null, false); // deny without throwing error
  }
}

}));

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 10 minutes
	limit: 2000, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
    message:'Server Overloaded due to high traffic'
})

const emergencyLimiter = rateLimit({
    windowMs:  10*1000,
    limit: 50, 
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    message:'Server Overloaded'
})
app.use(emergencyLimiter)
app.use(limiter)//middleware to limit requests
app.use(express.static("public"))//middleware to serve static files

app.use(express.urlencoded(
    {
        extended: true,
        limit : "10mb" 
    }
))
app.use(express.json({limit:"10mb"}))
app.use(cookieParser());//to parse cookies

notifyUnVerifiedUser();
unVerifiedUserRemoval()
makeRoomAvailable()
// app.post('/payment/success/:transaction_uuid', handleFailure)

//import routes
import userRouter from "./routes/user.routes.js";
import roomRouter from "./routes/room.routes.js";
import locationRouter from "./routes/location.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import reviewRouter from "./routes/review.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import roommateRouter from "./routes/roommate.routes.js";
import favouriteRouter from "./routes/favourite.routes.js";
import reportRouter from "./routes/report.routes.js";
import refundRouter from "./routes/refund.routes.js";
import messageRouter from "./routes/message.routes.js";
//use routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/roommates', roommateRouter);
app.use('/api/v1/favourites', favouriteRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/refunds', refundRouter);
app.use('/api/v1/messages', messageRouter);
// app.post('/payment/failure/:transaction_uuid', handleFailure)
export default app