import { Uri, workspace, WorkspaceEdit } from "vscode";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { FileSystem, Stats } from "@cp-template/core";

export class VSCodeFileSystem implements FileSystem<Uri> {
  async lstat(loc: Uri): Promise<Stats> {
    const stats = await fs.lstat(loc.fsPath);
    return {
      mode: stats.mode,
      isDirectory: () => stats.isDirectory(),
      isFileLike: () => stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice(),
      isSymbolicLink: stats.isSymbolicLink,
    };
  }
  parentDir(loc: Uri): Uri {
    const currentPath = loc.path;
    const parentPath = path.dirname(currentPath);
    return loc.with({
      path: parentPath
    });
  }
  basename(loc: Uri): string {
    const currentPath = loc.path;
    return path.basename(currentPath);
  }
  async ensureDirectoryExists(loc: Uri): Promise<void> {
    return workspace.fs.createDirectory(loc);
  }
  async readDir(loc: Uri): Promise<Uri[]> {
    const names = await workspace.fs.readDirectory(loc);
    return names.map(([name]) => loc.with({ path: path.resolve(loc.path, name) }));
  }
  async readFile(loc: Uri): Promise<string> {
    return workspace.fs.readFile(loc).then(content => content.toString());
  }
  async writeFile(loc: Uri, content: string): Promise<void> {
    return workspace.fs.writeFile(loc, Uint8Array.from(Buffer.from(content)));
  }
  async resolveLink(link: Uri): Promise<Uri> {
    const res = await fs.readlink(link.fsPath);
    return link.with({ path: res });
  }
  async symlink(linkLoc: Uri, targetLoc: Uri): Promise<void> {
    return fs.symlink(targetLoc.fsPath, linkLoc.fsPath);
  }
  resolveInDir(dir: Uri, basename: string): Uri {
    return dir.with({ path: path.resolve(dir.path, basename) });
  }
  async mkDir(loc: Uri, mode?: number): Promise<void> {
    if (mode === undefined) {
      return workspace.fs.createDirectory(loc);
    }
    return fs.mkdir(loc.fsPath, { mode });
  }
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