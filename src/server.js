import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import roomRouter from './routes/roomRoutes.js'
import menuRouter from './routes/menuRoutes.js'
import guestRouter from './routes/guestRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'

dotenv.config();

const app = express();

//connect database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`)
    } catch (error) {
        console.error('failed to connect to mongoDB:', error)
    }
};

connectDB();

app.use(express.json());
app.use(cors())

//test route
app.get('/', (req, res) => {
    res.send('server is running')
});

//mount routers
app.use("/api/bookings", bookingRouter);
app.use("/api/guests", guestRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/menu", menuRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});