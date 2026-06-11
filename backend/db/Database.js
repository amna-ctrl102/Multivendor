const mongoose=require("mongoose");

const connectDatabase = async () => {
    const data = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB connected to the server: ${data.connection.host}`);
};

module.exports= connectDatabase;