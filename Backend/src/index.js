import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({ path: '../.env' });//configuring dotenv

//.config is used to configure dotenv so that w can access the environment variables with process.env



connectDB().then(() => {
    app.on('error', (error) => {
        throw error;
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
        console.log("Database connection Error", error);
        process.exit(1);
    });
