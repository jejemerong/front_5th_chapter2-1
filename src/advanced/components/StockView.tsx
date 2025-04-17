import React from 'react';
import { Product } from '../types';

interface StockProps {
  products: Product[];
}

const StockView: React.FC<StockProps> = ({ products }) => {
  const stockMessages = products
    .filter((product) => product.stock < 5)
    .map(
      (product) =>
        `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}`
    );

  return (
    <div className='text-sm text-gray-500 mt-2'>
      {stockMessages.map((message) => (
        <div key={message}>{message}</div>
      ))}
    </div>
  );
};

export default StockView;
