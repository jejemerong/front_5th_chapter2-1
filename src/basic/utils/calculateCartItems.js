import PointsView from '../components/PointsView';
import { PRODUCT_DISCOUNT_RATE } from '../constants';
import products from '../products.json';
import { updateStock } from '../render';

export function calculateCartItems(cartState) {
  let totalAmount = 0;
  let itemCount = 0;
  let subTot = 0;

  const itemContainer = document.getElementById('cart-items');

  // 장바구니 아이템 배열화
  const cartItems = Array.from(itemContainer.children);

  cartItems.forEach((cartItem) => {
    const currentItem = products.find((productItem) => productItem.id === cartItem.id);
    const selectedCount = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemTot = currentItem.price * selectedCount;
    const productDiscount = selectedCount >= 10 ? PRODUCT_DISCOUNT_RATE[currentItem.id] : 0;
    itemCount += selectedCount;
    subTot += itemTot;
    totalAmount += itemTot * (1 - productDiscount);
  });

  let discRate = 0;

  if (itemCount >= 30) {
    let bulkDisc = totalAmount * 0.25;
    let itemDisc = subTot - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  cartState.setTotalAmt(totalAmount);
  const sum = document.getElementById('cart-total');
  sum.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStock();
  renderPoints(cartState);
}

function renderPoints(cartState) {
  const points = Math.floor(cartState.getTotalAmt() / 1000);
  const sum = document.getElementById('cart-total');
  let pointContainer = document.getElementById('loyalty-points');

  if (!pointContainer) {
    sum.insertAdjacentHTML('beforeend', PointsView(points));
  } else {
    pointContainer.textContent = `(포인트: ${points})`;
  }
}
