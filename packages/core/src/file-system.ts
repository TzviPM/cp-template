export interface Stats {
  isDirectory(): boolean;
  isFileLike(): boolean;
  isSymbolicLink(): boolean;
  mode: number;
}

export interface FileSystem<TLoc> {
  copy(loc: TLoc, targetLoc: TLoc, options?: { overwrite?: boolean }): Promise<void>;
  lstat(loc: TLoc): Promise<Stats>;
  parentDir(loc: TLoc): TLoc;
  basename(loc: TLoc): string;
  ensureDirectoryExists(loc: TLoc): Promise<void>;
  readDir(loc: TLoc): Promise<TLoc[]>;
  readFile(loc: TLoc): Promise<string>;
  writeFile(loc: TLoc, content: string): Promise<void>;
  resolveLink(link: TLoc): Promise<TLoc>;
  symlink(linkLoc: TLoc, targetLoc: TLoc): Promise<void>;
  resolveInDir(dir: TLoc, basename: string): TLoc;
  mkDir(loc: TLoc, mode?: number): Promise<void>;
  rename(loc: TLoc, targetLoc: TLoc, options?: { overwrite?: boolean }): Promise<void>;
  exists(loc: TLoc): Promise<boolean>;
}