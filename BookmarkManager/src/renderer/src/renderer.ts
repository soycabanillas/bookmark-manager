import { InfiniteGrid } from "./infinite-grid";
import { IBookmark } from "../../preload/dbconnectionapi";

function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing()
  })
}

function doAThing(): void {
  replaceText('.electron-version', `Electron v${window.api.electron()}`)
  replaceText('.chrome-version', `Chromium v${window.api.chrome()}`)
  replaceText('.node-version', `Node v${window.api.node()}`)
  const ipcHandlerBtn = document.getElementById('ipcHandler')
  ipcHandlerBtn?.addEventListener('click', async () => {
    // @ts-ignore
    const grid : InfiniteGrid = document.querySelector('infinite-grid');
    // @ts-ignore
    const bookmarks : IBookmark[] = await window.api.doAThing(50,10)
    grid.loadMoreItems(bookmarks)
  })
}

function replaceText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.innerText = text
  }
}

init()
