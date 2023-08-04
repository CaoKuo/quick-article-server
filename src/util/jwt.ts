import jwt, { Secret, SignOptions, VerifyCallback, Jwt } from 'jsonwebtoken';
// util.promisify 方法将异步函数转换为基于 Promise 的函数。
import { promisify } from "util"

// 函数有多个重载，而 TypeScript 对函数类型推断的能力有限。因此，在您不使用类型断言时，TypeScript 无法正确地推断出 promisify(jwt.sign) 的准确函数签名。
// 用于生成 JWT 令牌
export const sign = promisify(jwt.sign) as (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret | null,
    options?: SignOptions | (SignOptions & { algorithm: "none" }) | undefined
  ) => Promise<string>;

// 用于验证 JWT 令牌的有效性
export const verify = promisify(jwt.verify) as (
    token: string,
    secretOrPublicKey: Secret,
    options?: jwt.VerifyOptions
) => Promise<VerifyCallback>;

// 用于解码 JWT 令牌的内容，但不会验证令牌的有效性
export const decode = promisify(jwt.decode) as (
    token: string,
    options: jwt.DecodeOptions & { complete: true }
) => Promise<Jwt>;