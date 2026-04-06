import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    balance: 12450.50,
    positions: [
      { marketId: 'm1', type: 'YES', shares: 100, avgPrice: 60 },
    ],
    totalProfit: 345.20,
  });
}
