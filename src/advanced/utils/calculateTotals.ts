import { CartItemType, Product } from '../types';

export const calculateTotals = (
  cart: CartItemType[],
  products: Product[]
): { roundedTotalAmount: number; discountRate: number; points: number } => {
  let totalAmount = 0;
  let itemCnt = 0;
  let subTotal = 0;

  cart.forEach(({ id, stock }) => {
    const prod = products.find((product) => product.id === id);
    if (!prod) return;
    const itemTotal = prod.price * stock;
    subTotal += itemTotal;
    itemCnt += stock;

    let disc = 0;
    if (stock >= 10) {
      switch (id) {
        case 'p1':
          disc = 0.1;
          break;
        case 'p2':
          disc = 0.15;
          break;
        case 'p3':
          disc = 0.2;
          break;
        case 'p4':
          disc = 0.05;
          break;
        case 'p5':
          disc = 0.25;
          break;
      }
    }
    totalAmount += itemTotal * (1 - disc);
  });

  let discountRate = (subTotal - totalAmount) / subTotal || 0;

  if (itemCnt >= 30) {
    const bulkDisc = subTotal * 0.25;
    if (bulkDisc > subTotal - totalAmount) {
      totalAmount = subTotal * 0.75;
      discountRate = 0.25;
    }
  }

  // 화요일 추가 10% 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  const points = Math.floor(totalAmount / 1000);

  return { roundedTotalAmount: Math.round(totalAmount), discountRate, points };
};
