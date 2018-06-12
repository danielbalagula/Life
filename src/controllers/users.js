import express              from 'express';
import passport             from 'passport';
import to                   from 'await-to-js';
import debug                from 'debug';

import User                 from  '../models/users/User';
import loginValidator       from '../middleware/login.post.validation';
import registerValidator    from '../middleware/register.post.validation';

const usersLogger = debug('users_');

let usersRouter = express.Router();

usersRouter.post('/register', registerValidator, async (req, res, next) => {
    if (req.user) {
        res.status(400);
        return next('Already logged in');
    }
    const newUser = new User({
        email      : req.body.email,
        password   : User.generateHash(req.body.password)
    });
    let [findErr, existingUser] = await to(User.findOne({email: req.body.email}));
    if (findErr) return next(findErr);
    if (existingUser) {
        res.status(409);
        return next('Username already taken');
    }
    let [saveErr, savedUser] = await to(newUser.save());
    if (saveErr) return next(saveErr);
    
    req.logIn(savedUser, loginErr => {
        if (loginErr) return next(loginErr);
        usersLogger(`${savedUser.email} successfully registered`);
        res.status(201).send('Successfully registered');
    }); 
});

usersRouter.post('/login', loginValidator, (req, res, next) => {
    if (req.user) {
        res.status(400);
        return next('Already logged in');
    }
    passport.authenticate('local', (authErr, user, info) => {
        if (authErr) return next(authErr);
        if (!user) return res.send(info);

        req.logIn(user, loginErr => {
            if (loginErr) return next(loginErr);
            usersLogger(`${user.email} successfully logged in`);
            res.send(user);
        }); 
    })(req, res, next);
});

usersRouter.get('logout', (req, res, next) => {
    if (!req.user) {
        res.status(422);
        return next('Not logged in');
    }
    let user = req.user;
    req.logout();
    req.session.destroy(err => {
        usersLogger(`${user.email} successfully logged out`);
        req.user = null;
        return res.status(200).send('Successfully logged out')
    });
});

module.exports = usersRouter;
