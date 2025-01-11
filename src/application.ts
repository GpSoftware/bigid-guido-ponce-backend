import 'reflect-metadata';

import express, { json, Application as ExApplication, Handler } from 'express';
import { controllers } from './controllers';
import { MetadataKeys, IRouter } from './utils/decorators/types';
import { Sequelize } from './database';
import cors from 'cors';

class Application {
  private readonly _instance: ExApplication;

  get instace(): ExApplication {
    return this._instance;
  }

  constructor() {
    this._instance = express();
    this._instance.use(json());
    this._instance.use(cors());
    this.initializeDatabase();
    this.reigsterRouters();
  }

  private reigsterRouters() {
    const info: Array<{ api: string, handler: string }> = [];

    controllers.forEach(controller => {
      const controllerInstance: { [handleName: string]: Handler } = new controller() as any;

      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controller);
      const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controller);

      const exRouter = express.Router();

      routers.forEach(({ method, path, middlewares, handlerName }) => {

        if (middlewares && middlewares.length > 0) {
          exRouter[method](path, ...middlewares, controllerInstance[String(handlerName)].bind(controllerInstance))
        } else {
          exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance))
        }
        
        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath}${path}`,
          handler: `${controller.name}.${String(handlerName)}`,
        });
      });
      this._instance.use(basePath, exRouter);
      
      console.table(info);
    })
  }

  private initializeDatabase() {
    Sequelize.singleton().initializeDatabase();
  }
}

export default new Application();