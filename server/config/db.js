const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    const topology = await conn.connection.db.admin().command({ hello: 1 });
    conn.connection.supportsTransactions = Boolean(topology.setName || topology.msg === 'isdbgrid');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB transactions: ${conn.connection.supportsTransactions ? 'enabled' : 'standalone fallback mode'}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
