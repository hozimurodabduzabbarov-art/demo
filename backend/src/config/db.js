const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI ||  'mongodb+srv://hozimurodabduzabbarov_db_user:HAx1b8fzZmfl8FbQ@gw-60.vxnl5ji.mongodb.net/?appName=GW-60';
    await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${uri}`);
  } catch (err) {
    console.error('[DB] Connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
