import { v4 } from 'uuid';
import { APIResponse, AccountBody, AccountResponse, User } from '../models';
import { ExceptionTreatment, generateAccount } from '../utils';
import { AccountDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateAccountService {
  private userDataValidator = AccountDataValidator;

  private accountsTable = AccountsTable;

  private usersTable = UsersTable;

  public async execute(body: AccountBody): Promise<APIResponse> {
    try {
      const validUserData = new this.userDataValidator(body);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }

      const userList = await new this.usersTable().list({
        document: validUserData.user.document
      })

      let user = null

      if(userList.length > 0) {
        user = userList[0]
      } else {
        validUserData.user.id = v4();
        user = await new this.usersTable().insert(validUserData.user as User);
      }

      if (user) {

        const accountBody = generateAccount()
        const account = await new this.accountsTable().insert({
          account_number: accountBody.account_number || '',
          account_verification_code: accountBody.account_verification_code || '',
          agency_number: accountBody.agency_number || '',
          agency_verification_code: accountBody.account_verification_code || '',
          balance: 0,
          id: v4(),
          user_id: user.id
        });

        const responseData: AccountResponse = {
          accountNumber: account.account_number,
          accountVerificationCode: account.account_verification_code,
          agencyNumber: account.agency_number,
          agencyVerificationCode: account.agency_verification_code,
          birthdate: user.birthdate,
          document: user.document,
          owner: user.name
        }

        return {
          data: responseData,
          messages: [],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ['an error occurred while account user'],
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

export { CreateAccountService };
