const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')

function initialize(passport, getUserByEmail,) {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await getUserByEmail(email);
            if (user == null) {
                return done(null, false, { message: "sorry no user with that email" });
            }
            // Assuming passwords are hashed, use bcrypt to compare them
            const isMatch = password === user.password;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser)); // No await here
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (e) {
            done(e);
        }
    });
}

module.exports = initialize;
