import mongoose        from 'mongoose';
import debug           from 'debug';
import chalk           from 'chalk';
import                 './env';

let mongooseLogger = debug('mongoose_');

const options      = { keepAlive: 1 };
const dbConnection = `mongodb://\
${process.env.DB_USER}:\
${process.env.DB_PASSWORD}@\
${process.env.DB_URL}/\
${process.env.DB_NAME}`;

    
mongoose.connect(dbConnection, options);

mongoose.connection.on('connected', () => {
    mongooseLogger(chalk.bgBlue(`Mongoose connection open to ${process.env.DB_URL}`));
});

mongoose.connection.on('error', (err) => {
    mongooseLogger(chalk.bgRed(`Mongoose connection encountered error: ${err}`));
});

mongoose.connection.on('disconnected', () => {
    mongooseLogger(chalk.bgYellow('Mongoose connection disconnected'));
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        mongooseLogger(chalk.bgRed('Mongoose connection closed due to application termination'));
    });
});