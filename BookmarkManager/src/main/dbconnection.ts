import sqlite3 from 'sqlite3';
import { ipcMain } from "electron";
import path from "node:path";
import { IBookmark } from "../preload/dbconnectionapi";

const db = new sqlite3.Database(path.join(__dirname, '../../../MarkdownToSqlite/urls.db'), sqlite3.OPEN_READONLY);

function loadBookmarksfromsql(limit:number, offset:number) {
  let items: IBookmark[] = [];
  return new Promise<IBookmark[] | null>((resolve, reject) => {
    db.all(`SELECT title, thumbnail FROM url LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
      if (err) {
        reject();
      }
      rows.forEach((bookmark:any) => {
        let dataUrl : null | string = null;
        if (bookmark.thumbnail) {
          const base64Data = bookmark.thumbnail.toString('base64');
          dataUrl = `data:image/webp;base64,${base64Data}`;
        }

        items.push({
          title: bookmark.title,
          thumbnail: dataUrl,
        });
      });
      resolve(items)
    });
  })
}

export function initialize() :void {
  ipcMain.handle('loadBookmarks', (_, limit, offset) => loadBookmarksfromsql(limit, offset))
}
