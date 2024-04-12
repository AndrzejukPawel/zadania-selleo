import { HttpMethod, IRequest } from '../IRequest';
import { Request, Response } from 'express-serve-static-core';
import * as nodePath from 'path'
import * as fs from 'fs';

export class MoveBody {
  fromPath: string;
  toPath: string;
}

export class Move implements IRequest {
  httpMethod: HttpMethod = 'post';
  path: string = '/move';

  handler(req: Request, res: Response) {
    const { fromPath, toPath } = req.body as MoveBody;

    if (!fromPath || !toPath)
      return res.sendStatus(400);

    if (nodePath.join(fromPath).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const fullFromPath = nodePath.join(process.env.ROOT_DIR, fromPath);
    const fullToPath = nodePath.join(process.env.ROOT_DIR, toPath);


    if (!fs.existsSync(fullFromPath)) {
      return res.status(404).json({ error: 'Specified directory/file to rename does not exist' });
    }

    if (fs.existsSync(fullToPath)) {
      return res.status(409).json({ error: 'Specified directory/file already exists' });
    }

    fs.renameSync(fullFromPath, fullToPath);

    res.sendStatus(200);
  }
}
