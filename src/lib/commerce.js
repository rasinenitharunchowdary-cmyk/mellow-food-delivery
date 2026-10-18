export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const COUPONS = [
  {
    code: "MELLOW20",
    title: "A little treat, on us.",
    description: "20% off your food total, up to ₹150.",
    minimum: 299,
    detail: "On orders of ₹299 or more",
    color: "peach",
    kind: "percent",
    value: 20,
    max: 150,
  },
  {
    code: "FREEDEL",
    title: "Good food. Zero delivery fee.",
    description: "Let us take care of the delivery.",
    minimum: 399,
    detail: "On orders of ₹399 or more",
    color: "mint",
    kind: "delivery",
  },
  {
    code: "HELLO100",
    title: "Your first bite is special.",
    description: "₹100 off your first Mellow order.",
    minimum: 499,
    detail: "First order · minimum ₹499",
    color: "lavender",
    kind: "flat",
    value: 100,
    first: true,
  },
];

export function couponError(code, subtotal, orderCount = 0) {
  const coupon = COUPONS.find((c) => c.code === code?.trim().toUpperCase());
  if (!coupon) return "That code isn’t on the menu. Try MELLOW20 or FREEDEL.";
  if (coupon.first && orderCount > 0)
    return "HELLO100 is for your first order. Try MELLOW20 instead.";
  if (subtotal < coupon.minimum)
    return `Add ${money(coupon.minimum - subtotal)} more to use ${coupon.code}.`;
  return "";
}

export function calculateTotals(items, code = "", orderCount = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const eligible =
    subtotal > 0 && code && !couponError(code, subtotal, orderCount);
  const coupon = eligible
    ? COUPONS.find((c) => c.code === code.trim().toUpperCase())
    : null;
  const delivery = subtotal ? (coupon?.kind === "delivery" ? 0 : 35) : 0;
  const platform = subtotal ? 5 : 0;
  const discount =
    coupon?.kind === "percent"
      ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.max)
      : coupon?.kind === "flat"
        ? coupon.value
        : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  return {
    subtotal,
    delivery,
    platform,
    discount,
    tax,
    total: subtotal + delivery + platform + tax - discount,
    coupon: coupon?.code || "",
  };
}

export function itemKey(item, size, extras, note) {
  return JSON.stringify([
    item.id,
    size.name,
    [...extras].map((e) => e.name).sort(),
    note.trim(),
  ]);
}

export const MAX_QUANTITY = 20;
export function validateCheckout(values) {
  const errors = {};
  if (!values.name?.trim() || values.name.trim().length < 2)
    errors.name = "Please enter your full name (at least 2 characters).";
  if (!/^[6-9]\d{9}$/.test(values.phone?.replace(/[\s-]/g, "") || ""))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!values.address?.trim() || values.address.trim().length < 8)
    errors.address =
      "Add your flat, building and street (at least 8 characters).";
  if (!/^560\d{3}$/.test(values.pincode || ""))
    errors.pincode =
      "This demo delivers to Bengaluru pincodes beginning with 560.";
  if (!["door", "reception"].includes(values.instructions))
    errors.instructions = "Choose a delivery preference.";
  return errors;
}

export const STATUS_STEPS = [
  {
    title: "Order confirmed",
    description: "Your delicious plans are officially in motion.",
    seconds: 0,
  },
  {
    title: "A little kitchen magic",
    description: "The kitchen is making your food fresh, with love.",
    seconds: 45,
  },
  {
    title: "On the way to you",
    description: "Your food is on its way. Set the table!",
    seconds: 120,
  },
  {
    title: "Happiness delivered",
    description: "Time to dig in. Thanks for choosing Mellow.",
    seconds: 240,
  },
];
export function orderStatus(order, now = Date.now()) {
  const elapsed =
    Math.max(0, (now - order.placedAt) / 1000) + (order.demoOffset || 0);
  return STATUS_STEPS.reduce(
    (status, step, index) => (elapsed >= step.seconds ? index : status),
    0,
  );
}

export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item) =>
        item &&
        typeof item.key === "string" &&
        typeof item.name === "string" &&
        typeof item.restaurantId === "string" &&
        typeof item.restaurantName === "string" &&
        typeof item.image === "string" &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY,
    )
    .map((item) => ({
      ...item,
      extras: Array.isArray(item.extras)
        ? item.extras.filter((e) => typeof e === "string")
        : [],
      note: typeof item.note === "string" ? item.note.slice(0, 160) : "",
      size: typeof item.size === "string" ? item.size : "Regular",
    }));
}
