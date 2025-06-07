import xlsx from 'xlsx'
import { DataState } from '../../shared/data.types'

// Define the mapping between event names and their handler signatures
export interface ElectronEventHandlers {
  'get-data': {
    type: 'handle'
    handler: (event: Electron.IpcMainInvokeEvent) => Promise<DataState>
  }
  'set-data': {
    type: 'on'
    handler: (event: Electron.IpcMainEvent, state: DataState) => void
  }
  'export-and-open-downloads': {
    type: 'on'
    handler: (event: Electron.IpcMainEvent) => Promise<void>
  }
  'open-dialog': {
    type: 'handle'
    handler: (event: Electron.IpcMainInvokeEvent) => Promise<xlsx.WorkBook>
  }
  'open-data-folder': {
    type: 'on'
    handler: (event: Electron.IpcMainEvent) => Promise<void>
  }
  'open-directory-dialog': {
    type: 'handle'
    handler: (event: Electron.IpcMainInvokeEvent) => Promise<Electron.OpenDialogReturnValue>
  }
  'open-attachment-dialog': {
    type: 'handle'
    handler: (
      event: Electron.IpcMainInvokeEvent,
      data: { storagePath: string; valueDate: string }
    ) => Promise<Electron.OpenDialogReturnValue>
  }
  'delete-attachment': {
    type: 'handle'
    handler: (
      event: Electron.IpcMainInvokeEvent,
      filePath: string
    ) => Promise<{ success: boolean; error?: string }>
  }
}

export type ElectronEventName = keyof ElectronEventHandlers

export type ElectronEvent<T extends ElectronEventName> = {
  name: T
  type: ElectronEventHandlers[T]['type']
  handler: ElectronEventHandlers[T]['handler']
}

export type CreateElectronEvent<T extends ElectronEventName> = ElectronEvent<T>
