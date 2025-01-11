import { Response } from 'express';
import { Controller, Delete, Get, Patch, Post, ValidateBody } from '../../utils/decorators';
import { STATUS } from '../../utils/status';
import { JSONWebToken } from '../../libs/jwt';
import { PrivateRequest } from '../../utils/decorators/types';
import { OrganizatyionRepository } from '../../repositories/OrganizationRepository';
import { OrganizationBody } from '../../types/organization';

@Controller('/organizations')
export default class OrganizationController {

  @Get('/:organizationId', [JSONWebToken.singleton.verify])
  public async getOrganization(req: PrivateRequest, res: Response) : Promise<Response> {
    try {
      const organization = await OrganizatyionRepository.singleton.findByPk(Number(req.params.organizationId));

      if (!organization) {
        throw new Error('Organization Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          organization,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot get organization',
      });
    }
  }

  @Post('/', [JSONWebToken.singleton.verify])
  @ValidateBody(OrganizationBody)
  public async createOrganization(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const organization = await OrganizatyionRepository.singleton.create(req.body);

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          organization,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot create organization',
      });
    }
  }

  @Patch('/:organizationId', [JSONWebToken.singleton.verify])
  @ValidateBody(OrganizationBody)
  public async updateOrganization(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const organization = await OrganizatyionRepository.singleton.update(Number(req.params.organizationId), req.body);

      if (!organization) {
        throw new Error('Organization Not Found');
      }

      return res.status(STATUS.OK).json({
        success: true,
        data: {
          organization,
        },
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot update organization',
      });
    }
  }

  @Delete('/:organizationId', [JSONWebToken.singleton.verify])
  public async deleteOrganization(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      await OrganizatyionRepository.singleton.delete(Number(req.params.organizationId));

      return res.status(STATUS.OK).json({
        success: true,
      });
    } catch (error: any) {
      return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: error.message || 'Cannot delete organization',
      });
    }
  }

  @Get('/', [JSONWebToken.singleton.verify])
  public async getOrganizations(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const organizations = await OrganizatyionRepository.singleton.findOrganizations();

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