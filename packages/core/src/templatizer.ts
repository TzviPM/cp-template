import { TRANSFORMERS_BY_NAME, type Transformer } from "./transformers";

export class Templatizer {
  constructor(private templateText?: string) {}

  private get varName(): string {
    return "__VAR__";
  }

  public templatize(text: string): string {
    let result = this.escapeHbs(text);
    if (!this.templateText) {
      return result;
    }
    for (const [name, transformer] of Object.entries(TRANSFORMERS_BY_NAME)) {
      result = this.replaceWithTransform(result, name, transformer);
    }
    return result;
  }

  escapeHbs(text: string): string {
    return text.replaceAll("{{", "\\{{");
  }

  replaceWithTransform(text: string, transformerName: string, transform: Transformer): string {
    if (!this.templateText) {
      return text;
    }
    const template = transform(this.templateText);
    const replacement = `{{${transformerName} ${this.varName}}}`;
    return text.replaceAll(template, replacement);
  }
}