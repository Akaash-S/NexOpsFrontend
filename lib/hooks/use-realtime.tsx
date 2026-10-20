'use client';

import { useEffect, useRef } from 'react';
import { useAppState } from './use-app-state';

export function useRealtime() {
  const { isAuthenticated } = useAppState();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRef = useRef(1000); // Start with 1s backoff

  useEffect(() => {
    if (!isAuthenticated) {
      if (wsRef.current) {
        wsRef.current.close();
      }
      return;
    }

    function connect() {
      // Clean up existing timeout if any
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('Realtime: No authToken found in localStorage. Retrying...');
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
        return;
      }

      // Derive WebSocket URL from explicit variable or API URL
      let wsUrl = process.env.NEXT_PUBLIC_WS_URL || '';
      if (!wsUrl) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const base = apiUrl.replace('/api/v1', '');
        if (base.startsWith('https://')) {
          wsUrl = base.replace('https://', 'wss://') + '/ws';
        } else if (base.startsWith('http://')) {
          wsUrl = base.replace('http://', 'ws://') + '/ws';
        } else {
          wsUrl = 'ws://localhost:8000/ws';
        }
      }

      const fullWsUrl = `${wsUrl}?token=${encodeURIComponent(token)}`;
      console.log(`Realtime: Connecting to ${wsUrl}...`);

      const ws = new WebSocket(fullWsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Realtime: WebSocket connection established successfully.');
        backoffRef.current = 1000; // Reset backoff on successful connect
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Realtime: Received message:', data);

          // Dispatch event to window so any component can listen to it
          if (data.type) {
            window.dispatchEvent(
              new CustomEvent(`nexops:${data.type}`, { detail: data.payload })
            );
          }
          // Also dispatch general update event
          window.dispatchEvent(
            new CustomEvent('nexops:realtime_update', { detail: data })
          );
        } catch (err) {
          console.error('Realtime: Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('Realtime: WebSocket error:', err);
      };

      ws.onclose = (event) => {
        console.warn(`Realtime: WebSocket connection closed (code: ${event.code}). Reconnecting...`);
        // Reject auth failures (code 4001) without retrying immediately
        if (event.code === 4001) {
          console.error('Realtime: Authentication failed. WebSocket closed.');
          return;
        }

        // Reconnect with exponential backoff
        const delay = backoffRef.current;
        backoffRef.current = Math.min(backoffRef.current * 2, 30000); // Cap at 30s
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);
}
