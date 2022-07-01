import bcrypt from 'bcrypt';

async function autorizationOperation(password: string, hash: string): Promise<Boolean> {
  return await bcrypt.compare(password, hash);
}

export { autorizationOperation }
