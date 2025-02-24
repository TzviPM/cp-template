import {
  assertTargetLoc,
  type FileItem,
  type FileItemFactory,
} from "../file-item";
import type { FileSystem } from "../file-system";
import { Replacer } from "../replacer";
import { Templatizer } from "../templatizer";

export async function templatize<TLoc, TFileItem extends FileItem<TLoc>>(
  fileItem: TFileItem,
  factory: FileItemFactory<TLoc, TFileItem>,
  fs: FileSystem<TLoc>,
  templateText?: string,
  shouldOverwrite?: (loc: TLoc) => Promise<boolean>
): Promise<TFileItem> {
  assertTargetLoc(fileItem.targetLoc);

  const src = fileItem.loc.raw;
  const dest = fileItem.targetLoc.raw;

  try {
    const dir = fs.parentDir(dest);
    await fs.ensureDirectoryExists(dir);
    const templatizer = new Templatizer(templateText);
    await makeTmpl(
      src,
      dir,
      fs,
      factory,
      templatizer,
      shouldOverwrite ?? (async () => false)
    );
    return factory.create(dest, undefined, fileItem.isDir);
  } catch (error) {
    throw new Error(
      `Failed to templatize file "${fileItem.targetLoc.path}. (${error})"`
    );
  }
}

async function makeTmpl<TLoc>(
  src: TLoc,
  targetDir: TLoc,
  fs: FileSystem<TLoc>,
  factory: FileItemFactory<TLoc>,
  templatizer: Templatizer,
  shouldOverwrite: (loc: TLoc) => Promise<boolean>
): Promise<unknown> {
  const stats = await fs.lstat(src);
  const name = fs.basename(src);
  const targetName = `${templatizer.templatize(name)}.hbs`;
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
    return Promise.all(
      contents.map((srcLoc) => {
        return makeTmpl(
          srcLoc,
          targetLoc,
          fs,
          factory,
          templatizer,
          shouldOverwrite
        );
      })
    );
  }
  if (targetExists) {
    const mayContinue = await shouldOverwrite(targetLoc);
    if (!mayContinue) {
      throw new Error(`file ${targetLocation.path} is not writeable`);
    }
  }

  if (stats.isFileLike()) {
    const srcContent = await fs.readFile(src);
    const content = templatizer.templatize(srcContent);
    return fs.writeFile(targetLoc, content);
  }

  if (stats.isSymbolicLink()) {
    const resolvedPath = await fs.resolveLink(src);
    return fs.symlink(targetLoc, resolvedPath);
  }
}
