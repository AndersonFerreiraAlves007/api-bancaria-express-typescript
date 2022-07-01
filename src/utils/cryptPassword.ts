const bcrypt = require('bcrypt');
const saltRounds = 10;

async function cryptPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds)
}

export {cryptPassword}
