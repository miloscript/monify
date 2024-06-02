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

export const exportDateFormat = (): string => {
  const now: Date = new Date()
  const day: string = String(now.getDate()).padStart(2, '0')
  const month: string = String(now.getMonth() + 1).padStart(2, '0')
  const year: number = now.getFullYear()
  const hours: string = String(now.getHours()).padStart(2, '0')
  const minutes: string = String(now.getMinutes()).padStart(2, '0')
  const seconds: string = String(now.getSeconds()).padStart(2, '0')

  return `${day}-${month}-${year}-${hours}${minutes}${seconds}`
}
