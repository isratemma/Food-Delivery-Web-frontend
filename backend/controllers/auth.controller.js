import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import User from '../models/user.model.js';

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exist.' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'password must be in 6 characters.' });
    }
    if (mobile.length < 11) {
      return res
        .status(400)
        .json({ message: 'Mobile number must be in 11 digits.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);
    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json(`sign up error ${error}`);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'incorrect Password' });
    }

    const token = await genToken(user._id);
    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`sign In error ${error}`);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"log out sucessfully"})
  } catch (error) {
    return res.status(500).json(`sign Out error ${error}`);
  }
};