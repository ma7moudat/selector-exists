import {parse as parseHtml} from 'node-html-parser';
import {SourceAbstract} from './Abstract';
import {IChunkHtml} from '../../model';

export class SourceHtml extends SourceAbstract {
  protected parsedHtml!: IChunkHtml[];

  async getParsedHtml(): Promise<IChunkHtml[]> {
    if (!this.parsedHtml) {
      const chunks = await this.reader.getChuncks();
      this.parsedHtml = chunks
        .map(({identifier, content}) => ({
          identifier,
          content,
          parsed: parseHtml(content),
        }));
    }
    return this.parsedHtml;
  }
}