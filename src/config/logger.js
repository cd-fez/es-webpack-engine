import winston from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'bold red',
    debug: 'bold blue',
    warn: 'bold yellow',
    data: 'bold grey',
    info: 'bold green',
    verbose: 'bold cyan',
    silly: 'bold magenta',
  },
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all',
    }),
  ],
  levels: config.levels,
  colors: config.colors,
});

export default logger;
