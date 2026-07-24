import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 NexaMeet Express Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health endpoint: http://localhost:${PORT}/api/v1/health`);
});
