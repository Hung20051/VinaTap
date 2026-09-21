const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const getCallbackURL = () => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;
  if (process.env.RENDER_EXTERNAL_URL) {
    return `${process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback`;
  }
  return `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`;
};

const isGoogleOAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

if (isGoogleOAuthEnabled) passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getCallbackURL(),
    },
    // Passport gắn profile vào req.user rồi truyền sang googleCallback controller
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ),
);

if (!isGoogleOAuthEnabled) {
  console.warn("Google OAuth is disabled: missing Google OAuth credentials.");
}

module.exports = { passport, isGoogleOAuthEnabled };
