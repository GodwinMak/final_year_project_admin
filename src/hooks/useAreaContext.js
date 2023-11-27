// useAreaContext.js
import { useContext } from 'react';
import { AreaContext } from '../context/AreaContext';

export const useAreaContext = () => {
  const context = useContext(AreaContext);

  if (!context) {
    throw new Error('useAreaContext must be used inside an AreaContextProvider');
  }

  return context; // Make sure you return the context object
};
