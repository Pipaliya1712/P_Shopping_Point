import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const connect = await mongoose.connect("mongodb+srv://parthpipaliya1112:bUINZfw1yl7uVnzM@pshoppingpoint.xsg1r7k.mongodb.net/P_Shopping_Point?retryWrites=true&w=majority&appName=PShoppingPoint",{useNewUrlParser: true, useUnifiedTopology:true})
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