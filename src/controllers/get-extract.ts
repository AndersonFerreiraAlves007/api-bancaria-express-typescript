import { Request, Response } from 'express';
import { GetExtractService } from '../services';
import { ResponseWriter } from '../utils';
import { FiltersExtract } from '../models';

function adaptaQuery(query: any): FiltersExtract {
  return {
    accountNumber: query.accountNumber,
    accountVerificationCode: query.accountVerificationCode,
    agencyNumber: query.agencyNumber,
    agencyVerificationCode: query.agencyVerificationCode,
    document: query.document,
  };
}

class GetExtract {
  private service = GetExtractService;

  private responseWriter = ResponseWriter;

  public async handle(req: Request, res: Response) {
    try {
      console.log('get extract')
      //console.log(req.query)
      const response = await new this.service().execute(adaptaQuery(req.query));
      this.responseWriter.success(res, 201, response);
    } catch (err) {
      this.responseWriter.error(res, err as Error);
    }
  }
}

export { GetExtract };
