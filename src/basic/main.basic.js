// TODO: 전역 변수 지양하기
import { LUCKY_DISCOUNT_RATE, PRODUCT_DISCOUNT, SEC, SUGGEST_DISCOUNT_RATE } from './constants';
import products from './products.json';
import { scheduleRandomInterval } from './utils';

let selection, addBtn, itemContainer, sum, stockContainer;
let lastSel,
  totalAmt = 0;

// DOM 요소 추가
function render() {
  const app = document.getElementById('app');

  let appContainer = document.createElement('div');
  let wrapper = document.createElement('div');
  let cartTitle = document.createElement('h1');

  itemContainer = document.createElement('div');
  sum = document.createElement('div');
  selection = document.createElement('select');
  addBtn = document.createElement('button');
  stockContainer = document.createElement('div');

  itemContainer.id = 'cart-items';
  sum.id = 'cart-total';
  selection.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockContainer.id = 'stock-status';

  appContainer.className = 'bg-gray-100 p-8';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  cartTitle.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  selection.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockContainer.className = 'text-sm text-gray-500 mt-2';

  cartTitle.textContent = '장바구니';
  addBtn.textContent = '추가';

  updateSelections();

  wrapper.appendChild(cartTitle);
  wrapper.appendChild(itemContainer);
  wrapper.appendChild(sum);
  wrapper.appendChild(selection);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(stockContainer);
  appContainer.appendChild(wrapper);
  app.appendChild(appContainer);

  calculateCartItems();
}

function main() {
  render();

  // 이벤트 핸들러 등록
  addBtn.addEventListener('click', handleClickAddBtn);
  itemContainer.addEventListener('click', handleClickCartEvent);

  // 세일 타이머 등록
  scheduleRandomInterval(luckySaleTime, 30 * SEC, 10 * SEC);
  scheduleRandomInterval(suggestSaleTime, 60 * SEC, 20 * SEC);

  /**
   * TODO: 함수 내에서 공통적으로 실행되는 것들
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
  selection.innerHTML = '';
  products.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.stock === 0) opt.disabled = true;
    selection.appendChild(opt);
  });
}

// 장바구니 가격 계산
function calculateCartItems() {
  totalAmt = 0;
  let itemCount = 0;
  let subTot = 0;

  // 장바구니 아이템 배열화
  const cartItems = Array.from(itemContainer.children);

  //
  cartItems.forEach((cartItem) => {
    const currentItem = products.find((productItem) => productItem.id === cartItem.id);
    const selectedCount = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemTot = currentItem.price * selectedCount;
    const productDiscount = selectedCount >= 10 ? PRODUCT_DISCOUNT[currentItem.id] : 0;
    itemCount += selectedCount;
    subTot += itemTot;
    totalAmt += itemTot * (1 - productDiscount);
  });

  let discRate = 0;

  if (itemCount >= 30) {
    let bulkDisc = totalAmt * 0.25;
    let itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }

  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStock();
  renderPoints();
}

// 포인트 view
const renderPoints = () => {
  let points = Math.floor(totalAmt / 1000);
  let pointContainer = document.getElementById('loyalty-points');

  if (!pointContainer) {
    pointContainer = document.createElement('span');
    pointContainer.id = 'loyalty-points';
    pointContainer.className = 'text-blue-500 ml-2';
    sum.appendChild(pointContainer);
  }
  pointContainer.textContent = '(포인트: ' + points + ')';
};

// 재고 view
const updateStock = () => {
  let infoMsg = '';
  products.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockContainer.textContent = infoMsg;
};

main();

// 추가 버튼 클릭 이벤트 핸들러
function handleClickAddBtn() {
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
      let newItem = document.createElement('div');
      newItem.id = selectedItem.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        selectedItem.name +
        ' - ' +
        selectedItem.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedItem.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedItem.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        selectedItem.id +
        '">삭제</button></div>';
      itemContainer.appendChild(newItem);
      selectedItem.stock--;
    }
    calculateCartItems();
    lastSel = selectedItemId;
  }
}

// TODO: 상품과 아이템 구분, 수량변경/삭제 이벤트 구분
// 장바구니 아이템 이벤트 핸들러 => // TODO: 다른 이벤트 핸들러와 구분되도록 변수명 변경
function handleClickCartEvent(event) {
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

  calculateCartItems();
}
