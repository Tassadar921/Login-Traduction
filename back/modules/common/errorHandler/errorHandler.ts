import logger from "../logger/logger";
import {Response, Request, NextFunction} from 'express';

module errorHandler {      
    export function logErrorMiddleware(err : Error, req : Request, res : Response, next : NextFunction) : void {
        logger.logger.info("Error handler middleware is functionning---------------");
        logError(err);
        returnError(err, req, res, next);
        next(err);
    }

    function logError (err : Error) : void {
        logger.logger.error(err);
    }
       
    function returnError (err : Error, req : Request, res : Response, next : NextFunction) : void {
        res.json({status: -2, message: "Something went wrong"});
    }
}

export default errorHandler;