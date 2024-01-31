import mongoose from "mongoose";

export const Connection = async (username, password) => {
  const mongoURL = `mongodb+srv://${username}:${password}@buzz-talk.cawopel.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database", error);
  }
};
