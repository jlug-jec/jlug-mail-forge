import { NextResponse } from 'next/server';
import { getSheetDocuments, getWorksheetData } from '@/lib/google-sheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const worksheetName = searchParams.get('worksheet');
    const sheetId = searchParams.get('sheetId') || process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      return NextResponse.json(
        { error: 'Sheet ID is required' },
        { status: 400 }
      );
    }

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
