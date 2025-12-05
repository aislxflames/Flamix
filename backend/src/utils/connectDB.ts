import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    if (!conn) {
      console.log("Failed to connect, Please Enter Valid Mongo URI");
    }
    console.log("Connected to the", conn.connection.host);
    console.log("Database Name:", conn.connection.name);
  } catch (err) {
    console.error("Somthing went wrong in database", err);
  }
}
