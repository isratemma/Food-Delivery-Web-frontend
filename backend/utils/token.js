import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '6d',
    });
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getToken;
