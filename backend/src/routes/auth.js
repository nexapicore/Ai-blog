const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

router.get('/x/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { data } = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:3000/auth/x/callback',
    });

    const { id_token } = data;
    const decoded = jwt.decode(id_token);

    let user = await User.findOne({ xId: decoded.sub });
    if (!user) {
      user = await User.create({
        xId: decoded.sub,
        xUsername: decoded.nickname,
        xProfilePhoto: decoded.picture,
        name: decoded.name,
        email: decoded.email || null,
        roles: ['user'],
      });
    } else {
      user.xProfilePhoto = decoded.picture;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`http://localhost:3001/login?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'X authentication failed' });
  }
});

module.exports = router;
