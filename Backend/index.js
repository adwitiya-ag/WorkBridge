import { configDotenv } from "dotenv";
configDotenv({path: "./.env"});
import app from "./app.js";
import connectDB from "./src/db/index.js"

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen( port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch((error) => {
    console.log('Error while connecting to DB', error);
    process.exit(1);
})
