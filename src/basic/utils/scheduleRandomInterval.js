// 랜덤 타이머 함수
export const scheduleRandomInterval = (callback, interval, delay) => {
  setTimeout(() => setInterval(callback, interval), Math.random() * delay);
};
