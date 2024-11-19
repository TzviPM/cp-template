import { assertTargetLoc, FileItem, FileItemFactory } from "../file-item";
import { FileSystem } from "../file-system";

export async function duplicate<TLoc, TFileItem extends FileItem<TLoc>>(fileItem: TFileItem, factory: FileItemFactory<TLoc, TFileItem>, fs: FileSystem<TLoc>): Promise<TFileItem> {
    assertTargetLoc(fileItem.targetLoc);

    try {
        await fs.copy(fileItem.loc.raw, fileItem.targetLoc.raw, { overwrite: false });
        return factory.create(fileItem.targetLoc.raw, undefined, fileItem.isDir);
    } catch (error) {
        throw new Error(`Failed to duplicate file "${fileItem.targetLoc.path}. (${error})"`);
    }
}
