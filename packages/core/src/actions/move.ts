import { assertTargetLoc, FileItem, FileItemFactory } from "../file-item";
import { FileSystem } from "../file-system";

export async function move<TLoc, TFileItem extends FileItem<TLoc>>(fileItem: TFileItem, factory: FileItemFactory<TLoc, TFileItem>, fs: FileSystem<TLoc>): Promise<TFileItem> {
    assertTargetLoc(fileItem.targetLoc);

    try {
        await fs.rename(fileItem.loc.raw, fileItem.targetLoc.raw, { overwrite: false });
        return factory.create(fileItem.targetLoc.raw, fileItem.targetLoc.raw, fileItem.isDir);
    } catch (error) {
        throw new Error(`Failed to duplicate file "${fileItem.targetLoc.path}. (${error})"`);
    }
}
