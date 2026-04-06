'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { socketClient } from '@/lib/socket';

const SocketContext = createContext(socketClient);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socketClient.connect();
    return () => {
      socketClient.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketClient}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
