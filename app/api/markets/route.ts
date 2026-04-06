import { NextResponse } from 'next/server';

const generateChartData = (startPrice: number) => {
  let currentPrice = startPrice;
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: i.toString(),
      price: currentPrice,
    });
    currentPrice = Math.max(1, Math.min(99, currentPrice + (Math.random() * 10 - 5)));
  }
  return data;
};

export async function GET() {
  const markets = [
    {
      id: 'm1',
      question: 'Will Bitcoin hit $100k by June?',
      category: 'CRYPTO',
      creator: {
        name: 'CryptoWhale',
        avatar: 'https://picsum.photos/seed/cryptowhale/100/100',
        followers: 12400,
      },
      yesProb: 65,
      chartData: generateChartData(65),
      sentiment: 'bullish',
      aiPrediction: 72,
      timeLeft: '2d 14h',
      whaleActivity: true,
      edgeScore: 9.2,
      mispricingSignal: 'Undervalued by 7%',
      volume: 1450000,
      copyCount: 1240,
    },
    {
      id: 'm2',
      question: 'Will the Fed cut rates in May?',
      category: 'MACRO',
      creator: {
        name: 'MacroEdge',
        avatar: 'https://picsum.photos/seed/macroedge/100/100',
        followers: 8900,
      },
      yesProb: 32,
      chartData: generateChartData(32),
      sentiment: 'bearish',
      aiPrediction: 28,
      timeLeft: '14d 2h',
      whaleActivity: false,
      edgeScore: 6.5,
      mispricingSignal: 'Fairly priced',
      volume: 890000,
      copyCount: 450,
    },
    {
      id: 'm3',
      question: 'Will SpaceX launch Starship V3 this month?',
      category: 'SPACE',
      creator: {
        name: 'AstroBet',
        avatar: 'https://picsum.photos/seed/astrobet/100/100',
        followers: 4500,
      },
      yesProb: 88,
      chartData: generateChartData(88),
      sentiment: 'bullish',
      aiPrediction: 91,
      timeLeft: '5d 8h',
      whaleActivity: true,
      edgeScore: 8.8,
      mispricingSignal: 'Strong momentum',
      volume: 2100000,
      copyCount: 3200,
    }
  ];

  return NextResponse.json({ markets });
}
