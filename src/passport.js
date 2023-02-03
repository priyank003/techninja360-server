const User = require("./models/user/user.mongo");
const Merchant = require("./models/merchant/schema/merchant.mongo");
const passport = require("passport");

const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const LocalStrategy = require("passport-local");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);

passport.use(
  "merchant-local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    Merchant.authenticate()
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.server_url}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const token = jwt.sign(
        {
          user_id: profile.id,
          email: profile.emails[0].value,
        },
        process.env.JWTSecretKey,
        {
          expiresIn: "1h",
        }
      );

      var userData = {
        user_id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        photos: profile.photos[0].value,
        token,
      };

      await User.updateOne(
        { user_id: profile.id },
        {
          ...userData,
        },
        {
          upsert: true,
        }
      );

      return done(null, userData);

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.server_url}/api/auth/facebook/callback`,
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile._json);
      // const { email, first_name, last_name } = profile._json;

      // const token = jwt.sign(
      //   {
      //     user_id: profile.id,
      //     email: profile.emails[0].value,
      //   },
      //   process.env.JWTSecretKey,
      //   {
      //     expiresIn: "1h",
      //   }
      // );

      // const userData = {
      //   email,
      //   firstName: first_name,
      //   lastName: last_name,
      // };

      // console.log("in call back fn", userData);
      // // new userModel(userData).save();
      // done(null, profile);
    }
  )
);
