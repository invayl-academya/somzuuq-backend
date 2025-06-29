import mongoose from "mongoose";

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connection is : ${conn.connection.host}`.yellow.bold);
  } catch (error) {
    console.log(`error : ${error.message}`);
    process.exit(1);
  }
};

export default db;
