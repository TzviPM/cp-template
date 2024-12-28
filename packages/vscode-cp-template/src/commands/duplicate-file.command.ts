import type { Uri } from "vscode";
import type { DuplicateFileController } from "../controllers/duplicate-file.controller";
import { BaseCommand } from "./base.command";

export class DuplicateFileCommand extends BaseCommand<DuplicateFileController> {
    public async execute(uri?: Uri): Promise<void> {
        const dialogOptions = { prompt: "Duplicate As", uri, typeahead: false };
        const fileItem = await this.controller.showDialog(dialogOptions);
        const templateText = await this.controller.getTemplateText();
        const replacementText = await this.controller.getReplacementText();
        await this.executeController(fileItem && {fileItem, templateText, replacementText}, { openFileInEditor: !fileItem?.isDir });
    }
}