import CartManager from "lib/cart-manager";

export const init = () => {
  if (!window.klaviyo) {
    window._klOnsite = window._klOnsite || [];
    try {
      window.klaviyo = new Proxy(
        {},
        {
          get: function (n, i) {
            return "push" === i
              ? function () {
                  var n;
                  (n = window._klOnsite).push.apply(n, arguments);
                }
              : function () {
                  for (
                    var n = arguments.length, o = new Array(n), w = 0;
                    w < n;
                    w++
                  )
                    o[w] = arguments[w];
                  var t =
                      "function" == typeof o[o.length - 1] ? o.pop() : void 0,
                    e = new Promise(function (n) {
                      window._klOnsite.push(
                        [i].concat(o, [
                          function (i) {
                            t && t(i), n(i);
                          },
                        ])
                      );
                    });
                  return e;
                };
          },
        }
      );
    } catch (n) {
      (window.klaviyo = window.klaviyo || []),
        (window.klaviyo.push = function () {
          var n;
          (n = window._klOnsite).push.apply(n, arguments);
        });
    }
  }
};

export const identify = ({ email, firstName, lastName }) => {
  if (window.klaviyo) {
    try {
      window.klaviyo.identify({
        $email: email,
        $first_name: firstName,
        // $last_name: lastName,
      });
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackAddToCart = ({
  itemName,
  itemQuantity,
  itemPrice,
  items,
  email,
}) => {
  if (window.klaviyo) {
    try {
      const ItemNames = items.map((item) => item.name);
      const Items = items.map((item) => {
        return {
          ProductName: item.name,
          Quantity: item.quantity,
          ItemPrice: item.price,
        };
      });
      const { total } = CartManager.calcTotal({
        items,
      });

      //TODO: add to checkout url link
      window.klaviyo.track("Add to Cart", {
        AddedItemProductName: itemName,
        AddedItemQuantity: itemQuantity,
        AddedItemPrice: itemPrice,
        ItemNames,
        Items,
        $value: total,
        $email: email,
      });
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackStartedCheckout = ({
  total,
  items,
  email,
  discountCode,
  discountValue,
  checkout_url,
  order_id,
}) => {
  if (window.klaviyo) {
    const ItemNames = items.map((item) => item.name);
    const Items = items.map((item) => {
      return {
        ProductName: item.name,
        Quantity: item.quantity,
        ItemPrice: item.price / 100, // db items are in cents at this point, klaviyo expects dollars
      };
    });
    try {
      window.klaviyo.track("Started Checkout", {
        $value: total,
        $email: email,
        Items,
        ItemNames,
        OrderId: order_id,
        CheckoutURL: checkout_url,
        DiscountCode: discountCode,
        DiscountValue: discountValue,
      });
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackPurchase = ({
  total,
  items,
  email,
  order_id,
  discountCode,
  discountValue,
}) => {
  if (window.klaviyo) {
    const ItemNames = items.map((item) => item.name);
    const Items = items.map((item) => {
      return {
        ProductName: item.name,
        Quantity: item.quantity,
        ItemPrice: item.price / 100, // db items are in cents at this point, klaviyo expects dollars
      };
    });

    try {
      window.klaviyo.track("Placed Order", {
        $value: total,
        $email: email,
        Items,
        ItemNames,
        OrderId: order_id,
        DiscountCode: discountCode,
        DiscountValue: discountValue,
      });
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackCreatedAccount = ({ name, email }) => {
  if (window.klaviyo) {
    try {
      window.klaviyo
        .identify({
          $email: email,
          $first_name: name,
        })
        .then(() => {
          window.klaviyo.track("New Account");
        });
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackLogin = ({ email }) => {
  if (window.klaviyo) {
    try {
      window.klaviyo.track("Login");
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const trackForgotPassword = ({ email }) => {
  if (window.klaviyo) {
    try {
      window.klaviyo.track("Forgot Password");
    } catch (e) {
      console.log("error", e);
    }
  }
};

export const track = (eventName, properties) => {
  if (window.klaviyo) {
    try {
      window.klaviyo.track(eventName, properties);
    } catch (e) {
      console.log("error", e);
    }
  }
};
