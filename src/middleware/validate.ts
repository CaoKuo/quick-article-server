import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError, buildCheckFunction, ValidationChain, Location } from 'express-validator';
import { isValidObjectId as checkValidObjectId } from 'mongoose';

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for(const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) break;
        }

        const errors: Result<ValidationError> = validationResult(req);

        if(errors.isEmpty()) {
            return next();
        }

        const customErrors = errors.array().map(error => {
            return {
                code: -1,
                msg: error.msg,
            };
        });

        res.status(400).json({
            errors: customErrors,
        });
    };
};

export const isValidObjectId = (location: Location[], fields?: string | string[] | undefined) => {
    return buildCheckFunction(location)(fields).custom(async value => {
        if (!checkValidObjectId(value)) {
            return Promise.reject(new Error('ID 不是一个有效的 objectID'));
        }
    });
};

