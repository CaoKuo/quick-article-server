import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError, buildCheckFunction, ValidationChain } from "express-validator";

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
        })

        res.status(400).json({
            errors: customErrors,
        })
    }
}

