import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true, useUnifiedTopology:true})
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        )
    }catch(error){
        console.log(error)
    }
}

export {connectDB} ;