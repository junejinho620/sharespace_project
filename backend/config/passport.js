const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const { User, AuthProvider } = require('../models');
const fs = require('fs');
const path = require('path');

// ─── GOOGLE ─────────────────────────────────────────────────────
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  '/api/users/auth/google/callback',
  },
  verifyOAuthUser('google')
));

// ─── FACEBOOK ───────────────────────────────────────────────────
passport.use(new FacebookStrategy({
    clientID:        process.env.FACEBOOK_CLIENT_ID,
    clientSecret:    process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:     '/api/users/auth/facebook/callback',
    profileFields:   ['id','emails','name','displayName']
  },
  verifyOAuthUser('facebook')
));

// ─── APPLE ──────────────────────────────────────────────────────
passport.use(new AppleStrategy({
    clientID:       process.env.APPLE_CLIENT_ID,
    teamID:         process.env.APPLE_TEAM_ID,
    keyID:          process.env.APPLE_KEY_ID,
    privateKey:     fs.readFileSync(path.join(__dirname, '../keys/apple-private-key.p8')),
    callbackURL:    '/api/users/auth/apple/callback',
    scope:          ['name','email']
  },
  // Apple gives you idToken and profile
  async (accessToken, refreshToken, idToken, profile, done) => {
    // `profile.id` will be the subject (sub) from the idToken
    return verifyOAuthUser('apple')(accessToken, refreshToken, profile, done);
  }
));

// ─── Generic verify callback factory ─────────────────────────────
function verifyOAuthUser(provider) {
  return async (accessToken, refreshToken, profile, done) => {
    try {
      // 1️⃣ find existing AuthProvider row
      let auth = await AuthProvider.findOne({
        where: { provider, provider_user_id: profile.id },
        include: [{ model: User, as: 'user' }]
      });

      let user = auth?.user;
      if (!user) {
        // 2️⃣ no row: find or create User by email
        const email = (profile.emails?.[0]?.value || '').toLowerCase();
        user = await User.findOne({ where: { email } });
        if (!user) {
          user = await User.create({
            email,
            username: profile.displayName || `${provider}_${profile.id}`,
            verified: true
          });
        }
        // 3️⃣ create AuthProvider row
        auth = await AuthProvider.create({
          user_id:           user.id,
          provider,
          provider_user_id:  profile.id,
          password_hash:     null
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };
}

module.exports = passport;