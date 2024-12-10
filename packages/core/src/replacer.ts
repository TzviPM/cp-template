import * as changeCase from "./change-case";


type Transformer = (str: string) => string;

const CASE_TRANSFORMERS: Transformer[] = [
  changeCase.camelCase,
  changeCase.capitalCase,
  changeCase.constantCase,
  changeCase.dotCase,
  changeCase.kebabCase,
  changeCase.noCase,
  changeCase.pascalCase,
  changeCase.pascalSnakeCase,
  changeCase.pathCase,
  changeCase.sentenceCase,
  changeCase.snakeCase,
  changeCase.trainCase,
];

export class Replacer {
  constructor(private templateText?: string, private replacementText?: string) {}

  public replace(text: string): string {
    if (!this.templateText || !this.replacementText) {
      return text;
    }
    let result = text;
    for (const transformer of CASE_TRANSFORMERS) {
      result = this.replaceWithTransform(result, transformer);
    }
    return result;
  }

  replaceWithTransform(text: string, transform: Transformer): string {
    if (!this.templateText || !this.replacementText) {
      return text;
    }
    const template = transform(this.templateText);
    const replacement = transform(this.replacementText);
    return text.replaceAll(template, replacement);
  }
}