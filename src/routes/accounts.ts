import Router from 'express';
import { CreateAccount, GetExtract } from '../controllers';

const route = Router();

route.route('/extract')
  .get(new GetExtract().handle.bind(new GetExtract()));

route.route('/create-account')
  .post(new CreateAccount().handle.bind(new CreateAccount()));

export default route;
