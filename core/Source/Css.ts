import {ICssRule, IChunkCss} from '../../model';
import {parse as parseCss} from 'css';
import {SourceAbstract} from './Abstract';

const extractSelectors = (
  allSelectors: string[],
  {selectors = [], rules = []}: ICssRule
): string[] => [
  ...allSelectors,
  ...selectors,
  ...(rules.length ? (<ICssRule[]>rules).reduce(extractSelectors, []) : []),
];

export class SourceCss extends SourceAbstract {
  protected groupedSelectors!: IChunkCss[];

  async getGroupedSelectors(): Promise<IChunkCss[]> {
    if (!this.groupedSelectors) {
      const chunks = await this.reader.getChuncks();
      this.groupedSelectors = chunks
        .map(({identifier, content}) => ({
          identifier,
          content,
          selectors: SourceCss.getSelectors(content),
        }));
    }
    return this.groupedSelectors;
  }

  static getSelectors(css: string): string[] {
    const {stylesheet} = parseCss(css);
    if (!stylesheet) {
      return [];
    }
    const {rules = []} = stylesheet;

    return (<ICssRule[]>rules).reduce(extractSelectors, []);
  }
}