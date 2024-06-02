import { DataState } from '@shared/data.types'

export const saveData = (data: DataState) => {
  window.electron.ipcRenderer.send('set-data', data)
}

export const getData = (): Promise<DataState> => {
  return window.electron.ipcRenderer.invoke('get-data')
}

export const exportAndOpenDownloads = () => {
  window.electron.ipcRenderer.send('export-and-open-downloads')
}
