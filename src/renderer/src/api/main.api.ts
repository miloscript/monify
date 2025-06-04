import { DataState } from '@shared/data.types'
import xlsx from 'xlsx'

export const saveData = (data: DataState) => {
  window.electron.ipcRenderer.send('set-data', data)
}

export const getData = (): Promise<DataState> => {
  return window.electron.ipcRenderer.invoke('get-data')
}

export const exportAndOpenDownloads = () => {
  window.electron.ipcRenderer.send('export-and-open-downloads')
}

export const openDataFolder = () => {
  window.electron.ipcRenderer.send('open-data-folder')
}

export const openDialog = async (): Promise<xlsx.WorkBook> => {
  return window.electron.ipcRenderer.invoke('open-dialog')
}

export const openDirectoryDialog = async () => {
  return await window.electron.ipcRenderer.invoke('open-directory-dialog')
}
