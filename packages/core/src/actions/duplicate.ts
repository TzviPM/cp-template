import { assertTargetLoc, FileItem, FileItemFactory } from "../file-item";
import { FileSystem } from "../file-system";
import { Replacer } from "../replacer";

export async function duplicate<TLoc, TFileItem extends FileItem<TLoc>>(fileItem: TFileItem,  factory: FileItemFactory<TLoc, TFileItem>, fs: FileSystem<TLoc>, templateText?: string, replacementText?: string, shouldOverwrite?: (loc: TLoc) => Promise<boolean>): Promise<TFileItem> {
    assertTargetLoc(fileItem.targetLoc);

    const src = fileItem.loc.raw;
    const dest = fileItem.targetLoc.raw;

    try {
        const dir = fs.parentDir(dest);
        await fs.ensureDirectoryExists(dir);
        const replacer = new Replacer(templateText, replacementText);
        await copyTmpl(src, dir, fs, factory, replacer, shouldOverwrite ?? (async () => false));
        return factory.create(dest, undefined, fileItem.isDir);
    } catch (error) {
        throw new Error(`Failed to duplicate file "${fileItem.targetLoc.path}. (${error})"`);
    }
}


async function copyTmpl<TLoc>(src: TLoc, targetDir: TLoc, fs: FileSystem<TLoc>, factory: FileItemFactory<TLoc>, replacer: Replacer, shouldOverwrite: (loc: TLoc) => Promise<boolean>): Promise<unknown> {
  const stats = await fs.lstat(src);
  const name = fs.basename(src);
  const targetName = replacer.replace(name);
  const targetLoc = fs.resolveInDir(targetDir, targetName);
  const targetLocation = factory.toLoc(targetLoc);
  const targetExists = await fs.exists(targetLoc);

  if (stats.isDirectory()) {
        if (!targetExists) {
            // make a new directory
            await fs.mkDir(targetLoc, stats.mode);
        }
        // copy the contents
        const contents = await fs.readDir(src);
        return Promise.all(contents.map((srcLoc) => {
            return copyTmpl(srcLoc, targetLoc, fs, factory, replacer, shouldOverwrite);
        }));
  }
  if (targetExists) {
    const mayContinue = await shouldOverwrite(targetLoc);
    if (!mayContinue) {
        throw new Error(`file ${targetLocation.path} is not writeable`)
    }
  }

  if (stats.isFileLike()) {
        const srcContent = await fs.readFile(src);
        const content = replacer.replace(srcContent);
        return fs.writeFile(targetLoc, content);
    } else if (stats.isSymbolicLink()) {
    const resolvedPath = await fs.resolveLink(src);
    return fs.symlink(targetLoc, resolvedPath);
  }
}