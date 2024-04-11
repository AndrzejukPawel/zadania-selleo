import express from 'express';
import { IRequest } from './IRequest';

import * as dotenv from 'dotenv'
import { CreateDirectory } from './requestHandlers/createDirectory';
import { CreateFile } from './requestHandlers/createFile';
import { ReadDirectory } from './requestHandlers/readDirectory';
import { ReadFile } from './requestHandlers/readFile';
import { Move } from './requestHandlers/move';

dotenv.config();

const app = express()
  .use(express.json({ limit: 1073741824 }));
const requests: IRequest[] = [
  new CreateDirectory(),
  new CreateFile(),
  new ReadDirectory(),
  new ReadFile(),
  new Move(),
];
console.log(`Registering requests:`)
requests.forEach((reqDef) => {
  app[reqDef.httpMethod](reqDef.path, (req, res) => {
    const bodyStr = JSON.stringify(req.body);
    console.log(`${req.method} ${req.url} ${(bodyStr.length > 4096 ? `${bodyStr.slice(0, 4096)}...` : bodyStr)}`);
    return reqDef.handler(req, res, () => { });
  });
  console.log(`${reqDef.httpMethod.toUpperCase()}: ${reqDef.path}`)
})

app.listen(process.env.PORT, () => {
  return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
