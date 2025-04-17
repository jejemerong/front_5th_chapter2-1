import { useEffect, useState } from 'react';
import { Product, CartItemType } from './types';
import { CartContainer, ProductSelectOptionsView, StockView, Sum } from './components';
import { scheduleRandomInterval } from './utils/scheduleRandomInterval';
import { SEC } from './constants';

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

  useEffect(() => {
    // 번개세일 타이머
    const luckySaleTime = () => {
      const available = products.filter((product) => product.stock > 0);
      if (available.length === 0) return;

      const luckyItem = available[Math.floor(Math.random() * available.length)];
      if (Math.random() < 0.3) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === luckyItem.id ?
              { ...product, price: Math.round(product.price * 0.8) }
            : product
          )
        );
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      }
    };

    // 추천 상품 타이머
    const suggestSaleTime = () => {
      const lastSelItem = cart[cart.length - 1];
      if (!lastSelItem) return;

      const suggest = products.find(
        (product) => product.id !== lastSelItem.id && product.stock > 0
      );
      if (!suggest) return;

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === suggest.id ?
            { ...product, price: Math.round(product.price * 0.95) }
          : product
        )
      );
      alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    };

    // 타이머 등록
    scheduleRandomInterval(luckySaleTime, 30 * SEC, 10 * SEC);
    scheduleRandomInterval(suggestSaleTime, 60 * SEC, 20 * SEC);
  }, [cart, products]);

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
