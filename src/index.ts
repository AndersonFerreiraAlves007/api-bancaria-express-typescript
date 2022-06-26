import { app } from './server';
import { config } from './config';

app.listen(config.SERVER_PORT, () => console.log(`server listening on port ${config.SERVER_PORT}`));
