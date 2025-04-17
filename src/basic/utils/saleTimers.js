import products from '../products.json';
import { LUCKY_DISCOUNT_RATE, SUGGEST_DISCOUNT_RATE } from '../constants';
import { updateSelections } from '../render';

export function luckySaleTime() {
  let luckyItem = products[Math.floor(Math.random() * products.length)];

  if (Math.random() < 0.3 && luckyItem.stock > 0) {
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    luckyItem.price = Math.round(luckyItem.price * (1 - LUCKY_DISCOUNT_RATE));
    updateSelections();
  }
}

export function suggestSaleTime(cartState) {
  const lastSel = cartState.getLastSel();
  if (lastSel) {
    let suggestItem = products.find((item) => item.id !== lastSel && item.stock > 0);

    if (suggestItem) {
      alert(suggestItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      suggestItem.price = Math.round(suggestItem.price * (1 - SUGGEST_DISCOUNT_RATE));
      updateSelections();
    }
  }
}
