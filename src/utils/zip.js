import extractZip from 'extract-zip';
import Promise from 'bluebird';
import { temporaryRandomPath } from './path';
import { rmdir, mkdir, rename, stat } from './fs';

export async function extract(filePath, tickHandler) {
  const tmpPath = temporaryRandomPath();

  await rmdir(tmpPath);
  await mkdir(tmpPath);
  const fileStat = await stat(filePath);

  const totalSize = fileStat.size;
  let extractedSize = 0;

  const percent = () => {
    if (totalSize <= 0) {
      return 0;
    }
    if (extractedSize >= totalSize) {
      return 100;
    }
    return parseFloat(((extractedSize / totalSize) * 100).toFixed(2));
  };

  const props = { dir: tmpPath };
  props.onEntry = (entry, zipfile) => {
    if (typeof tickHandler !== 'function') {
      return;
    }

    extractedSize += entry.compressedSize || 0;

    tickHandler({
      totalSize,
      extractedSize,
      percent: percent(),
      entry,
      zipfile,
    });
  };

  return new Promise((resolve, reject) => {
    extractZip(filePath, props, err => {
      if (err) {
        return reject(err);
      }

      return resolve({
        tmpPath,
        totalSize,
        extractedSize,
        rename(newPath) {
          let attempt = 0;
          const tryRename = () =>
            rename(tmpPath, newPath).catch(err1 => {
              if (err1.code === 'EPERM' && attempt <= 60) {
                attempt += 1;
                return Promise.delay(1000).then(() => tryRename());
              }
              throw err1;
            });

          return tryRename();
        },
      });
    });
  });
}
