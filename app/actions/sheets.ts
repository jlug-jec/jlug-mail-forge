'use server'

import { cookies } from 'next/headers'
import { getSheetDocuments, getWorksheetData } from '@/lib/google-sheets'

export async function getSheets(sheetId: string) {
  const cookieStore = await cookies()
  const isAuthenticated =  cookieStore.get('isAuthenticated')
  if (!isAuthenticated) throw new Error('Unauthorized')

  try {
    return await getSheetDocuments(sheetId)
  } catch (error: any) {
    if (error.message === 'PERMISSION_DENIED') {
      throw new Error('This sheet is private. Select a public sheet or if you are owner, make the sheet public.')
    }
    if (error.message === 'SHEET_NOT_FOUND') {
      throw new Error('Sheet not found')
    }
    throw new Error('Failed to fetch sheet')
  }
}

export async function getWorksheet(sheetId: string, worksheetName: string) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('isAuthenticated')
  if (!isAuthenticated) throw new Error('Unauthorized')

  try {
    return await getWorksheetData(sheetId, worksheetName)
  } catch (error) {
    throw new Error('Failed to fetch worksheet')
  }
}