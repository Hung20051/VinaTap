const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://vinatapvietnam.onrender.com/api/auth/google/callback"
    : "http://localhost:5000/api/auth/google/callback");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    // Passport gắn profile vào req.user rồi truyền sang googleCallback controller
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ),
);

module.exports = passport;
