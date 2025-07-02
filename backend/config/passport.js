const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, AuthProvider } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Look for an existing auth row
      let auth = await AuthProvider.findOne({
        where: { provider: 'google', provider_user_id: profile.id },
        include: [{ model: User, as: 'user' }]
      });

      let user = auth?.user;
      if (!user) {
        // 2️. No auth row: find or create the user by email
        const email = profile.emails[0].value.toLowerCase();
        user = await User.findOne({ where: { email } });
        if (!user) {
          user = await User.create({
            email,
            username: profile.displayName,
            verified: true
          });
        }
        // 3️. Create the auth row
        auth = await AuthProvider.create({
          user_id:           user.id,
          provider:          'google',
          provider_user_id:  profile.id,
          password_hash:     null
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));