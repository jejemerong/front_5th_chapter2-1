import React from 'react';
import { CartItemType, Product } from '../types';
import CartItem from './CartItemView';

interface CartProps {
  cart: CartItemType[];
  products: Product[];
  setCart: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CartContainer: React.FC<CartProps> = ({ cart, products, setCart, setProducts }) => {
  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      return prev.flatMap((item) => {
        if (item.id !== id) return [item];
        const product = products.find((product) => product.id === id);
        if (!product) return [item];
        const currentQuantity = item.stock + change;
        if (currentQuantity <= 0) return [];
        if (currentQuantity > product.stock + item.stock) {
          alert('재고가 부족합니다.');
          return [item];
        }
        setProducts((products) =>
          products.map((product) =>
            product.id === id ? { ...product, stock: product.stock - change } : product
          )
        );
        return [{ ...item, stock: currentQuantity }];
      });
    });
  };

  const removeItem = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      setProducts((products) =>
        products.map((product) =>
          product.id === id ? { ...product, stock: product.stock + item.stock } : product
        )
      );
      setCart((cartItem) => cartItem.filter((item) => item.id !== id));
    }
  };

  return (
    <div id='cart-items'>
      {cart.map(({ id, stock }) => {
        const product = products.find((product) => product.id === id);
        if (!product) return null;
        return (
          <CartItem
            key={id}
            product={product}
            stock={stock}
            onChange={(change) => updateQuantity(id, change)}
            onRemove={() => removeItem(id)}
          />
        );
      })}
    </div>
  );
};

export default CartContainer;
