export default class OrderModel {
  constructor(data) {
    this.id = data?.id;
    this.email = data?.attributes?.email;
    this.clientSecret = data?.attributes?.client_secret;
    this.coupon = data?.attributes?.coupon;
    this.items = data?.attributes?.items.map((item) => {
      return {
        price: item.price_data.unit_amount,
        name: item.price_data.product_data.name,
        quantity: item.quantity,
      };
    });
    this.updatedAt = data?.attributes?.updatedAt;
    this.createdAt = data?.attributes?.createdAt;
    this.total = data?.attributes?.total;
    this.subtotal = data?.attributes?.subtotal;
    this.processingFee = data?.attributes?.processing_fee;
    this.creditsApplied = data?.attributes?.credits_applied;
  }
}
