import { ICssRule, IChunkCss } from '../Model';
import { parse as parseCss } from 'css';
import { SourceAbstract } from './Abstract';

const extractSelectors = (allSelectors: string[], { selectors = [], rules = [] }: ICssRule): string[] => [
  ...allSelectors,
  ...selectors,
  ...(rules.length ? (rules as ICssRule[]).reduce(extractSelectors, []) : []),
];

export class SourceCss extends SourceAbstract {
  protected groupedSelectors!: IChunkCss[];

  async getGroupedSelectors(): Promise<IChunkCss[]> {
    if (!this.groupedSelectors) {
      const chunks = await this.reader.getChuncks();
      this.groupedSelectors = chunks.map(({ identifier, content }) => ({
        identifier,
        content,
        selectors: SourceCss.getSelectors(content),
      }));
    }
    return this.groupedSelectors;
  }

  static getSelectors(css: string): string[] {
    const { stylesheet } = parseCss(css);
    if (!stylesheet) {
      return [];
    }
    const { rules = [] } = stylesheet;

    return (rules as ICssRule[]).reduce(extractSelectors, []);
  }
}
