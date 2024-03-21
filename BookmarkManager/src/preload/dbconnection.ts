import { ipcRenderer } from 'electron'
import { IElectronApi } from "./dbconnectionapi";

// Custom APIs for renderer
export const api : IElectronApi  = {
  doAThing: (limit, offset) => ipcRenderer.invoke("loadBookmarks", limit, offset),
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
}
