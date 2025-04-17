const StockView = (products) =>
  products
    .filter((item) => item.stock < 5)
    .map((item) => {
      return `${item.name}: ${item.stock > 0 ? `재고 부족 (${item.stock}개 남음)` : '품절'}`;
    })
    .join('\n');

export default StockView;
