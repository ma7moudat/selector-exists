import chalk from 'chalk';
import {parse as parseHtml} from 'node-html-parser';
import {AtRule, Comment, parse as parseCss, Rule} from 'css';

interface ISelectorExistsRule {
  selectors?: string[];
  rules?: Array<Rule | Comment | AtRule>;
}

interface ISelectorExistsOptions {
  html: any,
  css: any,
}

const extractSelectors = (
  allSelectors: string[],
  {selectors = [], rules = []}: ISelectorExistsRule
): string[] => [
  ...allSelectors,
  ...selectors,
  ...(rules.length ? (<ISelectorExistsRule[]>rules).reduce(extractSelectors, []) : []),
];

export class SelectorExists {
  private options: ISelectorExistsOptions;

  constructor(options: ISelectorExistsOptions) {
    this.options = options;
  }

  report() {
    const parsedHtml = parseHtml(this.options.html);
    const {stylesheet} = parseCss(this.options.css);
    if (!stylesheet) {
      console.log(chalk.yellowBright('Parsing CSS returned no selectors!'));
      return;
    }
    const {rules = []} = stylesheet;

    console.group(chalk.magenta('Selector Exists'));

    const selectors = (<ISelectorExistsRule[]>rules).reduce(extractSelectors, []);
    selectors.map(selector => {
      if (parsedHtml.querySelector(selector)) {
        console.log(chalk.green(`${selector} is used`));
      } else {
        console.log(chalk.red(`${selector} is not used`));
      }
    });

    console.groupEnd();
  }
}