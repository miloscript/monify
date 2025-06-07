import { app, shell } from 'electron'
import { unlink } from 'fs/promises'
import { exportDateFormat, readStateFromFile, saveStateToFile } from '../../utils/main.utils'
import { CreateElectronEvent } from '../types.ipc'

export const exportAndOpenDownloadsEvent: CreateElectronEvent<'export-and-open-downloads'> = {
  name: 'export-and-open-downloads',
  type: 'on',
  handler: async (): Promise<void> => {
    const state = await readStateFromFile(app.getPath('userData') + '/data/state.json')
    if (!state) return

    const exportFilePath = app.getPath('downloads') + `/monify-export-${exportDateFormat()}.json`
    saveStateToFile(exportFilePath, state)

    shell.openPath(app.getPath('downloads'))
  }
}

export const openDataFolderEvent: CreateElectronEvent<'open-data-folder'> = {
  name: 'open-data-folder',
  type: 'on',
  handler: async (): Promise<void> => {
    shell.openPath(app.getPath('userData'))
  }
}

export const deleteAttachmentEvent: CreateElectronEvent<'delete-attachment'> = {
  name: 'delete-attachment',
  type: 'handle',
  handler: async (
    _event: Electron.IpcMainInvokeEvent,
    filePath: string
  ): Promise<{ success: boolean; error?: string }> => {
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
