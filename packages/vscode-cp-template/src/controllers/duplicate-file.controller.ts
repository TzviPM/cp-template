import { duplicate } from "@cp-template/core";
import { VsCodeFileItem, vsCodeFileItemFactory } from "../core/file-item";
import { ExecuteOptions } from "./controller.interface";
import { MoveFileController } from "./move-file.controller";

export class DuplicateFileController extends MoveFileController {
    public async execute(options: ExecuteOptions): Promise<VsCodeFileItem> {
        const { fileItem, templateText, replacementText } = options;
        await this.ensureWritableFile(fileItem);
        return duplicate(fileItem, vsCodeFileItemFactory, this.fs, templateText, replacementText, this.shouldOverwrite);
    }
}