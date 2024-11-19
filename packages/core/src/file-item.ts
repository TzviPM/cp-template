export interface FileItem<TLoc> {
  get name(): string;
  get loc(): FileLocation<TLoc>;
  get targetLoc(): FileLocation<TLoc> | undefined;
  get isDir(): boolean;
}

export interface FileLocation<T> {
  raw: T;
  get path(): string;
}

export interface FileItemFactory<TLoc, TFile extends FileItem<TLoc> = FileItem<TLoc>> {
  create(sourcePath: TLoc | string, targetPath?: TLoc | string, IsDir?: boolean): TFile;
  toLoc(locOrString: TLoc | string): FileLocation<TLoc>;
}

export function assertTargetLoc<TLoc>(targetLoc: TLoc | undefined): asserts targetLoc is TLoc {
  if (targetLoc === undefined) {
      throw new Error("Missing target path");
  }
}