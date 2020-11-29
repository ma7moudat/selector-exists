import chalk from 'chalk';
import {ICssRule, IParsedHtmlChunk, ISelectorGroup} from '../model';
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

  protected groupedSelectors: ISelectorGroup[] = [];

  protected parsedHtml: IParsedHtmlChunk[] = [];

  addCssSource(source: SourceCss) {
    this.cssSources.push(source);
  }

  addHtmlSource(source: SourceHtml) {
    this.htmlSources.push(source);
  }

  async report() {
    await Promise.all(this
      .cssSources
      .map(async src => this.groupedSelectors = [
        ...this.groupedSelectors,
        ...await src.getGroupedSelectors()
      ]));

    await Promise.all(this
      .htmlSources
      .map(async src => this.parsedHtml = [
        ...this.parsedHtml,
        ...await src.getParsedHtml()
      ]));

    console.group(chalk.magenta('Selector Exists'));

    this
      .parsedHtml
      .map(({identifier: htmlIdent, parsed}) => {
        console.log(chalk.yellow(`HTML: ${htmlIdent}`));
        this
          .groupedSelectors
          .map(({identifier: cssIdent, selectors}) => {
            console.log(chalk.magenta(`CSS: ${cssIdent}`));
            selectors
              .map(selector => {
                if (parsed.querySelector(selector)) {
                  console.log(chalk.green(`${selector} is used`));
                } else {
                  console.log(chalk.red(`${selector} is not used`));
                }
              });
          });
      });

    console.groupEnd();
  }
}