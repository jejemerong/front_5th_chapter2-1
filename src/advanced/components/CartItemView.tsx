import React from 'react';
import { Product } from '../types';

interface CartItemProps {
  product: Product;
  stock: number;
  onChange: (change: number) => void;
  onRemove: () => void;
}

const CartItemView: React.FC<CartItemProps> = ({ product, stock, onChange, onRemove }) => {
  return (
    <div className='flex justify-between items-center mb-2'>
      <span>{`${product.name} - ${product.price}원 x ${stock}`}</span>
      <div>
        <button
          className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          onClick={() => onChange(-1)}
        >
          -
        </button>
        <button
          className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
          onClick={() => onChange(1)}
        >
          +
        </button>
        <button className='remove-item bg-red-500 text-white px-2 py-1 rounded' onClick={onRemove}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItemView;
