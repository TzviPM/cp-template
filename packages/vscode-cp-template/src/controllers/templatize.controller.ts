import { templatize } from "@cp-template/core";
import { type VsCodeFileItem, vsCodeFileItemFactory } from "../core/file-item";
import type { ExecuteOptions } from "./controller.interface";
import { MoveFileController } from "./move-file.controller";

export class TemplatizeController extends MoveFileController {
    public async execute(options: ExecuteOptions): Promise<VsCodeFileItem> {
        const { fileItem, templateText } = options;
        await this.ensureWritableFile(fileItem);
        return templatize(fileItem, vsCodeFileItemFactory, this.fs, templateText, this.shouldOverwrite);
    }
}