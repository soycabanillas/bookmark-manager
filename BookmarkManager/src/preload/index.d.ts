import { IElectronApi } from './dbconnectionapi'
import { IEnvironment } from './environmentapi'

declare global {
  interface Window {
    api: IElectronApi
    environment: IEnvironment
  }
}
