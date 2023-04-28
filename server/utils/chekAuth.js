import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');
      req.userId = decoded._id;
      next()
    } catch (error) {
      return res.status(403).json({ message: 'Have not access' });
    }
  } else {
    return res.status(403).json({ message: 'Have not access' });
  }

  // console.log(token);
  // res.send(token);
  // next()
};
