import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrivateRequest } from '../utils/decorators/types';
import { STATUS } from '../utils/status';
import { UserRepository } from '../repositories/UserRepository';
import { decrypt } from './encrypt';

const JWT_SECRET = process.env.JWT as string;

export class JSONWebToken {
  public static singleton = new JSONWebToken();

  public async generate(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d',
      }, (error, token) => {
        if (error || !token) {
          return reject(error);
        }

        resolve(token);
      });
    });
  }

  public async verify(req: PrivateRequest, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(STATUS.UNAUTHORIZED).send({
        message: 'Access denied'
      });
      return next('access denied');
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = typeof payload === 'string' ? JSON.parse(payload) : payload;

        const userId = await decrypt(user.userId, process.env.JWT_PAYLOAD_PASSPHRASE || '');
        if (!userId || (userId && !Number(userId))) {
          throw new Error('Missing User Id');
        }

        const userExists = await UserRepository.singleton.findByPk(Number(userId));
        if (!userExists) {
          throw new Error('Unknown user');
        }

        req.user = {
          ...user,
          userId,
        };
        next();
    } catch (error) {
        res.status(STATUS.UNAUTHORIZED).send({
          message: 'Access denied'
        });
    }
}

}