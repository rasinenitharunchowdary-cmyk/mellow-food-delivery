import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTotals,
  couponError,
  itemKey,
  orderStatus,
  sanitizeCart,
  validateCheckout,
} from "./commerce.js";

const item = {
  key: "pizza-regular",
  id: "pizza",
  name: "Pizza",
  restaurantId: "little-naples",
  restaurantName: "Little Naples",
  image: "pizza",
  unitPrice: 299,
  quantity: 1,
  size: "Regular",
  extras: [],
  note: "",
};
const details = {
  name: "Demo Customer",
  phone: "98765 43210",
  address: "Flat 12, Demo Building, Sample Road",
  pincode: "560038",
  instructions: "door",
};

test("empty cart has no fees or taxes", () =>
  assert.deepEqual(calculateTotals([]), {
    subtotal: 0,
    delivery: 0,
    platform: 0,
    discount: 0,
    tax: 0,
    total: 0,
    coupon: "",
  }));
test("quantities, delivery, platform fee and 5% food tax total correctly", () =>
  assert.deepEqual(calculateTotals([{ ...item, quantity: 2 }]), {
    subtotal: 598,
    delivery: 35,
    platform: 5,
    discount: 0,
    tax: 30,
    total: 668,
    coupon: "",
  }));
test("percent coupon rounds discount and calculates tax after discount", () =>
  assert.deepEqual(calculateTotals([item], "MELLOW20"), {
    subtotal: 299,
    delivery: 35,
    platform: 5,
    discount: 60,
    tax: 12,
    total: 291,
    coupon: "MELLOW20",
  }));
test("20% coupon is capped at ₹150", () =>
  assert.equal(
    calculateTotals([{ ...item, unitPrice: 1000 }], "MELLOW20").discount,
    150,
  ));
test("coupon requires minimum food subtotal", () => {
  assert.match(couponError("MELLOW20", 298), /₹1/);
  assert.equal(
    calculateTotals([{ ...item, unitPrice: 298 }], "MELLOW20").discount,
    0,
  );
});
test("coupon minimum is inclusive", () =>
  assert.equal(couponError("MELLOW20", 299), ""));
test("coupon accepts surrounding spaces and lowercase", () =>
  assert.equal(calculateTotals([item], " mellow20 ").coupon, "MELLOW20"));
test("unknown coupons do not alter totals", () => {
  assert.match(couponError("NOTREAL", 999), /isn’t on the menu/);
  assert.equal(calculateTotals([item], "NOTREAL").total, 354);
});
test("free delivery waives only delivery fee", () => {
  const total = calculateTotals([{ ...item, unitPrice: 399 }], "FREEDEL");
  assert.equal(total.delivery, 0);
  assert.equal(total.platform, 5);
  assert.equal(total.tax, 20);
  assert.equal(total.total, 424);
});
test("first-order coupon requires a ₹499 subtotal and no prior orders", () => {
  assert.equal(couponError("HELLO100", 499, 0), "");
  assert.match(couponError("HELLO100", 499, 1), /first order/);
  assert.equal(
    calculateTotals([{ ...item, unitPrice: 499 }], "HELLO100", 0).discount,
    100,
  );
  assert.equal(
    calculateTotals([{ ...item, unitPrice: 499 }], "HELLO100", 1).discount,
    0,
  );
});
test("identical extras in different order share a cart key", () =>
  assert.equal(
    itemKey(
      item,
      { name: "Large" },
      [{ name: "Cheese" }, { name: "Vegetables" }],
      " less salt ",
    ),
    itemKey(
      item,
      { name: "Large" },
      [{ name: "Vegetables" }, { name: "Cheese" }],
      "less salt",
    ),
  ));
test("different sizes, notes and extras create independent cart lines", () => {
  const keys = [
    itemKey(item, { name: "Regular" }, [], ""),
    itemKey(item, { name: "Large" }, [], ""),
    itemKey(item, { name: "Regular" }, [], "less salt"),
    itemKey(item, { name: "Regular" }, [{ name: "Cheese" }], ""),
  ];
  assert.equal(new Set(keys).size, 4);
});
test("valid Indian checkout details pass", () =>
  assert.deepEqual(validateCheckout(details), {}));
test("blank checkout reports name, phone, address and pincode errors", () =>
  assert.deepEqual(Object.keys(validateCheckout({ instructions: "door" })), [
    "name",
    "phone",
    "address",
    "pincode",
  ]));
test("checkout rejects non-Bengaluru pincodes and invalid mobile numbers", () => {
  const errors = validateCheckout({
    ...details,
    phone: "1234567890",
    pincode: "500001",
  });
  assert.ok(errors.phone);
  assert.ok(errors.pincode);
});
test("checkout trims name and address and validates preference", () => {
  assert.ok(
    validateCheckout({
      ...details,
      name: "  ",
      address: "     ",
      instructions: "invalid",
    }).instructions,
  );
  assert.ok(validateCheckout({ ...details, name: "A" }).name);
});
test("tracking progresses across all four timed states and persists preview offset", () => {
  const order = { placedAt: 100000 };
  assert.equal(orderStatus(order, 100000), 0);
  assert.equal(orderStatus(order, 145000), 1);
  assert.equal(orderStatus(order, 220000), 2);
  assert.equal(orderStatus(order, 340000), 3);
  assert.equal(orderStatus({ ...order, demoOffset: 240 }, 100000), 3);
});
test("tracking handles future timestamps as confirmed", () =>
  assert.equal(orderStatus({ placedAt: 999999 }, 0), 0));
test("cart persistence rejects invalid prices, quantities and shape", () => {
  assert.deepEqual(sanitizeCart(null), []);
  assert.deepEqual(
    sanitizeCart([
      null,
      {},
      { ...item, unitPrice: -1 },
      { ...item, quantity: 21 },
      { ...item, quantity: 1.5 },
      { ...item, unitPrice: Infinity },
    ]),
    [],
  );
  assert.equal(sanitizeCart([item]).length, 1);
});
test("cart persistence repairs optional values without crashing", () => {
  const [repaired] = sanitizeCart([
    { ...item, extras: null, note: 2, size: null },
  ]);
  assert.deepEqual(repaired.extras, []);
  assert.equal(repaired.note, "");
  assert.equal(repaired.size, "Regular");
});
