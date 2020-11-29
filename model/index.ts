import {AtRule, Comment, Rule} from 'css';
import HTMLElement from 'node-html-parser/dist/nodes/html';

export interface IReaderChunk {
  identifier: string;
  content: string;
}

export interface ISelectorGroup {
  identifier: string;
  selectors: string[];
}

export interface IParsedHtmlChunk {
  identifier: string;
  parsed: HTMLElement;
}

export interface ICssRule {
  selectors?: string[];
  rules?: Array<Rule | Comment | AtRule>;
}

export interface ISelectorExistsOptions {
  html: any,
  css: any,
}