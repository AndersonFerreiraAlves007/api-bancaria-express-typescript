import express from 'express';
import Accounts from './accounts';
import Transactions from './transactions';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(Accounts);
app.use(Transactions);

export default app;
