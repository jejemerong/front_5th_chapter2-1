import { PointsView, ProductSelectOptionsView, StockView } from './components';
import products from './products.json';

// DOM 요소 추가
export const render = (content) => {
  document.getElementById('app').innerHTML = content();
};

// TODO: render 와 같은 패턴
// 아이템 추가
export const updateSelections = () => {
  const selection = document.getElementById('product-select');
  selection.innerHTML = ProductSelectOptionsView(products);
};

// 재고 view
export const updateStock = () => {
  const stockContainer = document.getElementById('stock-status');
  stockContainer.textContent = StockView(products);
};

// 포인트 view
export const renderPoints = (cartState) => {
  const points = Math.floor(cartState.getTotalAmt() / 1000);
  const sum = document.getElementById('cart-total');
  let pointContainer = document.getElementById('loyalty-points');

  if (!pointContainer) {
    sum.insertAdjacentHTML('beforeend', PointsView(points));
  } else {
    pointContainer.textContent = `(포인트: ${points})`;
  }
};
