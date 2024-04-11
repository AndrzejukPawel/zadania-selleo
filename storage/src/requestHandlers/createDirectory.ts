import { RequestHandler } from 'express';
import { HttpMethod, IRequest } from '../IRequest';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as nodePath from 'path'
import * as fs from 'fs';

export class CreateDirectoryBody {
  path: string;
}

export class CreateDirectory implements IRequest {
  httpMethod: HttpMethod = 'put';
  path: string = '/create_directory';

  handler(req: Request, res: Response) {
    const { path } = req.body as CreateDirectoryBody;

    if (!path)
      return res.sendStatus(400);

    if (nodePath.join(path).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const directoryPath = nodePath.join(process.env.ROOT_DIR, path);

    if (fs.existsSync(directoryPath)) {
      return res.status(409).json({ error: 'Specified directory already exists' });
    }

    let nextDirectory = process.env.ROOT_DIR;
    path.split('/').forEach(folder => {
      nextDirectory = nodePath.join(nextDirectory, folder);
      if (!fs.existsSync(nextDirectory)) {
        fs.mkdirSync(nextDirectory);
      }
    });

    res.sendStatus(200);
  }
}
