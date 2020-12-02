import {ReaderAbstract} from './Abstract';
import {IChunk} from '../../model';

export class ReaderStdin extends ReaderAbstract {
  constructor(input: string) {
    super(input);
  }

  async getChuncks(): Promise<IChunk[]> {
    return [
      {
        identifier: 'STDIN',
        content: this.input,
      },
    ];
  }
}