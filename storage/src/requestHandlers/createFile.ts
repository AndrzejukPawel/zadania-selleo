import { RequestHandler } from 'express';
import { HttpMethod, IRequest } from '../IRequest';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as nodePath from 'path'
import * as fs from 'fs';

export class CreateFileBody {
  path: string;
  encoding: BufferEncoding;
  content: string;
}

export class CreateFile implements IRequest {
  httpMethod: HttpMethod = 'put';
  path: string = '/create_file';

  handler(req: Request, res: Response) {
    const { path, encoding, content } = req.body as CreateFileBody;

    if (!path || !encoding || !content)
      return res.sendStatus(400);

    if (nodePath.join(path).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const filePath = nodePath.join(process.env.ROOT_DIR, path);
    const directoryPath = nodePath.join(process.env.ROOT_DIR, path.substring(0, path.lastIndexOf('/')));

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'Specified file already exists' });
    }

    if (!fs.existsSync(directoryPath)) {
      return res.status(404).json({ error: 'Specified directory does not exist' });
    }

    fs.writeFileSync(filePath, content, { encoding });
    return res.sendStatus(200);
  }
}
