import { RequestHandler } from 'express';
import { HttpMethod, IRequest } from '../IRequest';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as nodePath from 'path'
import * as fs from 'fs';

export class ReadFileBody {
  path: string;
}

export class ReadFile implements IRequest {
  httpMethod: HttpMethod = 'post';
  path: string = '/read_file';

  handler(req: Request, res: Response) {
    const { path } = req.body as ReadFileBody;

    if (!path)
      return res.sendStatus(400);

    if (nodePath.join(path).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const filePath = nodePath.join(process.env.ROOT_DIR, path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Specified file does not exist' });
    }

    res.status(200).sendFile(filePath);
  }
}
