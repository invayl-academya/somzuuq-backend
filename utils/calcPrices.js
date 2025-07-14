export function addDecimals(num) {
  return Number((Math.round(num * 100) / 100).toFixed(2));
}

export function calcPrices(orderItems) {
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const taxPrice = addDecimals(itemsPrice * 0.15);
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
