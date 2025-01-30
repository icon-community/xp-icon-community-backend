import * as winston from 'winston';
import 'winston-daily-rotate-file';

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = (timestamp as string).slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

const customFormat = winston.format.combine(
  // winston.format.colorize(),
  winston.format.splat(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    ({ level = 'info', message, timestamp, req, err, ...metadata }) => {
      if (!req) {
        req = { headers: {} };
      }

      let msg = `${timestamp} [${level}] : ${message} `;
      const json: any = {
        timestamp,
        level,
        ...metadata,
        message,
        error: {},
      };

      if (err) {
        json.error = (err as Error).stack || err;
      }

      msg = JSON.stringify(json);
      return msg;
    },
  ),
);

void customFormat;

export class Logging {
  dailyRotateFileTransport: any = null;
  myFormat: winston.Logform.Format = null;
  createLoggerConfig: winston.LoggerOptions = null;
  constructor() {
    /** A transport for winston which logs to a rotating file based on date**/
    this.dailyRotateFileTransport = new winston.transports.DailyRotateFile({
      filename: `logs/app_log-%DATE%.log`,
      zippedArchive: false,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    });

    /**
     * Custom log format tailored to our application's requirements
     */
    this.myFormat = alignedWithColorsAndTime;
    this.createLoggerConfig = {
      level: 'info',
      format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.splat(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        this.myFormat,
      ),

      transports: [
        new winston.transports.Console({ level: 'info' }),
        this.dailyRotateFileTransport,
      ],
    };
  }
}
