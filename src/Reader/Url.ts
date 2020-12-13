import fetch from 'node-fetch';
import { ReaderAbstract } from './Abstract';
import { IChunk } from '../Model';

export class ReaderUrl extends ReaderAbstract {
  constructor(input: string) {
    super(input);
  }

  async getChuncks(): Promise<IChunk[]> {
    const response = await fetch(this.input);
    const content = await response.text();
    return [
      {
        identifier: this.input,
        content,
      },
    ];
  }
}
