export interface FileSystem<TLoc> {
  copy(loc: TLoc, targetLoc: TLoc, options?: { overwrite?: boolean }): Promise<void>;
  rename(loc: TLoc, targetLoc: TLoc, options?: { overwrite?: boolean }): Promise<void>;
  exists(loc: TLoc): Promise<boolean>;
}