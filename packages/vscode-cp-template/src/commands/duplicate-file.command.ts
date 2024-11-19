import { Uri } from "vscode";
import { getConfiguration } from "../lib/config";
import { DuplicateFileController } from "../controllers/duplicate-file.controller";
import { BaseCommand } from "./base.command";

export class DuplicateFileCommand extends BaseCommand<DuplicateFileController> {
    public async execute(uri?: Uri): Promise<void> {
        const dialogOptions = { prompt: "Duplicate As", uri, typeahead: false };
        const fileItem = await this.controller.showDialog(dialogOptions);
        await this.executeController(fileItem, { openFileInEditor: !fileItem?.isDir });
    }
}