import ArticleController from './ArticleController';
import AuthenticationController from './AuthenticationController';
import CommentController from './CommentController';
import { OrganizationController, PublicOrganizationController} from './organization';
import UserController from './UserController';

export const controllers = [
  AuthenticationController,
  UserController,
  OrganizationController,
  PublicOrganizationController,
  ArticleController,
  CommentController
];