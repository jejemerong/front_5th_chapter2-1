import { useState } from 'react';
import ProductSelectOptionsView from './components/ProductSelectOptionsView';
import CartContainer from './components/CartContainer';
import Sum from './components/Sum';
import { Product, CartItemType } from './types';
import StockView from './components/StockView';

const initialProducts: Product[] = [
  { id: 'p1', name: '상품1', price: 10000, stock: 50 },
  { id: 'p2', name: '상품2', price: 20000, stock: 30 },
  { id: 'p3', name: '상품3', price: 30000, stock: 20 },
  { id: 'p4', name: '상품4', price: 15000, stock: 0 },
  { id: 'p5', name: '상품5', price: 25000, stock: 10 },
];

const App = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItemType[]>([]);

  const onClickAddBtn = (id: string) => {
    const product = products.find((product) => product.id === id);
    if (!product || product.stock <= 0) return alert('재고가 부족합니다.');

    setCart((prev) => {
      const targetProduct = prev.find((item) => item.id === id);
      if (targetProduct) {
        if (targetProduct.stock < product.stock) {
          return prev.map((item) => (item.id === id ? { ...item, stock: item.stock + 1 } : item));
        } else {
          alert('재고가 부족합니다.');
          return prev;
        }
      } else {
        return [...prev, { id, stock: 1 }];
      }
    });
    setProducts((products) =>
      products.map((product) =>
        product.id === id ? { ...product, stock: product.stock - 1 } : product
      )
    );
  };

  return (
    <div className='bg-gray-100 p-8'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        <CartContainer
          cart={cart}
          setCart={setCart}
          products={products}
          setProducts={setProducts}
        />
        <Sum cart={cart} products={products} />
        <ProductSelectOptionsView products={products} onClickAddBtn={onClickAddBtn} />
        <StockView products={products} />
      </div>
    </div>
  );
};

export default App;
