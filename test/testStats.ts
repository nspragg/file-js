import * as fs from 'fs';

export class TestStats implements fs.Stats {
  public dev: number;
  public ino: number;
  public mode: number;
  public nlink: number;
  public uid: number;
  public gid: number;
  public rdev: number;
  public size: number;
  public blksize: number;
  public blocks: number;
  public atimeMs: number;
  public mtimeMs: number;
  public ctimeMs: number;
  public birthtimeMs: number;
  public atime: Date;
  public mtime: Date;
  public ctime: Date;
  public birthtime: Date;
  public isFile(): boolean {
    throw new Error('Method not implemented.');
  }
  public isDirectory(): boolean {
    throw new Error('Method not implemented.');
  }
  public isBlockDevice(): boolean {
    throw new Error('Method not implemented.');
  }
  public isCharacterDevice(): boolean {
    throw new Error('Method not implemented.');
  }
  public isSymbolicLink(): boolean {
    throw new Error('Method not implemented.');
  }
  public isFIFO(): boolean {
    throw new Error('Method not implemented.');
  }
  public isSocket(): boolean {
    return true;
  }
}
