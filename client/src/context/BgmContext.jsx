import React, { createContext, useContext } from 'react';

const BgmContext = createContext({
  isPlaying: false,
  toggleBgm: () => {},
});

export const BgmProvider = ({ children }) => {
  return (
    <BgmContext.Provider value={{ isPlaying: false, toggleBgm: () => {} }}>
      {children}
    </BgmContext.Provider>
  );
};

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) {
    return { isPlaying: false, toggleBgm: () => {} };
  }
  return context;
};

export default BgmContext;

