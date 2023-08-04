import util from 'util';
import { Request, Response, NextFunction } from 'express';

const errorHandler = () => {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({
            error: util.format(error)
        })
    }
}

export default errorHandler;