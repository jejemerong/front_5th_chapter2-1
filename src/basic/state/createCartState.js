export const createCartState = () => {
  let lastSel = 0;
  let totalAmt = 0;

  return {
    getLastSel: () => lastSel,
    setLastSel: (val) => (lastSel = val),
    getTotalAmt: () => totalAmt,
    setTotalAmt: (val) => (totalAmt = val),
  };
};
