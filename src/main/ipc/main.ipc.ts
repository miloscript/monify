import { IpcMainEvent, app, dialog, ipcMain, shell } from 'electron'
import { DataState } from '../../shared/data.types'
import { exportDateFormat, readStateFromFile, saveStateToFile } from '../utils/main.utils'

import xlsx from 'xlsx'

export interface ElectronApi {
  getState: () => Promise<DataState>
  setState: (state: DataState) => Promise<DataState>
}

type ElectronEventName =
  | 'get-data'
  | 'set-data'
  | 'export-and-open-downloads'
  | 'open-dialog'
  | 'open-data-folder'

type ElectronEvent = {
  name: ElectronEventName
  type: 'on' | 'handle'
  handler: (event: Electron.IpcMainEvent, data: DataState) => void
}

const events: ElectronEvent[] = [
  {
    name: 'get-data',
    type: 'handle',
    handler: async () => {
      const stateFilePath = app.getPath('userData') + '/data/state.json'
      const state = await readStateFromFile(stateFilePath)
      return state
    }
  },
  {
    name: 'set-data',
    type: 'on',
    handler: (_: IpcMainEvent, state: DataState) => {
      const stateFilePath = app.getPath('userData') + '/data/state.json'
      saveStateToFile(stateFilePath, state)
    }
  },
  {
    name: 'export-and-open-downloads',
    type: 'on',
    handler: async () => {
      const state = await readStateFromFile(app.getPath('userData') + '/data/state.json')
      if (!state) return

      const exportFilePath = app.getPath('downloads') + `/monify-export-${exportDateFormat()}.json`
      saveStateToFile(exportFilePath, state)

      shell.openPath(app.getPath('downloads'))
    }
  },
  {
    name: 'open-data-folder',
    type: 'on',
    handler: async () => {
      shell.openPath(app.getPath('userData'))
    }
  },
  {
    name: 'open-dialog',
    type: 'handle',
    handler: async () => {
      const result = await dialog.showOpenDialog({ properties: ['openFile'] })
      const workbook = xlsx.readFile(result.filePaths[0])
      return workbook
    }
  }
]

export const attachEvents = () => {
  for (const event of events) {
    console.log('Attaching events', event.name, event.type)
    if (event.type === 'on') ipcMain.on(event.name, event.handler)
    if (event.type === 'handle')
      ipcMain.handle(
        event.name,
        event.handler as (
          event: Electron.IpcMainInvokeEvent,
          data: DataState
        ) => void | Promise<DataState>
      )
  }
}
