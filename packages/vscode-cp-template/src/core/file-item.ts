import * as path from "path";
import { Uri } from "vscode";
import {FileItem, FileItemFactory, FileLocation} from '@cp-template/core';

class VsCodeLocation implements FileLocation<Uri> {
    constructor(private Loc: Uri) {}

    get raw(): Uri {
        return this.Loc;
    }

    get path(): string {
        return this.Loc.fsPath;
    }
}

class VsCodeFileItemFactory implements FileItemFactory<Uri, VsCodeFileItem> {
    create(sourcePath: string | Uri, targetPath?: string | Uri | undefined, IsDir?: boolean): VsCodeFileItem {
        return new VsCodeFileItem(sourcePath, targetPath, IsDir);
    }
    toLoc(uriOrString: Uri | string): VsCodeLocation {
        const uri = uriOrString instanceof Uri ? uriOrString : Uri.file(uriOrString);
        return new VsCodeLocation(uri);
    }
}

export const vsCodeFileItemFactory = new VsCodeFileItemFactory();

export class VsCodeFileItem implements FileItem<Uri> {
    private SourceLoc: VsCodeLocation;
    private TargetLoc: VsCodeLocation | undefined;

    constructor(sourcePath: Uri | string, targetPath?: Uri | string, private IsDir: boolean = false) {
        this.SourceLoc = vsCodeFileItemFactory.toLoc(sourcePath);
        if (targetPath !== undefined) {
            this.TargetLoc = vsCodeFileItemFactory.toLoc(targetPath);
        }
    }

    get name(): string {
        return path.basename(this.SourceLoc.raw.path);
    }

    get loc(): VsCodeLocation {
        return this.SourceLoc;
    }

    get targetLoc(): VsCodeLocation | undefined {
        return this.TargetLoc;
    }

    get isDir(): boolean {
        return this.IsDir;
    }

    // public async move(): Promise<VsCodeFileItem> {
    //     assertTargetPath(this.targetPath);

    //     const edit = new WorkspaceEdit();
    //     edit.renameFile(this.path, this.targetPath, { overwrite: true });
    //     const result = await workspace.applyEdit(edit);

    //     if (!result) {
    //         throw new Error(`Failed to move file "${this.targetPath.fsPath}."`);
    //     }

    //     this.SourcePath = this.targetPath;
    //     return this;
    // }

    // public async remove(): Promise<VsCodeFileItem> {
    //     const edit = new WorkspaceEdit();
    //     edit.deleteFile(this.path, { recursive: true, ignoreIfNotExists: true });
    //     const result = await workspace.applyEdit(edit);

    //     if (!result) {
    //         throw new Error(`Failed to delete file "${this.path.fsPath}."`);
    //     }

    //     return this;
    // }

    // public async create(mkDir?: boolean): Promise<VsCodeFileItem> {
    //     assertTargetPath(this.targetPath);

    //     if (await this.exists()) {
    //         await workspace.fs.delete(this.targetPath, { recursive: true });
    //     }

    //     if (mkDir === true || this.isDir) {
    //         await workspace.fs.createDirectory(this.targetPath);
    //     } else {
    //         await workspace.fs.writeFile(this.targetPath, new Uint8Array());
    //     }

    //     return new VsCodeFileItem(this.targetPath, undefined, this.isDir);
    // }
}