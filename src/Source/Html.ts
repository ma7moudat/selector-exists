import { load } from 'cheerio';
import { SourceAbstract } from './Abstract';
import { IChunkHtml } from '../Model';

export class SourceHtml extends SourceAbstract {
  protected parsedHtml!: IChunkHtml[];

  async getParsedHtml(): Promise<IChunkHtml[]> {
    if (!this.parsedHtml) {
      const chunks = await this.reader.getChuncks();
      this.parsedHtml = chunks.map(({ identifier, content }) => ({
        identifier,
        content,
        parsed: load(content),
      }));
    }
    return this.parsedHtml;
  }
}
