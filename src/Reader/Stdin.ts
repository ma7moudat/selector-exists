import { ReaderAbstract } from './Abstract';
import { IChunk } from '../Model';

export class ReaderStdin extends ReaderAbstract {
  protected identifier = 'STDIN';

  constructor(input: string) {
    super(input);
  }

  setIdentifier(identifier: string) {
    this.identifier = identifier;
    return this;
  }

  async getChuncks(): Promise<IChunk[]> {
    return [
      {
        identifier: this.identifier,
        content: this.input,
      },
    ];
  }
}
