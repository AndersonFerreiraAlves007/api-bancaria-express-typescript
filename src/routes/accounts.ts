import Router from 'express';
import { CreateAccount, GetExtract } from '../controllers';

const route = Router();

route.route('/extract')
  .get(new CreateAccount().handle.bind(new CreateAccount()));

route.route('/create-account')
  .post(new GetExtract().handle.bind(new GetExtract()));

export default route;
