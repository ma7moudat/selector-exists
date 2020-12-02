#!/usr/bin/env ts-node

// Dependencies
import yargs from 'yargs';
import chalk from 'chalk';
import {SelectorExists} from './core/SelectorExists';
import {ReaderStdin} from './core/Reader/Stdin';
import {SourceHtml} from './core/Source/Html';
import {SourceCss} from './core/Source/Css';

// Grab provided args
const argv = yargs(process.argv)
  .option('html', {
    alias: 'h',
    type: 'string',
    description: 'HTML markup'
  })
  .option('html-paths', {
    alias: 'p',
    type: 'string',
    description: 'Path(s) to files containing HTML markup'
  })
  .option('html-url', {
    alias: 'u',
    type: 'string',
    description: 'URL of page to check'
  })
  .option('css', {
    alias: 'c',
    type: 'string',
    description: 'CSS string'
  })
  .option('css-files', {
    alias: 'f',
    type: 'string',
    description: 'Path(s) to css files'
  })
  .option('css-url', {
    alias: 'l',
    type: 'string',
    description: 'URL of stylesheet'
  })
  .option('selectors', {
    alias: 's',
    type: 'string',
    description: 'Comma separated list of selectors to check'
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv;

// Run script
if (!argv.html || !argv.css) {
  console.log(chalk.red('HTML and CSS are required'));
}

const instance = new SelectorExists();
if (argv.css) {
  instance.addCssSource(new SourceCss(new ReaderStdin(argv.css)));
}
if (argv.html) {
  instance.addHtmlSource(new SourceHtml(new ReaderStdin(argv.html)));
}

instance
  .processUsages()
  .then(() => instance.showReport());