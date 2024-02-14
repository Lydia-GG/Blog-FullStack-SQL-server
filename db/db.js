import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
export const db = mysql.createConnection(
  // {
  //   host: process.env.HOST,
  //   user: process.env.USER,
  //   password: process.env.PASSWORD,
  //   database: process.env.DATABASE,
  // },
  {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  () => console.log(`db connected..`)
);

export default db;
