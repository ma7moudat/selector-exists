import { IChunkHtml, IChunkCss, IUsage } from './Model';
import { ReaderAbstract } from './Reader';
import { SourceCss, SourceHtml } from './Source';

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
            ...selectors.map((selector) => ({
              identifierCss,
              identifierHtml,
              selector,
              used: !!parsed.querySelector(selector),
            })),
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
