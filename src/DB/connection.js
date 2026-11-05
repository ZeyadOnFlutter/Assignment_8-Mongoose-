import mongoose from 'mongoose';

export const dbConnection = async (app, PORT) => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    await mongoose.connect(process.env.DB_URL, { serverSelectionTimeoutMS: 5000 });
    console.log('DB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
};
