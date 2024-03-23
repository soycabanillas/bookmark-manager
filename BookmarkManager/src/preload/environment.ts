import { ipcRenderer } from 'electron'
import { IEnvironment } from './environmentapi'

// Custom APIs for renderer
export const environment: IEnvironment = {
  isDevelopment: () => ipcRenderer.invoke('env:IsDevelopment')
}
