import { AppContainer, CartItemView } from './components';
import products from './products.json';
import { scheduleRandomInterval } from './utils/scheduleRandomInterval';
import { SEC } from './constants';
import { luckySaleTime, suggestSaleTime } from './utils/saleTimers';
import { calculateCartItems } from './utils/calculateCartItems';
import { render, updateSelections } from './render';
import { createCartState } from './state/createCartState';

function main() {
  const cartState = createCartState();

  render(AppContainer);
  updateSelections();
  calculateCartItems(cartState);

  // 이벤트 핸들러 등록
  const addBtn = document.getElementById('add-to-cart');
  const itemContainer = document.getElementById('cart-items');
  addBtn.addEventListener('click', () => handleClickAddBtn(cartState));
  itemContainer.addEventListener('click', (event) => handleClickCartEvent(event, cartState));

  // 세일 타이머 등록
  scheduleRandomInterval(luckySaleTime, 30 * SEC, 10 * SEC);
  scheduleRandomInterval(() => suggestSaleTime(cartState), 60 * SEC, 20 * SEC);
}

main();

// 추가 버튼 클릭 이벤트 핸들러
function handleClickAddBtn(cartState) {
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
    calculateCartItems(cartState);
    cartState.setLastSel(selectedItemId);
  }
}

// TODO: 상품과 아이템 구분, 수량변경/삭제 이벤트 구분
// 장바구니 아이템 이벤트 핸들러 => // TODO: 다른 이벤트 핸들러와 구분되도록 변수명 변경
function handleClickCartEvent(event, cartState) {
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

  calculateCartItems(cartState);
}
