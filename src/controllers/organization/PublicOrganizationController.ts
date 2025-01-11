import { Response } from 'express';
import { Controller, Get } from '../../utils/decorators';
import { STATUS } from '../../utils/status';
import { PrivateRequest } from '../../utils/decorators/types';
import { OrganizatyionRepository } from '../../repositories/OrganizationRepository';

@Controller('/pub/organizations')
export default class PublicOrganizationController {

  @Get('/')
  public async getOrganizations(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const organizations = await OrganizatyionRepository.singleton.findOrganizationNames();

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          organizations,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get organizations',
      });
    }
  }
}