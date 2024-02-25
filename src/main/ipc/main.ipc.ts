import { IpcMainEvent, app, ipcMain } from 'electron'
import { DataState } from '../../shared/data.types'
import { readStateFromFile, saveStateToFile } from '../utils/main.utils'

export interface ElectronApi {
  getState: () => Promise<DataState>
  setState: (state: DataState) => Promise<DataState>
}

type ElectronEventName = 'get-data' | 'set-data'

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
