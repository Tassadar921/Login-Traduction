import {Logger, createLogger, transports, format } from "winston";

module logger{
    export let logger : Logger;

    export function init() : void{
        logger = createLogger({
            transports: [
                new transports.Console({
                    level: "debug",
                    handleExceptions: true,
                    format: format.combine(
                        format.colorize(),
                        format.timestamp(),
                        format.align(),
                        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                }),
                new transports.File({
                    filename: "logs/error.log",
                    level: "error",
                    handleExceptions: true,
                    format: format.combine(
                        format.timestamp(),
                        format.align(),
                        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                }),
                new transports.File({
                    filename: "logs/combined.log",
                    level: "info",
                    handleExceptions: true,
                    format: format.combine(
                        format.timestamp(),
                        format.align(),
                        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                }),
            ],
        });
    }
}

export default logger;