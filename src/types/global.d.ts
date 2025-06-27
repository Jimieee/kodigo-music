declare global {
  interface Window {
    __handleSeek?: (time: number) => void;
    __authUnsubscribe?: () => void;
  }
}

export {};