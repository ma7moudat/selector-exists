import {readFile} from 'fs/promises';
import {Glob} from 'glob';
import {ReaderAbstract} from './Abstract';
import {IChunk} from '../Model';

export class ReaderFilesystem extends ReaderAbstract {
  protected encoding: BufferEncoding = 'utf-8';

  constructor(input: string) {
    super(input);
  }

  setEncoding(encoding: BufferEncoding) {
    this.encoding = encoding;
  }

  async getFileList(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      new Glob(this.input, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  async getChuncks(): Promise<IChunk[]> {
    try {
      const files = await this.getFileList();
      console.log(files);
      return await Promise
        .all(files.map(file => readFile(file).then(buffer => ({
          identifier: file,
          content: buffer.toString(this.encoding),
        }))));
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}