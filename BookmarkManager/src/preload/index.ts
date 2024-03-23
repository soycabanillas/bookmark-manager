import { contextBridge } from 'electron'
import { environment } from './environment'
import { api } from './dbconnection'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('environment', environment)
  } catch (error) {
    console.error(error)
  }
} else {
  // window.api = api
  // window.environment = environment
}
