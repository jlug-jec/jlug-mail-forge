import { NextResponse } from 'next/server';
import { getSheetDocuments, getWorksheetData } from '@/lib/google-sheets';

if (!process.env.GOOGLE_SHEETS_ID) {
  throw new Error('GOOGLE_SHEETS_ID is not defined in environment variables');
}

const sheetId = process.env.GOOGLE_SHEETS_ID;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const worksheetName = searchParams.get('worksheet');

    if (!worksheetName) {
      const sheets = await getSheetDocuments(sheetId);
      if (!sheets || sheets.length === 0) {
        return NextResponse.json(
          { error: 'No sheets found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ sheets });
    }

    const data = await getWorksheetData(sheetId, worksheetName);
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in worksheet' },
        { status: 404 }
      );
    }
    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
