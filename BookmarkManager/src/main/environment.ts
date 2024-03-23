import { ipcMain, app } from 'electron'

export const isDevelopment = app.isPackaged == false

export function initializeEnvironment(): void {
  ipcMain.handle('env:IsDevelopment', () => isDevelopment)
}
