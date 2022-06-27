import { Request, Response } from 'express';
import { GetExtractService } from '../services';
import { ResponseWriter } from '../utils';
import { FiltersExtract } from '../models';

class GetExtract {
  private service = GetExtractService;

  private responseWriter = ResponseWriter;

  public async handle(req: Request<{}, {}, {}, FiltersExtract>, res: Response) {
    try {
      const response = await new this.service().execute(req.query);
      this.responseWriter.success(res, 201, response);
    } catch (err) {
      this.responseWriter.error(res, err as Error);
    }
  }
}

export { GetExtract };
