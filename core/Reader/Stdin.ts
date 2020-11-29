import {ReaderAbstract} from './Abstract';
import {IReaderChunk} from '../../model';

export class ReaderStdin extends ReaderAbstract {
  constructor(input: string) {
    super(input);
  }

  async getChuncks(): Promise<IReaderChunk[]> {
    return [
      {
        identifier: 'STDIN',
        content: this.input,
      },
    ];
  }
}