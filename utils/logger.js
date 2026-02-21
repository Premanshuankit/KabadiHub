const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => {
        return new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata'
        })
      }
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

module.exports = logger
