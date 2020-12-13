import { IChunkHtml, IChunkCss, IUsage } from './Model';
import { ReaderAbstract } from './Reader';
import { SourceCss, SourceHtml } from './Source';

const allowedPseudoSelectors = [
  'enabled',
  'disabled',
  'checked',
  'disabled',
  'empty',
  'optional',
  'required',
  'root',
  'empty',
  'nth-child',
  'nth-last-child',
  'first-child',
  'last-child',
  'only-child',
  'nth-of-type',
  'nth-last-of-type',
  'first-of-type',
  'last-of-type',
  'only-of-type',
  'not',
];

const disallowedSelectorsRegex =
  new RegExp(`:{1,2}(?!(${allowedPseudoSelectors.join('|')}))(\\w|-)+`, 'ig');

const cleanSelector = (selector: string) => {
  return selector.replace(disallowedSelectorsRegex, '');
};

export class SelectorExists {
  protected cssSources: SourceCss[] = [];

  protected htmlSources: SourceHtml[] = [];

  protected cssChunks: IChunkCss[] = [];

  protected htmlChunks: IChunkHtml[] = [];

  protected usages: IUsage[] = [];

  addCssSource(reader: ReaderAbstract) {
    this.cssSources.push(new SourceCss(reader));
  }

  addHtmlSource(reader: ReaderAbstract) {
    this.htmlSources.push(new SourceHtml(reader));
  }

  async processUsages() {
    await Promise.all(
      this.cssSources.map(async (src) => (this.cssChunks = [...this.cssChunks, ...(await src.getGroupedSelectors())])),
    );

    await Promise.all(
      this.htmlSources.map(async (src) => (this.htmlChunks = [...this.htmlChunks, ...(await src.getParsedHtml())])),
    );

    this.usages = this.htmlChunks.reduce<IUsage[]>(
      (allUsages, { identifier: identifierHtml, parsed }) => [
        ...allUsages,
        ...this.cssChunks.reduce<IUsage[]>(
          (subUsages, { identifier: identifierCss, selectors }) => [
            ...subUsages,
            ...selectors.map((selector) => {
              const cleanedSelector = cleanSelector(selector);
              return {
                identifierCss,
                identifierHtml,
                selector,
                used: !!(cleanedSelector && parsed(cleanedSelector).length),
              };
            }),
          ],
          [],
        ),
      ],
      [],
    );
  }

  getUsages() {
    return this.usages;
  }

  showReport() {
    // tslint:disable-next-line:no-console
    console.table(this.usages);
  }
}
