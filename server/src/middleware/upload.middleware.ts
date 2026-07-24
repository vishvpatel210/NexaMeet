import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'recordings');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.wav';
    cb(null, `rec_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/aac'];
  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.endsWith('.wav') || file.originalname.endsWith('.opus')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid audio file type. Only WAV, Opus, WebM, or MP3 audio files are supported.'));
  }
};

export const audioUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB max audio file size limit
  },
  fileFilter
});
