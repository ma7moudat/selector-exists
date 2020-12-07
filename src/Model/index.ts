import { AtRule, Comment, Rule } from 'css';
import HTMLElement from 'node-html-parser/dist/nodes/html';

export interface IChunk {
  identifier: string;
  content: string;
}

export interface IChunkCss extends IChunk {
  selectors: string[];
}

export interface IChunkHtml extends IChunk {
  parsed: HTMLElement;
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
