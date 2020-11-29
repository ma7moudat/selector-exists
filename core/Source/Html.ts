import {parse as parseHtml} from 'node-html-parser';
import {SourceAbstract} from './Abstract';
import {IParsedHtmlChunk} from '../../model';

export class SourceHtml extends SourceAbstract {
  protected parsedHtml!: IParsedHtmlChunk[];

  async getParsedHtml(): Promise<IParsedHtmlChunk[]> {
    if (!this.parsedHtml) {
      const chunks = await this.reader.getChuncks();
      this.parsedHtml = chunks
        .map(({identifier, content}) => ({identifier, parsed: parseHtml(content)}));
    }
    return this.parsedHtml;
  }
}