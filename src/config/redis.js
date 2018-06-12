import connectRedis      from 'connect-redis'
import session           from 'express-session';
import redis             from 'redis';
import debug             from 'debug';
import chalk             from 'chalk';
import                   '../env';

let redisLogger = debug('redis_');

const RedisStore = connectRedis(session);
const client     = redis.createClient({
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
});

client.on('ready', () => {
    redisLogger(chalk.bgBlue(`Redis connection open to ${process.env.REDIS_URL}`));
});

client.on('error', (err) => {
    redisLogger(chalk.bgYellow(`Redis connection encountered error: ${err}`));
});

client.on('end', () => {
    redisLogger(chalk.bgYellow('Redis connection disconnected'));
});

process.on('SIGINT', () => {
    client.quit();
    redisLogger(chalk.bgRed('Redis connection closed due to application termination'));
});

module.exports = session({
    store: new RedisStore({
        client: client
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
})