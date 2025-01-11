import { config } from 'dotenv';
config({ path: '.env.development.local' })

import application from './src/application';
import * as http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer(application.instace);

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

export default server;