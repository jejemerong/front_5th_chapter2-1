import { PRODUCT_DISCOUNT_RATE } from '../constants';
import { CartItemType, Product } from '../types';

export const calculateTotals = (
  cart: CartItemType[],
  products: Product[]
): { roundedTotalAmount: number; discountRate: number; points: number } => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  cart.forEach(({ id, stock }) => {
    const prod = products.find((product) => product.id === id);
    if (!prod) return;
    const itemTotal = prod.price * stock;
    subTotal += itemTotal;
    itemCount += stock;

    const productDiscount =
      stock >= 10 ? PRODUCT_DISCOUNT_RATE[id as keyof typeof PRODUCT_DISCOUNT_RATE] : 0;

    totalAmount += itemTotal * (1 - productDiscount);
  });

  let discountRate = (subTotal - totalAmount) / subTotal || 0;

  if (itemCount >= 30) {
    const bulkDisc = subTotal * 0.25;
    if (bulkDisc > subTotal - totalAmount) {
      totalAmount = subTotal * 0.75;
      discountRate = 0.25;
    }
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  const points = Math.floor(totalAmount / 1000);

  return { roundedTotalAmount: Math.round(totalAmount), discountRate, points };
};
