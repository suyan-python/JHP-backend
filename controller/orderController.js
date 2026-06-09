import Order from "../models/Order.js";
import transporter from "../config/nodemailer.js";

const parseNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normalizeSelectedSize = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const match = value.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  return 0;
};

export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body || {};
    const sanitizedItems = Array.isArray(orderData.items)
      ? orderData.items.map((item) => {
          const selectedGrind =
            item?.selectedGrind ||
            item?.grindOption ||
            item?.grind ||
            (Array.isArray(item?.grindOptions) && item.grindOptions.length
              ? item.grindOptions[0]
              : "");

          return {
            ...item,
            itemId: parseNumber(item?.itemId),
            quantity: parseNumber(item?.quantity),
            price: parseNumber(item?.price),
            selectedSize: item?.selectedSize ?? item?.size ?? null,
            selectedGrind,
            grindOption: selectedGrind || item?.grindOption || "",
            grind: selectedGrind || item?.grind || "",
            grindOptions: Array.isArray(item?.grindOptions)
              ? item.grindOptions.filter(Boolean)
              : selectedGrind
                ? [selectedGrind]
                : [],
          };
        })
      : [];

    const sanitizedOrderData = {
      ...orderData,
      items: sanitizedItems,
      total: parseNumber(orderData.total),
      discountedTotal: parseNumber(orderData.discountedTotal),
      shipping: parseNumber(orderData.shipping),
    };

    const newOrder = new Order(sanitizedOrderData);
    await newOrder.save();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      items,
      total,
      discountedTotal,
      shipping,
      deliveryTime,
    } = sanitizedOrderData;

    const finalTotal =
      Number(discountedTotal || total || 0) + Number(shipping || 0);

    const itemsHtml = items
      .map((i) => {
        const price = Number(i.price);
        const quantity = Number(i.quantity);
        const total = !isNaN(price * quantity)
          ? (price * quantity).toFixed(2)
          : "N/A";

        const grindLabel = i.selectedGrind || i.grindOption || i.grind || "";
        const sizeLabel = i.selectedSize ?? "";
        const sizeText = sizeLabel
          ? ` (${sizeLabel}${typeof sizeLabel === "number" ? "g" : ""})`
          : "";
        const grindText = grindLabel ? ` [Grind: ${grindLabel}]` : "";

        return `<li>${i.name} × ${quantity}${sizeText}${grindText} — NRs. ${total}</li>`;
      })
      .join("");

    const discountAmount =
      total && finalTotal
        ? (Number(total) - Number(finalTotal)).toFixed(2)
        : null;

    res.status(201).json({
      message: "Order placed and confirmation email sent successfully.",
    });
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({
      error: "Failed to place order.",
      details: error?.message || "Unknown error",
    });
  }
};
