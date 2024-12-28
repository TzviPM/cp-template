import { CASE_TRANSFORMERS, type Transformer } from "./transformers";

export class Replacer {
  constructor(private templateText?: string, private replacementText?: string) {}

  public replace(text: string): string {
    if (!this.templateText || !this.replacementText) {
      return text;
    }
    let result = text;
    // TODO(tzvipm): replace in parallel
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