import {ReaderAbstract} from '../Reader/Abstract';

export abstract class SourceAbstract {
  protected reader: ReaderAbstract;

  constructor(reader: ReaderAbstract) {
    this.reader = reader;
  }
}