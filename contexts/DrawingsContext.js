"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';
import { authStore, getFullList } from '@/lib/pocketbase';

const DrawingsContext = createContext();

export function DrawingsProvider({ children }) {
  const [drawings, setDrawings] = useState([]);

  const fetchDrawings = useCallback(async () => {
    if (authStore.isValid) {
      try {
        const records = await getFullList('drawings', {
          sort: '-created',
        });
        setDrawings(records);
      } catch (error) {
        console.error('Error fetching drawings:', error);
      }
    }
  }, []);

  const addDrawing = useCallback((newDrawing) => {
    setDrawings(prevDrawings => [newDrawing, ...prevDrawings]);
  }, []);

  return (
    <DrawingsContext.Provider value={{ drawings, fetchDrawings, addDrawing }}>
      {children}
    </DrawingsContext.Provider>
  );
}

export function useDrawings() {
  return useContext(DrawingsContext);
}