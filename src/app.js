"use strict";
import express           from 'express';
import path              from 'path';
import bodyParser        from 'body-parser';
import passport          from 'passport';
import flash             from 'express-flash';
import debug             from 'debug';
import chalk             from 'chalk';
import shortid           from 'shortid';

import purchasesRouter   from './controllers/purchases';
import usersRouter       from './controllers/users';
import initDB            from './config/db';
import initPassport      from './config/passport';
import session           from './config/redis';

let app = express();
let httpLogger = debug('http_');
let errorLogger = debug('error_');
httpLogger(`Starting application on port ${process.env.PORT || 3000}`)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    req.id = shortid.generate();
    httpLogger(`[${req.id}] ${req.method} ${req.path}`);
    next();
});

app.use('/purchases',                purchasesRouter);
app.post('/register',                usersRouter);
app.post('/login',                   usersRouter);
app.get('/logout',                   usersRouter);

app.use((err, req, res, next) => {
    errorLogger(chalk.white(`[${req.id}]`), chalk.red(err));
    res.send(err);
});

app.get('/', (req, res, next) => {
    res.send('hi');
});

app.listen(process.env.PORT || 3000);

module.exports = app;