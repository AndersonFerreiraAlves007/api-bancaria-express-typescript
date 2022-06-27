import { v4 } from 'uuid';
import { APIResponse, User, AccountResponse } from '../models';
import { ExceptionTreatment, generateAccount } from '../utils';
import { AccountDataValidator } from '../validators';
import { AccountsTable } from '../clients/dao/postgres/accounts';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateAccountService {
  private userDataValidator = AccountDataValidator;

  private accountsTable = AccountsTable;

  private usersTable = UsersTable;

  public async execute(user: Partial<User>): Promise<APIResponse> {
    try {
      //console.log('lalala')
      const validUserData = new this.userDataValidator(user);

      if (validUserData.errors) {
        throw new Error(`400: ${validUserData.errors}`);
      }
      //console.log('lalala 1')
      const user2 = await new this.usersTable().list({
        document: validUserData.user.document
      })
      //console.log('lalala 1.1')
      let userData = null

      if(user2.length > 0) {
        userData = user2[0]
      } else {
        validUserData.user.id = v4();
        userData = await new this.usersTable().insert(validUserData.user as User);
      }

      //console.log('lalala 2')

      //console.log(userData)

      if (userData) {
        //console.log('lalala 3')
        const account = generateAccount()
//console.log(account)
        const insertedAccount = await new this.accountsTable().insert({
          accountNumber: account.accountNumber || '',
          accountVerificationCode: account.accountVerificationCode || '',
          agencyNumber: account.agencyNumber || '',
          agencyVerificationCode: account.agencyVerificationCode || '',
          balance: account.balance|| 0,
          id: v4(),
          userId: userData.id || ''
        });
        //console.log('lalala 4')
        const responseData: AccountResponse = {
          accountNumber: account.accountNumber || '',
          accountVerificationCode: account.accountVerificationCode || '',
          agencyNumber: account.agencyNumber || '',
          agencyVerificationCode: account.agencyVerificationCode || '',
          birthdate: userData.birthdate,
          document: userData.document,
          owner: userData.name
        }
        //console.log('lalala 5')
        return {
          data: responseData,
          messages: [],
        } as APIResponse;
      }

      //console.log('lalala 10')
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

export { CreateAccountService };
