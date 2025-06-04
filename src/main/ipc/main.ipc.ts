import { IpcMainEvent, app, dialog, ipcMain, shell } from 'electron'
import { copyFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import xlsx from 'xlsx'
import { DataState } from '../../shared/data.types'
import { exportDateFormat, readStateFromFile, saveStateToFile } from '../utils/main.utils'

export interface ElectronApi {
  getState: () => Promise<DataState>
  setState: (state: DataState) => Promise<DataState>
}

// Define the mapping between event names and their handler signatures
interface ElectronEventHandlers {
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

type ElectronEventName = keyof ElectronEventHandlers

type ElectronEvent<T extends ElectronEventName> = {
  name: T
  type: ElectronEventHandlers[T]['type']
  handler: ElectronEventHandlers[T]['handler']
}

// Helper type to create events with proper typing
type CreateElectronEvent<T extends ElectronEventName> = ElectronEvent<T>

const events: {
  [K in ElectronEventName]: CreateElectronEvent<K>
} = {
  'get-data': {
    name: 'get-data',
    type: 'handle',
    handler: async () => {
      const stateFilePath = app.getPath('userData') + '/data/state.json'
      const state = await readStateFromFile(stateFilePath)
      if (!state) {
        throw new Error('Failed to read state file')
      }
      return state
    }
  },
  'set-data': {
    name: 'set-data',
    type: 'on',
    handler: (_: IpcMainEvent, state: DataState) => {
      const stateFilePath = app.getPath('userData') + '/data/state.json'
      saveStateToFile(stateFilePath, state)
    }
  },
  'export-and-open-downloads': {
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
  'open-data-folder': {
    name: 'open-data-folder',
    type: 'on',
    handler: async () => {
      shell.openPath(app.getPath('userData'))
    }
  },
  'open-dialog': {
    name: 'open-dialog',
    type: 'handle',
    handler: async () => {
      const result = await dialog.showOpenDialog({ properties: ['openFile'] })
      const workbook = xlsx.readFile(result.filePaths[0])
      return workbook
    }
  },
  'open-directory-dialog': {
    name: 'open-directory-dialog',
    type: 'handle',
    handler: async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Invoice Storage Directory'
      })
      return result
    }
  },
  'open-attachment-dialog': {
    name: 'open-attachment-dialog',
    type: 'handle',
    handler: async (event, data: { storagePath: string; valueDate: string }) => {
      const { storagePath, valueDate } = data

      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: 'Documents',
            extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']
          }
        ],
        title: 'Select Attachment'
      })

      if (result.canceled || !result.filePaths.length) {
        return result
      }

      // Parse the transaction date to get year and month
      const transactionDate = new Date(valueDate)
      const year = transactionDate.getFullYear()
      const month = String(transactionDate.getMonth() + 1).padStart(2, '0') // Month is 0-indexed, pad with 0

      // Create the nested folder structure
      const yearFolder = join(storagePath, year.toString())
      const monthFolder = join(yearFolder, month)

      // Ensure directories exist
      await mkdir(monthFolder, { recursive: true })

      const sourcePath = result.filePaths[0]
      const fileName = sourcePath.split('/').pop() || ''
      const targetPath = join(monthFolder, fileName)

      // Copy the file to the organized directory structure
      await copyFile(sourcePath, targetPath)

      // Return the new path
      return {
        ...result,
        filePaths: [targetPath]
      }
    }
  },
  'delete-attachment': {
    name: 'delete-attachment',
    type: 'handle',
    handler: async (_event, filePath: string) => {
      try {
        await unlink(filePath)
        console.log('Successfully deleted attachment:', filePath)
        return { success: true }
      } catch (error: unknown) {
        console.error('Error deleting file:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }
    }
  }
}

export const attachEvents = () => {
  Object.values(events).forEach((event) => {
    console.log('Attaching events', event.name, event.type)
    if (event.type === 'on') {
      ipcMain.on(event.name, event.handler)
    }
    if (event.type === 'handle') {
      ipcMain.handle(event.name, event.handler)
    }
  })
}
