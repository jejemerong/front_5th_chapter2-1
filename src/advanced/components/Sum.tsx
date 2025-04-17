import React from 'react';
import { CartItemType, Product } from '../types';
import { calculateTotals } from '../utils/calculateTotals';

interface SumProps {
  cart: CartItemType[];
  products: Product[];
}

const Sum: React.FC<SumProps> = ({ cart, products }) => {
  const { roundedTotalAmount, discountRate, points } = calculateTotals(cart, products);

  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      총액: {roundedTotalAmount}원
      {discountRate > 0 && (
        <span className='text-green-500 ml-2'>({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span id='loyalty-points' className='text-blue-500 ml-2'>
        (포인트: {points})
      </span>
    </div>
  );
};

export default Sum;
