import mongoose from 'mongoose';
import dns from 'node:dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS server override is restricted
}

export const connectDB = async (): Promise<void> => {
  // Reuse active connection if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️ MONGODB_URI environment variable is missing.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
