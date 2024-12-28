import * as changeCase from "./change-case";

export type Transformer = (str: string) => string;

export const TRANSFORMERS_BY_NAME = {
  camelCase: changeCase.camelCase,
  capitalCase: changeCase.capitalCase,
  constantCase: changeCase.constantCase,
  dotCase: changeCase.dotCase,
  kebabCase: changeCase.kebabCase,
  noCase: changeCase.noCase,
  pascalCase: changeCase.pascalCase,
  pascalSnakeCase: changeCase.pascalSnakeCase,
  pathCase: changeCase.pathCase,
  sentenceCase: changeCase.sentenceCase,
  snakeCase: changeCase.snakeCase,
  trainCase: changeCase.trainCase,
};

export const CASE_TRANSFORMERS: Transformer[] = Object.values(TRANSFORMERS_BY_NAME);