import { TextEditor, Uri } from "vscode";
import { VsCodeFileItem } from "../core/file-item";

export interface DialogOptions {
    prompt?: string;
    uri?: Uri;
    typeahead?: boolean;
}

export interface ExecuteOptions {
    fileItem: VsCodeFileItem;
    templateText?: string;
    replacementText?: string;
}

export interface SourcePathOptions {
    relativeToRoot?: boolean;
    ignoreIfNotExists?: boolean;
    uri?: Uri;
    typeahead?: boolean;
}

export interface FileController {
    showDialog(options?: DialogOptions): Promise<VsCodeFileItem | VsCodeFileItem[] | undefined>;
    execute(options: ExecuteOptions): Promise<VsCodeFileItem>;
    openFileInEditor(fileItem: VsCodeFileItem): Promise<TextEditor | undefined>;
    closeCurrentFileEditor(): Promise<unknown>;
    getSourcePath(options?: SourcePathOptions): Promise<string>;
}