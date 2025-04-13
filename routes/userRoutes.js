const bcrypt = require('bcrypt');
const { User } = require('../models');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope(null).findOne({ where: { email } }); // include password
  if (!user) return res.status(401).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Continue with token or session setup
  res.json({ message: 'Login successful', user });
});
