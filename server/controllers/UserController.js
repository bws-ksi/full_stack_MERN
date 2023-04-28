import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '24h' }
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'ne udalos zaregatsya' });
  }
}
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not foundd' });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(403).json({ message: 'ne verniy login ili parrol' });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '24h' }
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'ne udalos authorazation' });
  }
}
export const getMe = async(req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
    if(!user){
      return res.json({message:'user not found'})
    }
    const { passwordHash, ...userData } = user._doc;

    
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'net dostupa' });
  }
}