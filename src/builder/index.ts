import { copy, copyFile, ensureDir, mkdirp, readdir, readFile, stat, writeFile } from 'fs-extra';
import * as MDI from 'markdown-it';
import * as mdiReplaceLinkPlugin from 'markdown-it-replace-link';
import { basename, dirname, join, relative, resolve } from 'path';
import { Chapter, Data, Folder, Node } from '../Data';
import { countCertainWord } from './countCertainWord';
import { countChars } from './countChars';
import { countParagraphs } from './countParagraphs';
import { keywords } from './keywords';

const earlyAccessFlag = '# 编写中';
const commentsUrlBegin = '[评论](';
const commentsUrlEnd = ')';

(async () => {
  const rootDir = resolve(__dirname, '../..');
  const staticDir = resolve(rootDir, 'static');
  const chaptersDir = resolve(rootDir, 'chapters');
  const distDir = resolve(rootDir, 'dist');
  const distChapters = resolve(distDir, 'chapters');

  await ensureDir(distChapters);

  // Copy static
  await copy(staticDir, distDir);
  const indexPath = resolve(distDir, 'index.html');
  const nowTime = new Date().getTime();
  readFile(indexPath, 'utf-8', (err, files) => {
    let result = files.replace(new RegExp('.js" defer>', 'g'), '.js?v=' + nowTime + '" defer>');
    result = result.replace(new RegExp('.css">', 'g'), '.css?v=' + nowTime + '">');
    writeFile(indexPath, result, 'utf-8', (err) => {
      if (err) {
         return console.log(err);
      }
    });
  });
  console.info('Static copied.');

  const chapterDefaultNamer = (displayIndex: number) => `Past. ${displayIndex} `;
  const folderDefaultNamer = (displayIndex: number) => `新建文件夹（${displayIndex}）`;

  // Get basic displayName, displayIndex, name, relativePath from a full path
  function destructPath(fullPath: string, isFolder: boolean): Node {
    const relativePath = relative(chaptersDir, fullPath);
    let name = basename(relativePath);
    // Remove extension
    if (!isFolder) {
      name = name.substr(0, name.lastIndexOf('.'));
    }
    const split = name.split(' - ');
    const displayIndex = +split[0];
    let displayName: string;
    if (split.length === 1) {
      // No specified display name
      displayName = (isFolder ? folderDefaultNamer : chapterDefaultNamer)(displayIndex);
    } else {
      displayName = 'Past.' + displayIndex + ':' + split[1];
    }
    return {
      displayName,
      displayIndex,
      name,
      sourceRelativePath: relativePath,
    };
  }

  let charsCount = 0;
  let paragraphsCount = 0;
  const keywordsCount: Map<string, number> = new Map();
  keywords.forEach(keyword => {
    keywordsCount.set(keyword, 0);
  });

  function getHtmlRelativePath(parentHtmlRelativePath: string, fileName: string) {
    return ((parentHtmlRelativePath + '/').substr(1) /* Remove "/" in the beginning */ + fileName).split(' ').join('-');
  }

  async function loadChapter(path: string, parentHtmlRelativePath: string): Promise<Chapter> {
    let markdown = (await readFile(path)).toString();
    let isEarlyAccess = false;
    if (markdown.startsWith(earlyAccessFlag)) {
      isEarlyAccess = true;
      markdown = markdown.substr(earlyAccessFlag.length).trimLeft();
    }

    let commentsUrl: string | null = null;
    if (markdown.startsWith(commentsUrlBegin)) {
      const commentsUrlBeginIndex = commentsUrlBegin.length;
      const commentsUrlEndIndex = markdown.indexOf(commentsUrlEnd, commentsUrlBeginIndex);
      commentsUrl = markdown.substring(commentsUrlBeginIndex, commentsUrlEndIndex);
      markdown = markdown.substr(commentsUrlEndIndex + 1).trimLeft();
    }

    const chapterCharCount = countChars(markdown);
    charsCount += chapterCharCount;

    keywords.forEach(keyword => {
      const count = countCertainWord(markdown, keyword);
      if (count !== 0) {
        keywordsCount.set(keyword, keywordsCount.get(keyword)! + count);
      }
    });

    const node = destructPath(path, false);

    const htmlRelativePath = getHtmlRelativePath(parentHtmlRelativePath, node.displayName + '.html');

    const mdi = new MDI({
      replaceLink(link: string) {
        if (!link.startsWith('./')) {
          return link;
        }
        return join('./chapters', dirname(htmlRelativePath), link);
      },
    } as MDI.Options).use(mdiReplaceLinkPlugin);

    const output = mdi.render(markdown);
    paragraphsCount += countParagraphs(output);

    const htmlPath = resolve(distChapters, htmlRelativePath);

    await mkdirp(dirname(htmlPath));

    await writeFile(htmlPath, output);
    console.info(`${node.sourceRelativePath} (${node.displayName}) rendered to ${htmlPath}.`);

    return {
      ...node,
      isEarlyAccess,
      commentsUrl,
      htmlRelativePath,
      chapterCharCount,
    };
  }

  async function copyResource(path: string, parentHtmlRelativePath: string): Promise<void> {
    const targetRelativePath = getHtmlRelativePath(parentHtmlRelativePath, basename(path));
    const targetPath = resolve(distChapters, targetRelativePath);
    await mkdirp(dirname(targetPath));
    await (copyFile as any)(path, targetPath);

    console.info(`${path} copied to ${targetPath}.`);
  }

  interface HasDisplayIndex {
    displayIndex: number;
  }
  function byDisplayIndex(a: HasDisplayIndex, b: HasDisplayIndex) {
    return a.displayIndex - b.displayIndex;
  }

  async function loadFolder(path: string, parentHtmlRelativePath: string, isRoot: boolean): Promise<Folder> {
    const node = destructPath(path, true);
    const htmlRelativePath = isRoot ? '' : (parentHtmlRelativePath + '/' + node.displayName);
    const names = await readdir(path);
    // Collect all promises created for loading subdirs
    const subDirsLoadingPromises: Array<Promise<Folder>> = [];
    const chaptersLoadingPromises: Array<Promise<Chapter>> = [];
    for (const name of names) {
      const subpath = resolve(path, name);
      const isDirectory = (await stat(subpath)).isDirectory();
      if (isDirectory) {
        subDirsLoadingPromises.push(loadFolder(subpath, htmlRelativePath, false));
      } else {
        if (subpath.endsWith('.pdf')) {
          await copyResource(subpath, htmlRelativePath);
        }
        // Ignore backup files created by text editors
        if (!subpath.endsWith('.md')) {
          continue;
        }
        chaptersLoadingPromises.push(loadChapter(subpath, htmlRelativePath));
      }
    }

    const chapters = (await Promise.all(chaptersLoadingPromises)).sort(byDisplayIndex);
    const subFolders = (await Promise.all(subDirsLoadingPromises)).sort(byDisplayIndex);

    return {
      ...node,
      isRoot,
      chapters,
      subFolders,
      folderCharCount: chapters.reduce((count, chapter) => count += chapter.chapterCharCount, 0) +
        subFolders.reduce((count, folder) => count += folder.folderCharCount, 0),
    };
  }

  const data: Data = {
    chapterTree: await loadFolder(chaptersDir, '', true),
    charsCount,
    paragraphsCount,
    keywordsCount: [...keywordsCount].sort((a, b) => b[1] - a[1]),
    buildNumber: process.env.TRAVIS_BUILD_NUMBER || 'Unoffical',
  };
  await writeFile(
    resolve(distDir, 'data.js'),
    `window.DATA=${JSON.stringify(data, null, 2)};`,
  );
  console.info('data.js created.');
})();
