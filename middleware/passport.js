const { User } = require("../db/models");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
// jwt strategy
const JWTStrategy = require("passport-jwt").Strategy;
//Keys
const { JWT_SECRET } = require("../../config/keys");

//fromAutenticationAsBearearToken
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });

    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (passwordMatch) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error);
  }
});

// jwt token should only be given to specif route that we want it to access the given token in request

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false); //  401
    }
    try {
      const user = await User.findByPk(jwtPayload.id);
      done(null, user); //  no user,  401
    } catch (error) {
      done(error);
    }
  }
);
