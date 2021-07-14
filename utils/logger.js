const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(info => `${"\033[90m"}${info.timestamp}${"\033[0m"} [${info.level}] ${info.message}`)
            ),
            level: 'debug'
        }),
        new transports.File({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(info => `${info.level.toUpperCase().padEnd(7, ' ')} ${info.timestamp} ${info.message}`)
            ),
            level: 'warn',
            filename: `${__dirname}/../logs/default.log`,
            maxsize: 2000000,
            maxFiles: 10
        })
    ]
})