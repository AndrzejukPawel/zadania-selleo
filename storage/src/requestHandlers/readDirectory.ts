import { HttpMethod, IRequest } from '../IRequest';
import { Request, Response } from 'express-serve-static-core';
import * as nodePath from 'path'
import * as fs from 'fs';

export class ReadDirectoryBody {
  path: string;
}

export class ReadDirectory implements IRequest {
  httpMethod: HttpMethod = 'post';
  path: string = '/read_directory';

  handler(req: Request, res: Response) {
    const { path } = req.body as ReadDirectoryBody;

    if (!path)
      return res.sendStatus(400);

    if (nodePath.join(path).startsWith('\\admin') && req.headers.role != 'admin') {
      return res.sendStatus(403);
    }

    const directoryPath = nodePath.join(process.env.ROOT_DIR, path);

    if (!fs.existsSync(directoryPath)) {
      return res.status(404).json({ error: 'Specified directory does not exist' });
    }
    const result = {
      directories: [] as string[],
      files: [] as string[]
    }

    fs.readdirSync(directoryPath).map(p => {
      const fullPath = nodePath.join(directoryPath, p);
      const stats = fs.lstatSync(fullPath);
      if (stats.isFile()) {
        result.files.push(p);
      } else if (stats.isDirectory()) {
        result.directories.push(p);
      }
    });

    res.status(200).json(result);
  }
}
