import db from '../../db/db.js';
import jwt from 'jsonwebtoken';

const editText = (text) => {
  return text.substring(text.indexOf('>') + 1, text.lastIndexOf('<'));
};

export const getAllPosts = (req, res) => {
  const q = req.query.cat
    ? 'SELECT * FROM posts WHERE category=?'
    : 'SELECT * FROM posts';

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q = `SELECT p.id, u.username,u.img as user_img, p.title, p.desc, p.img, p.category, p.date FROM users u JOIN posts p ON u.id = p.user_id WHERE p.id = ?`;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const createPost = (req, res) => {
  const { title, desc, img, category, date } = req.body;
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q =
      'INSERT INTO posts(`title`, `desc`, `img`, `category`, `date`,`user_id`) VALUES (?)';

    const values = [title, desc, img, category, date, userInfo.id];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json('Post has been created.');
    });
  });
};

export const updatePost = (req, res) => {
  const { title, desc, img, category } = req.body;
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const postId = req.params.id;
    const q =
      'UPDATE posts SET `title`=?,`desc`=?,`img`=?,`category`=? WHERE `id` = ? AND `user_id` = ?';

    const values = [title, desc, img, category];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).status(200).json('Post has been updated.');
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not Authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(500).json('Token is not valid');
    const q = `DELETE FROM posts WHERE id = ? AND user_id = ?`;

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(403).json('You can delete only your posts');

      return res.status(200).json('Post has been deleted');
    });
  });
};
