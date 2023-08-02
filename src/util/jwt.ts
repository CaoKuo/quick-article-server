import jwt from "jsonwebtoken"
// util.promisify 方法将异步函数转换为基于 Promise 的函数。
import { promisify } from "util"

// 用于生成 JWT 令牌
export const sign = promisify(jwt.sign);

// 用于验证 JWT 令牌的有效性
export const verify = promisify(jwt.verify);

// 用于解码 JWT 令牌的内容，但不会验证令牌的有效性
export const decode = promisify(jwt.decode);