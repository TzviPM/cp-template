import { Uri, workspace, WorkspaceEdit } from "vscode";
import * as fs from 'node:fs/promises';
import { FileSystem } from "@cp-template/core";

export class VSCodeFileSystem implements FileSystem<Uri> {
  async rename(loc: Uri, targetLoc: Uri, options?: { overwrite?: boolean; }): Promise<void> {
    const edit = new WorkspaceEdit();
    edit.renameFile(loc, targetLoc, options);
    await workspace.applyEdit(edit);
  }

  async exists(loc: Uri): Promise<boolean> {
    try {
      await fs.stat(loc.fsPath);
      return true;
    } catch {
      return false;
    }
  }

  async copy(loc: Uri, targetLoc: Uri, options?: { overwrite?: boolean; }): Promise<void> {
    await workspace.fs.copy(loc, targetLoc, options);
  }
}

export const vsCodeFs = new VSCodeFileSystem();