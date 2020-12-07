import { ReaderAbstract } from '../Reader';

export abstract class SourceAbstract {
  protected reader: ReaderAbstract;

  constructor(reader: ReaderAbstract) {
    this.reader = reader;
  }
}
