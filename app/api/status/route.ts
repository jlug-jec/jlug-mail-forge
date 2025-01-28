import { google } from 'googleapis'
import { checkServicesStatus } from '@/lib/service-status';

export async function GET() {
  const status = await checkServicesStatus();
  return Response.json(status);
}