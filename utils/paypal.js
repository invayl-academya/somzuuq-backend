import Order from "../models/orderModel.js";
import "dotenv/config";

export const getPaypalAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
  ).toString("base64");

  const paypalUrl = `${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`;

  const headers = {
    Accept: "application/json",
    "Accept-Language": "en_US",
    Authorization: `Basic ${auth}`,
  };

  const body = "grant_type=client_credentials";

  const response = await fetch(paypalUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("paypal access token failed ", text);
    throw new Error("Failed to get Access");
  }

  const data = await response.json();
  return data.access_token;
};

export async function checkNewTransaction(orderModel, paypalTransactionId) {
  try {
    const orders = await Order.find({
      "paymentResult.id": paypalTransactionId,
    });

    return orders.length === 0;
  } catch (error) {
    resizeBy.status(500).json({
      success: false,
      message: "invalid transaction ID",
    });
  }
}

export async function verifyPayment(transactionId) {
  const accessToken = await getPaypalAccessToken();

  const paypalRes = await fetch(
    `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders/${transactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!paypalRes.ok) throw new Error("failed to verify Payment");

  const data = await paypalRes.json();
  return {
    verified: data.status === "COMPLETED",
    value: data.purchase_units[0].amount.value,
  };
}
