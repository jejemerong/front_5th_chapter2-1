import React from 'react';
import { Product } from '../types';

interface ProductSelectOptionsProps {
  products: Product[];
  onClickAddBtn: (id: string) => void;
}

const ProductSelectOptionsView: React.FC<ProductSelectOptionsProps> = ({
  products,
  onClickAddBtn,
}) => {
  const [selected, setSelected] = React.useState(products[0]?.id || '');

  return (
    <div className='mt-4'>
      <select
        className='border rounded p-2 mr-2'
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.stock === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded'
        onClick={() => onClickAddBtn(selected)}
      >
        추가
      </button>
    </div>
  );
};

export default ProductSelectOptionsView;
