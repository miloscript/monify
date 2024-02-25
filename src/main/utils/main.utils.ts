import { promises as fs } from 'fs'
import * as path from 'path'
import { DataState } from '../../shared/data.types'

export const saveStateToFile = async (filePath: string, data: DataState): Promise<void> => {
  const dir = path.dirname(filePath)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
  await fs.writeFile(filePath, JSON.stringify(data), 'utf8')
}

export const readStateFromFile = async (filePath: string): Promise<DataState | undefined> => {
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}
