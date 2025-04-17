import AppContainer from './components/AppContainer';
import products from './products.json';
import { scheduleRandomInterval } from './utils';
import {
  LUCKY_DISCOUNT_RATE,
  PRODUCT_DISCOUNT_RATE,
  SUGGEST_DISCOUNT_RATE,
  SEC,
} from './constants';
import CartItemView from './components/CartItemView';
import ProductSelectOptionsView from './components/ProductSelectOptionsView';
import StockView from './components/StockView';
import PointsView from './components/PointsView';

function createAppState() {
  let lastSel = 0;
  let totalAmt = 0;

  return {
    getLastSel: () => lastSel,
    setLastSel: (val) => (lastSel = val),
    getTotalAmt: () => totalAmt,
    setTotalAmt: (val) => (totalAmt = val),
  };
}

// DOM 요소 추가
function render(content) {
  document.getElementById('app').innerHTML = content();
}

function main() {
  const appState = createAppState();

  render(AppContainer);
  updateSelections();
  calculateCartItems(appState);

  // 이벤트 핸들러 등록
  const addBtn = document.getElementById('add-to-cart');
  const itemContainer = document.getElementById('cart-items');
  addBtn.addEventListener('click', () => handleClickAddBtn(appState));
  itemContainer.addEventListener('click', (event) => handleClickCartEvent(event, appState));

  // 세일 타이머 등록
  scheduleRandomInterval(luckySaleTime, 30 * SEC, 10 * SEC);
  scheduleRandomInterval(suggestSaleTime, 60 * SEC, 20 * SEC);

  /**
   * TODO: 함수 내에서 공통적으로 실행되는 것들, 지금 이걸 수정할 때가 아니라 render 부터 잡아야 됨.
   * 1. 세일 아이템
   * 2. 조건 판단
   * 3. alert
   * 4. 세일 가격 계산
   * 5. updateSelections
   */

  function luckySaleTime() {
    let luckyItem = products[Math.floor(Math.random() * products.length)];

    if (Math.random() < 0.3 && luckyItem.stock > 0) {
      alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      luckyItem.price = Math.round(luckyItem.price * (1 - LUCKY_DISCOUNT_RATE));
      updateSelections();
    }
  }

  function suggestSaleTime() {
    const lastSel = appState.getLastSel();
    if (lastSel) {
      let suggestItem = products.find((item) => item.id !== lastSel && item.stock > 0);

      if (suggestItem) {
        alert(suggestItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
        suggestItem.price = Math.round(suggestItem.price * (1 - SUGGEST_DISCOUNT_RATE));
        updateSelections();
      }
    }
  }
}

// 아이템 선택
function updateSelections() {
  const selection = document.getElementById('product-select');
  selection.innerHTML = ProductSelectOptionsView(products);
}

// 장바구니 가격 계산
function calculateCartItems(appState) {
  console.log('appState.getTotalAmt', appState.getTotalAmt());
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

  appState.setTotalAmt(totalAmount);
  const sum = document.getElementById('cart-total');
  sum.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStock();
  renderPoints(appState);
}

// 포인트 view
const renderPoints = (appState) => {
  const points = Math.floor(appState.getTotalAmt() / 1000);
  const sum = document.getElementById('cart-total');
  let pointContainer = document.getElementById('loyalty-points');

  if (!pointContainer) {
    sum.insertAdjacentHTML('beforeend', PointsView(points));
  } else {
    pointContainer.textContent = `(포인트: ${points})`;
  }
};

// 재고 view
const updateStock = () => {
  const stockContainer = document.getElementById('stock-status');
  stockContainer.textContent = StockView(products);
};

main();

// 추가 버튼 클릭 이벤트 핸들러
function handleClickAddBtn(appState) {
  const selection = document.getElementById('product-select');
  const itemContainer = document.getElementById('cart-items');

  let selectedItemId = selection.value;
  let selectedItem = products.find((product) => product.id === selectedItemId);

  if (selectedItem && selectedItem.stock > 0) {
    let selectedItemElement = document.getElementById(selectedItem.id);

    if (selectedItemElement) {
      const currentQuantity =
        parseInt(selectedItemElement.querySelector('span').textContent.split('x ')[1]) + 1;

      if (currentQuantity <= selectedItem.stock) {
        console.log('currentQuantity', currentQuantity, selectedItem.stock);
        selectedItemElement.querySelector('span').textContent =
          selectedItem.name + ' - ' + selectedItem.price + '원 x ' + currentQuantity;
        selectedItem.stock--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      let newItem = CartItemView(selectedItem);
      itemContainer.insertAdjacentHTML('beforeend', newItem);
      selectedItem.stock--;
    }
    calculateCartItems(appState);
    appState.setLastSel(selectedItemId);
  }
}

// TODO: 상품과 아이템 구분, 수량변경/삭제 이벤트 구분
// 장바구니 아이템 이벤트 핸들러 => // TODO: 다른 이벤트 핸들러와 구분되도록 변수명 변경
function handleClickCartEvent(event, appState) {
  // 장바구니 이벤트 확인
  const target = event.target;
  const isQuantityChanged = target.classList.contains('quantity-change');
  const isItemRemoved = target.classList.contains('remove-item');
  if (!isQuantityChanged && !isItemRemoved) return;

  // 현재 선택된 상품 정보
  const productId = target.dataset.productId;
  const productElement = document.getElementById(productId);
  const targetProduct = products.find((product) => product.id === productId);

  // 상품 정보 정제 // TODO: 함수로 빼기
  const splitProduct = productElement.querySelector('span').textContent.split('x '); // [ '상품1 - 10000원 ', '1' ]
  const formattedProduct = splitProduct[0];
  const prevQuantity = parseInt(splitProduct[1]);

  // 수량 변경
  if (isQuantityChanged) {
    const change = parseInt(target.dataset.change);
    const currentQuantity = prevQuantity + change;

    if (currentQuantity > 0 && currentQuantity <= targetProduct.stock + prevQuantity) {
      productElement.querySelector('span').textContent = formattedProduct + 'x ' + currentQuantity;
      targetProduct.stock -= change;
    } else if (currentQuantity <= 0) {
      productElement.remove();
      targetProduct.stock -= change;
    } else {
      alert('재고가 부족합니다.');
    }
  }

  // 아이템 삭제
  if (isItemRemoved) {
    targetProduct.stock += prevQuantity;
    productElement.remove();
  }

  calculateCartItems(appState);
}
