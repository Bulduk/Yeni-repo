import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { marketId, type, amount, price } = body;

  // Simulate trade execution
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    message: `Successfully bought ${amount} ${type} shares at ${price}c`,
    trade: {
      marketId,
      type,
      amount,
      price,
      timestamp: new Date().toISOString(),
    }
  });
}
