// 랜덤 타이머 함수
export const scheduleRandomInterval = (callback: () => void, interval: number, delay: number) => {
  setTimeout(() => setInterval(callback, interval), Math.random() * delay);
};
