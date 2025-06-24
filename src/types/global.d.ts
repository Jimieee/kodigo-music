declare global {
  interface Window {
    __handleSeek?: (time: number) => void;
  }
}

export {};