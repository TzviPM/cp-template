import * as path from "node:path";
import { FileType, Uri, window, workspace } from "vscode";
import { BaseFileController, type TargetPathInputBoxValueOptions } from "./base-file.controller";
import type { DialogOptions, ExecuteOptions } from "./controller.interface";
import { vsCodeFileItemFactory, VsCodeFileItem } from "../core/file-item";
import { move } from "@cp-template/core";

export class MoveFileController extends BaseFileController {
    public async showDialog(options: DialogOptions): Promise<VsCodeFileItem | undefined> {
        const { uri } = options;
        const sourcePath = await this.getSourcePath({ uri });

        if (!sourcePath) {
            throw new Error();
        }

        const targetPath = await this.getTargetPath(sourcePath, options);

        if (targetPath) {
            const isDir = (await workspace.fs.stat(Uri.file(sourcePath))).type === FileType.Directory;
            return new VsCodeFileItem(sourcePath, targetPath, isDir);
        }
    }

    public async getTemplateText(): Promise<string | undefined> {
        return await this.showTemplateTextInputBox();
    }

    protected async showTemplateTextInputBox(): Promise<string | undefined> {
        return await window.showInputBox({
            prompt: 'Enter the template text',
            ignoreFocusOut: true,
        });
    }

    public async getReplacementText(): Promise<string | undefined> {
        return await this.showReplacementTextInputBox();
    }

    protected async showReplacementTextInputBox(): Promise<string | undefined> {
        return await window.showInputBox({
            prompt: 'Enter the replacement text',
            ignoreFocusOut: true,
        });
    }

    public async execute(options: ExecuteOptions): Promise<VsCodeFileItem> {
        const { fileItem } = options;
        await this.ensureWritableFile(fileItem);

        return move(fileItem, vsCodeFileItemFactory, this.fs);
    }

    protected async getTargetPathInputBoxValue(
        sourcePath: string,
        options: TargetPathInputBoxValueOptions
    ): Promise<string> {
        const value = await this.getFullTargetPathInputBoxValue(sourcePath, options);
        return super.getTargetPathInputBoxValue(value, options);
    }

    private async getFullTargetPathInputBoxValue(
        sourcePath: string,
        options: TargetPathInputBoxValueOptions
    ): Promise<string> {
        const { typeahead, workspaceFolderPath } = options;

        if (!typeahead) {
            return sourcePath;
        }

        if (!workspaceFolderPath) {
            throw new Error();
        }

        const rootPath = await this.getFileSourcePathAtRoot(workspaceFolderPath, { relativeToRoot: true, typeahead });
        const fileName = path.basename(sourcePath);

        return path.join(rootPath, fileName);
    }

    protected getFilenameSelection(value: string): [number, number] {
        const basename = path.basename(value);
        const start = value.length - basename.length;
        const dot = basename.lastIndexOf(".");
        const exclusiveEndIndex = dot <= 0 ? value.length : start + dot;

        return [start, exclusiveEndIndex];
    }
}