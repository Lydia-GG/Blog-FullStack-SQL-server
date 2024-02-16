import express from 'express';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import photoRoutes from './routes/uploadPhoto.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db/db.js';
// import path from 'path';
// import multer from 'multer';

const app = express();
// const __dirname = path.resolve();

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json());
app.use(cookieParser());

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../client/public/upload');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({ storage });

// app.post('/api/upload', upload.single('file'), function (req, res) {
//   const file = req.file;
//   res.status(200).json(file);
// });
// app.use(express.static(path.join(__dirname, './client/build')));

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', photoRoutes);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './client/build/index.html'));
// });
// app.get('', (req, res) => {
//   res.send('welcome to blog sql project');
// });
app.get('', (req, res) => {
  db.query('SELECT * FROM posts WHERE id=1', (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

app.listen(8000, () => console.log(`server is running...`));
