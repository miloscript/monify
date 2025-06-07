import { ipcMain } from 'electron'
import { getDataEvent, setDataEvent } from './handlers/data.handler'
import {
  openAttachmentDialogEvent,
  openDialogEvent,
  openDirectoryDialogEvent
} from './handlers/dialog.handler'
import {
  deleteAttachmentEvent,
  exportAndOpenDownloadsEvent,
  openDataFolderEvent
} from './handlers/file.handler'
import { CreateElectronEvent, ElectronEventName } from './types.ipc'

const events: {
  [K in ElectronEventName]: CreateElectronEvent<K>
} = {
  'get-data': getDataEvent,
  'set-data': setDataEvent,
  'export-and-open-downloads': exportAndOpenDownloadsEvent,
  'open-data-folder': openDataFolderEvent,
  'open-dialog': openDialogEvent,
  'open-directory-dialog': openDirectoryDialogEvent,
  'open-attachment-dialog': openAttachmentDialogEvent,
  'delete-attachment': deleteAttachmentEvent
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
