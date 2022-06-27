import { Request, Response } from 'express';
import { CreateTransferService } from '../services';
import { ResponseWriter } from '../utils';
import { TransferBody } from '../models'

class CreateTransfer {
  private service = CreateTransferService;

  private responseWriter = ResponseWriter;

  public async handle(req: Request<{}, {}, TransferBody, {}>, res: Response) {
    try {
      const response = await new this.service().execute(req.body);
      this.responseWriter.success(res, 201, response);
    } catch (err) {
      this.responseWriter.error(res, err as Error);
    }
  }
}

export { CreateTransfer };
