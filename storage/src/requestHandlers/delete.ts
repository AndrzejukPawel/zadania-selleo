import { HttpMethod, IRequest } from '../IRequest';
import { Request, Response } from 'express-serve-static-core';
import * as nodePath from 'path'
import * as fs from 'fs';

export class DeleteBody {
  path: string;
}

export class Delete implements IRequest {
  httpMethod: HttpMethod = 'delete';
  path: string = '/delete';

  handler(req: Request, res: Response) {
    const { path } = req.body as DeleteBody;

    if (!path)
      return res.sendStatus(400);

    if (nodePath.join(path).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const fullPath = nodePath.join(process.env.ROOT_DIR, path);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Specified directory/file does not exist' });
    }

    fs.rmSync(fullPath);

    res.sendStatus(200);
  }
}
