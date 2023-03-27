class CartManager {
  constructor() {}

  calcTotal({
    items,
    coupon = null,
    creditTotal = 0,
    convertToDollars = false,
  }) {
    let subtotal = 0;
    let discount = 0;
    let processingFee = 0;
    let total = 0;
    let credits = 0;

    subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (coupon && coupon.amount_off) {
      if (convertToDollars) {
        discount = coupon.amount_off / 100;
      } else {
        discount = coupon.amount_off;
      }
    } else if (coupon && coupon.percent_off) {
      let amount_off = (coupon.percent_off / 100) * subtotal;

      discount = amount_off;
    }

    let discountedTotal = subtotal - discount;

    if (creditTotal > 0) {
      // If credits are greater than the discounted total, set the discounted total to 0
      if (creditTotal >= discountedTotal) {
        discountedTotal = 0;
        credits = discountedTotal;
      } else {
        const creditsInCents = creditTotal * 100;
        discountedTotal -= creditsInCents;
        credits = creditsInCents;
      }
    }

    let totalWithFee = 0;

    totalWithFee = discountedTotal * 1.03;

    const processingFeeAmount = totalWithFee - discountedTotal;
    processingFee = processingFeeAmount.toFixed(2);

    total = totalWithFee.toFixed(2);

    return {
      subtotal,
      discount,
      credits,
      processingFee,
      total,
    };
  }
}

export default new CartManager();
