import {ICssRule, IChunkHtml, IChunkCss, IUsage} from '../model';
import {SourceCss} from './Source/Css';
import {SourceHtml} from './Source/Html';

const extractSelectors = (
  allSelectors: string[],
  {selectors = [], rules = []}: ICssRule
): string[] => [
  ...allSelectors,
  ...selectors,
  ...(rules.length ? (<ICssRule[]>rules).reduce(extractSelectors, []) : []),
];

export class SelectorExists {
  protected cssSources: SourceCss[] = [];

  protected htmlSources: SourceHtml[] = [];

  protected cssChunks: IChunkCss[] = [];

  protected htmlChunks: IChunkHtml[] = [];

  protected usages: IUsage[] = [];

  addCssSource(source: SourceCss) {
    this.cssSources.push(source);
  }

  addHtmlSource(source: SourceHtml) {
    this.htmlSources.push(source);
  }

  async processUsages() {
    await Promise.all(this
      .cssSources
      .map(async src => this.cssChunks = [
        ...this.cssChunks,
        ...await src.getGroupedSelectors()
      ]));

    await Promise.all(this
      .htmlSources
      .map(async src => this.htmlChunks = [
        ...this.htmlChunks,
        ...await src.getParsedHtml()
      ]));

    this.usages = this
      .htmlChunks
      .reduce<IUsage[]>((allUsages, {identifier: identifierHtml, parsed}) => [
        ...allUsages,
        ...this
          .cssChunks
          .reduce<IUsage[]>((subUsages, {identifier: identifierCss, selectors}) => [
            ...subUsages,
            ...selectors
              .map(selector => ({
                identifierCss,
                identifierHtml,
                selector,
                used: !!parsed.querySelector(selector),
              })),
          ], []),
      ], []);

    console.groupEnd();
  }

  showReport() {
    console.table(this.usages);
  }
}