import { File } from './file';

function listDir(f: any): File[] {
  const names = f.getFilesSync();
  return names.sort();
}

export function walkSync(path: File, fileVisitor?: (f: File) => boolean): any {
  if (!path.isDirectorySync()) {
    return fileVisitor(path);
  }

  const cont = fileVisitor(path);
  if (!cont) { return; }

  const dirNames = listDir(path);
  for (const dir of dirNames) {
    walkSync(dir, fileVisitor);
  }
}
