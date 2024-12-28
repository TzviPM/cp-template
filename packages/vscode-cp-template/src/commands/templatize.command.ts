import type { Uri } from "vscode";
import { BaseCommand } from "./base.command";
import type { TemplatizeController } from "../controllers/templatize.controller";

export class TemplatizeCommand extends BaseCommand<TemplatizeController> {
    public async execute(uri?: Uri): Promise<void> {
        const dialogOptions = { prompt: "Templatize As", uri, typeahead: false };
        const fileItem = await this.controller.showDialog(dialogOptions);
        const templateText = await this.controller.getTemplateText();
        await this.executeController(fileItem && {fileItem, templateText}, { openFileInEditor: !fileItem?.isDir });
    }
}