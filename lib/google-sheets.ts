import { google } from 'googleapis';

if (!process.env.GOOGLE_SHEETS_API_KEY) {
  throw new Error('GOOGLE_SHEETS_API_KEY is not defined in environment variables');
}

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

const sheets = google.sheets({ 
  version: 'v4', 
  auth: API_KEY
});

interface SheetProperties {
  id: number | null;
  title: string | null;
  index: number | null;
  sheetType: string | null;
}

async function handleSheetRequest<T>(
  requestFn: () => Promise<any>,
  transformFn: (data: any) => T
): Promise<T> {
  try {
    const response = await requestFn();
    return transformFn(response.data);
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    throw error;
  }
}

export async function getSheetDocuments(sheetId: string): Promise<SheetProperties[]> {
  return handleSheetRequest(
    () => sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      includeGridData: false,
    }),
    (data) => data.sheets?.map((sheet: any) => ({
      id: sheet.properties?.sheetId,
      title: sheet.properties?.title,
      index: sheet.properties?.index,
      sheetType: sheet.properties?.sheetType
    })) || []
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
      const rows = data.values || [];
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
