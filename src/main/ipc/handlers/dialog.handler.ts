import { dialog } from 'electron'
import { copyFile, mkdir } from 'fs/promises'
import { join } from 'path'
import xlsx from 'xlsx'
import { CreateElectronEvent } from '../types.ipc'

export const openDialogEvent: CreateElectronEvent<'open-dialog'> = {
  name: 'open-dialog',
  type: 'handle',
  handler: async (): Promise<xlsx.WorkBook> => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] })
    const workbook = xlsx.readFile(result.filePaths[0])
    return workbook
  }
}

export const openDirectoryDialogEvent: CreateElectronEvent<'open-directory-dialog'> = {
  name: 'open-directory-dialog',
  type: 'handle',
  handler: async (): Promise<Electron.OpenDialogReturnValue> => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Invoice Storage Directory'
    })
    return result
  }
}

export const openAttachmentDialogEvent: CreateElectronEvent<'open-attachment-dialog'> = {
  name: 'open-attachment-dialog',
  type: 'handle',
  handler: async (
    _: Electron.IpcMainInvokeEvent,
    data: { storagePath: string; valueDate: string }
  ): Promise<Electron.OpenDialogReturnValue> => {
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
}
