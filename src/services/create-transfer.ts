import { v4 } from 'uuid';
import { APIResponse, User } from '../models';
import { ExceptionTreatment } from '../utils';
import { UserDataValidator } from '../validators';
import { TransactionsTable } from '../clients/dao/postgres/transactions';

class CreateTransferService {
  private userDataValidator = UserDataValidator;

  private usersTable = TransactionsTable;

  public async execute(user: User): Promise<APIResponse> {
    try {
      const validUserData = new this.userDataValidator(user);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      validUserData.user.id = v4();

      const insertedUser = await new this.usersTable().insert(validUserData.user as User);

      if (insertedUser) {
        return {
          data: validUserData.user,
          messages: [],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ['an error occurred while creating user'],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
                error as Error,
                500,
                'an error occurred while inserting user on database',
      );
    }
  }
}

export { CreateTransferService };
