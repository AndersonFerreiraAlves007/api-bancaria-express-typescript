import Router from 'express';
import { CreateDeposit, CreateDraft, CreateTransfer } from '../controllers';

const route = Router();

route.route('/deposit')
  .post(new CreateDeposit().handle.bind(new CreateDeposit()));

route.route('/transfer')
  .post(new CreateTransfer().handle.bind(new CreateTransfer()));

route.route('/draft')
  .post(new CreateDraft().handle.bind(new CreateDraft()));

export default route;
