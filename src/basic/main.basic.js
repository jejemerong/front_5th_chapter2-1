// TODO: 전역 변수 지양하기
import productList from './data.json';

let selection, addBtn, itemContainer, sum, stock;
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
  stock = document.createElement('div');

  itemContainer.id = 'cart-items';
  sum.id = 'cart-total';
  selection.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stock.id = 'stock-status';

  appContainer.className = 'bg-gray-100 p-8';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  cartTitle.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  selection.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stock.className = 'text-sm text-gray-500 mt-2';

  cartTitle.textContent = '장바구니';
  addBtn.textContent = '추가';

  updateSelections();

  wrapper.appendChild(cartTitle);
  wrapper.appendChild(itemContainer);
  wrapper.appendChild(sum);
  wrapper.appendChild(selection);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(stock);
  appContainer.appendChild(wrapper);
  app.appendChild(appContainer);

  calculateCartItems();
}

// 렌더 호출, 이벤트 바인딩, 호출 스케줄링
function main() {
  render();
  addBtn.addEventListener('click', handleClickAddBtn);
  itemContainer.addEventListener('click', handleClickCartEvent);

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.stockQuantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelections();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = productList.find(function (item) {
          return item.id !== lastSel && item.stockQuantity > 0; // 선택하지 않았지만 재고가 남아있는 물품
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelections();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 아이템 선택
function updateSelections() {
  selection.innerHTML = '';
  productList.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.stockQuantity === 0) opt.disabled = true;
    selection.appendChild(opt);
  });
}

// 장바구니 가격 계산
function calculateCartItems() {
  totalAmt = 0;
  let itemCount = 0;
  let cartItems = itemContainer.children;
  let subTot = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      let selectedCount = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      let itemTot = curItem.price * selectedCount;
      let disc = 0;
      itemCount += selectedCount;
      subTot += itemTot;
      if (selectedCount >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }

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
  productList.forEach(function (item) {
    if (item.stockQuantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stockQuantity > 0 ? '재고 부족 (' + item.stockQuantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  stock.textContent = infoMsg;
};

main();

// 추가 버튼 클릭 이벤트 핸들러
function handleClickAddBtn() {
  let selItem = selection.value;
  let itemToAdd = productList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.stockQuantity > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.stockQuantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.stockQuantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // TODO: newItem 변수명 변경하기
      let newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      itemContainer.appendChild(newItem);
      itemToAdd.stockQuantity--;
    }
    calculateCartItems();
    lastSel = selItem;
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
  const targetProduct = productList.find((product) => product.id === productId);

  // 상품 정보 정제
  const splitProduct = productElement.querySelector('span').textContent.split('x '); // [ '상품1 - 10000원 ', '1' ]
  const formattedProduct = splitProduct[0];
  const prevQuantity = parseInt(splitProduct[1]);

  // 수량 변경
  if (isQuantityChanged) {
    const change = parseInt(target.dataset.change);
    const currentQuantity = prevQuantity + change;

    if (currentQuantity > 0 && currentQuantity <= targetProduct.stockQuantity + prevQuantity) {
      productElement.querySelector('span').textContent = formattedProduct + 'x ' + currentQuantity;
      targetProduct.stockQuantity -= change;
    } else if (currentQuantity <= 0) {
      productElement.remove();
      targetProduct.stockQuantity -= change;
    } else {
      alert('재고가 부족합니다.');
    }
  }

  // 아이템 삭제
  if (isItemRemoved) {
    targetProduct.stockQuantity += prevQuantity;
    productElement.remove();
  }

  calculateCartItems();
}
