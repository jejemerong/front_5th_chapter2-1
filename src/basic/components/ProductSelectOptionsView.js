const ProductSelectOptionsView = (products) =>
  products
    .map(
      (item) =>
        `<option value="${item.id}" ${item.stock === 0 ? 'disabled' : ''}>${item.name} - ${item.price}원</option>`
    )
    .join('');

export default ProductSelectOptionsView;
