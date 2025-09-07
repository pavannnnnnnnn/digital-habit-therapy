const mongoose = require('mongoose');
require('dotenv').config();

async function dropDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-habit-therapy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully');

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error dropping database:', error);
  }
}

dropDatabase();
