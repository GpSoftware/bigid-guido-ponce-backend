import { decrypt, encrypt } from '../libs/encrypt';
import { JSONWebToken } from '../libs/jwt';
import { UserRepository } from '../repositories/UserRepository';
import { SignIn, SignUp } from '../types/authentication';
import { Controller, Post, ValidateBody } from '../utils/decorators';
import { Request, Response } from 'express';
import { STATUS } from '../utils/status';
import { PrivateRequest } from '../utils/decorators/types/decorators';

@Controller('/auth')
export default class AuthenticationController {

  @Post('/signUp')
  @ValidateBody(SignUp)
  public async signUp(req: Request, res: Response): Promise<Response> {
    const { username, email, password, organizationId } = req.body;

    try {
      const encryptedPassword = await encrypt(password, password);

      const user = await UserRepository.singleton.create({
        email: email,
        username: username,
        password: encryptedPassword,
        organization_id: organizationId,
      });

      const jwt = await JSONWebToken.singleton.generate({
        userId: await encrypt(String(user.id), process.env.JWT_PAYLOAD_PASSPHRASE || ''),
        username: user.username,
      });

      return res.json({
        success: true,
        result: {
          token: jwt,
          username: user.username,
        }
      });
    } catch (error) {
      return res.json({
        success: false,
      });
    }
  }

  @Post('/signIn')
  @ValidateBody(SignIn)
  public async signIn(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await UserRepository.singleton.findOne({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        throw new Error('User not Found');
      }
  
      const decryptedPassword = await decrypt(user.password, password);
      
      if (decryptedPassword !== password) {
        throw new Error('Invalid Password');
      }

      const jwt = await JSONWebToken.singleton.generate({
        userId: await encrypt(String(user.id), process.env.JWT_PAYLOAD_PASSPHRASE || ''),
        username: user.username,
      });

      return res.json({
        success: true,
        result: {
          token: jwt,
          username: user.username,
        }
      });
    } catch (error) {
      return res.json({
        success: false,
      });
    }
  }

  @Post('/authenticate', [JSONWebToken.singleton.verify])
  public async authenticate(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      if (!req.user || !req.user.userId) {
        throw new Error('Access denied');
      }

      const user = await UserRepository.singleton.findByPk(req.user.userId as number);
      if (!user) {
        throw new Error('User Not Found');
      }

      const jwt = await JSONWebToken.singleton.generate({
        userId: await encrypt(String(user.id), process.env.JWT_PAYLOAD_PASSPHRASE || ''),
        username: user.username,
      });

      return res.status(STATUS.OK).json({
        success: true,
        result: {
          username: user.username,
          email: user.email,
          token: jwt,
        },
      });
    } catch (error) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: 'Authentication Error',
      });
    }
  }
}