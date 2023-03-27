export const formatDefaultPrice = (price) => {
  //check if price is null

  if (!price && price !== 0) {
    return "INVALID PRICE";
  }

  //format price to USD currency with 2 decimal places if cents are present
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  // Convert the price to a string with 2 decimal places
  const formattedPrice = formatter.format(price);

  // If the price has no cents, return it without the decimal point
  if (formattedPrice.endsWith(".00")) {
    return formattedPrice.slice(0, -3);
  } else {
    return formattedPrice;
  }
};
