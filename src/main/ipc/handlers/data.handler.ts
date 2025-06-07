import { IpcMainEvent, app } from 'electron'
import { DataState } from '../../../shared/data.types'
import { readStateFromFile, saveStateToFile } from '../../utils/main.utils'
import { CreateElectronEvent } from '../types.ipc'

export const getDataEvent: CreateElectronEvent<'get-data'> = {
  name: 'get-data',
  type: 'handle',
  handler: async (): Promise<DataState> => {
    const stateFilePath = app.getPath('userData') + '/data/state.json'
    const state = await readStateFromFile(stateFilePath)
    if (!state) {
      throw new Error('Failed to read state file')
    }
    return state
  }
}

export const setDataEvent: CreateElectronEvent<'set-data'> = {
  name: 'set-data',
  type: 'on',
  handler: (_: IpcMainEvent, state: DataState): void => {
    const stateFilePath = app.getPath('userData') + '/data/state.json'
    saveStateToFile(stateFilePath, state)
  }
}
