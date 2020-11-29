import {ICssRule, ISelectorGroup} from '../../model';
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
  protected groupedSelectors!: ISelectorGroup[];

  async getGroupedSelectors(): Promise<ISelectorGroup[]> {
    if (!this.groupedSelectors) {
      const chunks = await this.reader.getChuncks();
      this.groupedSelectors = chunks
        .map(({identifier, content}) => ({identifier, selectors: SourceCss.getSelectors(content)}));
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