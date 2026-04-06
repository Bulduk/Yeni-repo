'use client';

import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { Activity, Sparkles, TrendingUp, Users, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PulseEvent = {
  id: string;
  type: 'whale' | 'ai' | 'momentum' | 'copy';
  text: string;
  time: Date;
};

export default function Pulse() {
  const [events, setEvents] = useState<PulseEvent[]>([]);

  useEffect(() => {
    // Simulate incoming websocket events
    const mockEvents: Omit<PulseEvent, 'id' | 'time'>[] = [
      { type: 'whale', text: 'Whale bought $20K YES on BTC to $100k' },
      { type: 'ai', text: 'Edge detected on SpaceX Mars mission' },
      { type: 'momentum', text: 'Momentum spike on AI regulation market' },
      { type: 'copy', text: '150 users copying Satoshi_N' },
      { type: 'whale', text: 'Whale sold $50K NO on ETH ETF' },
      { type: 'ai', text: 'Mispricing signal on Fed rate cut' },
    ];

    const createEvent = (event: Omit<PulseEvent, 'id'>): PulseEvent => ({
      ...event,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    });

    const addEvent = () => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newEvent = {
        ...randomEvent,
        time: new Date(),
      };

      setEvents((prev) => {
        const updated = [...prev, createEvent(newEvent)];
        return updated.slice(-50);
      });
    };

    // Initial events
    for(let i=0; i<5; i++) addEvent();

    const interval = setInterval(addEvent, 3000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: PulseEvent['type']) => {
    switch (type) {
      case 'whale': return <span className="text-xl">🐋</span>;
      case 'ai': return <Zap className="w-5 h-5 text-accent" />;
      case 'momentum': return <TrendingUp className="w-5 h-5 text-yes" />;
      case 'copy': return <Users className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-bg-base flex flex-col text-text-primary font-sans">
      <div className="pt-[calc(env(safe-area-inset-top,1rem)+0.5rem)] px-4 pb-4 bg-bg-surface border-b border-border-color shrink-0 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-no animate-pulse" />
        <h1 className="text-2xl font-bold tracking-tight">Live Pulse</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <div className="flex flex-col-reverse gap-3">
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="bg-bg-surface border border-border-color rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-text-primary/5 flex items-center justify-center shrink-0">
                  {getIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm leading-tight">{event.text}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
