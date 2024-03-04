import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const connect = await mongoose.connect("mongodb://localhost:27017/p_shopping_point",{useNewUrlParser: true, useUnifiedTopology:true})
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