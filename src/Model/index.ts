import { AtRule, Comment, Rule } from 'css';
import cheerio from 'cheerio';

export interface IChunk {
  identifier: string;
  content: string;
}

export interface IChunkCss extends IChunk {
  selectors: string[];
}

export interface IChunkHtml extends IChunk {
  parsed: cheerio.Root;
}

export interface ICssRule {
  selectors?: string[];
  rules?: Rule[] | Comment[] | AtRule[];
}

export interface IUsage {
  identifierCss: string;
  identifierHtml: string;
  selector: string;
  used: boolean;
}

export interface IReportOptions {
  json: boolean;
  used: boolean;
  unused: boolean;
}