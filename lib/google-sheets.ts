import { google } from 'googleapis';
import { sheets_v4 } from 'googleapis';

if (!process.env.GOOGLE_SHEETS_API_KEY) {
  throw new Error('GOOGLE_SHEETS_API_KEY is not defined in environment variables');
}

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export const sheets = google.sheets({ 
  version: 'v4', 
  auth: API_KEY
});

interface SheetProperties {
  id: number | null;
  title: string | null;
  index: number | null;
  sheetType: string | null;
}

type SheetResponse = sheets_v4.Schema$Spreadsheet;
type ValueResponse = sheets_v4.Schema$ValueRange;

async function handleSheetRequest<T>(
  requestFn: () => Promise<{ data: SheetResponse | ValueResponse }>,
  transformFn: (data: SheetResponse | ValueResponse) => T
): Promise<T> {
  try {
    const response = await requestFn();
    return transformFn(response.data);
  } catch (error: any) {
    if (error.code === 403) {
      throw new Error('PERMISSION_DENIED');
    }
    if (error.code === 404) {
      throw new Error('SHEET_NOT_FOUND');
    }
    console.error('Google Sheets API Error:', error);
    throw new Error('API_ERROR');
  }
}

export async function getSheetDocuments(sheetId: string): Promise<SheetProperties[]> {
  return handleSheetRequest(
    () => sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      includeGridData: false,
    }),
    (data) => {
      const spreadsheetData = data as sheets_v4.Schema$Spreadsheet;
      return spreadsheetData.sheets?.map((sheet) => ({
        id: sheet.properties?.sheetId ?? null,
        title: sheet.properties?.title ?? null,
        index: sheet.properties?.index ?? null,
        sheetType: sheet.properties?.sheetType ?? null
      })) || [];
    }
  );
}

export async function getWorksheetData(sheetId: string, worksheetName: string): Promise<Record<string, any>[]> {
  return handleSheetRequest(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: worksheetName,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING'
    }),
    (data) => {
      const valueData = data as sheets_v4.Schema$ValueRange;
      const rows = valueData.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      return rows.slice(1).map((row: any[]) =>
        headers.reduce((acc: Record<string, any>, header: string, index: number) => {
          acc[header] = row[index] || null;
          return acc;
        }, {})
      );
    }
  );
}
