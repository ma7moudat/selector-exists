import {IChunk} from '../Model';

export abstract class ReaderAbstract {
  protected input: string;

  constructor(input: string) {
    this.input = input;
  }

  abstract async getChuncks(): Promise<IChunk[]>;
}