import { uploader } from '../../util/cloudinary.js';

const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;

    const { path } = file;
    const url = await uploader(path);

    res.status(200).json(url);
  } catch (err) {
    res.status(405).json({ err: 'failed to upload' });
  }
};

export default uploadPhoto;
