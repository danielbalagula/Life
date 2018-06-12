import passport      from 'passport';
import passportLocal from 'passport-local';
import debug         from 'debug';
import to            from 'await-to-js';
import User          from './models/users/User';

const LocalStrategy = passportLocal.Strategy;
const authLogger = debug('auth_')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    let [err, user] = await to(User.findById(id));
    done(err, user);
});

passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password'    
    },
    async (email, password, done) => {
        let [findErr, user] = await to(User.findOne({email: email.toLowerCase()}));
        if (findErr) return done(findErr);
        if (!user) return done(null, false, {msg: `Email ${email} not found`});
        
        let [validPassErr, isMatch] = await to(user.isValidPassword(password));
        if (validPassErr) return done(validPassErr);
        if (isMatch) return done(null, user);
        
        return done(null, false, {msg: 'Invalid e-mail or password'});
    }
));

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        authLogger(`${req.user.email} is authenticated`);
        return next();
    }
    res.status(401);
    next('Must be logged in');
};