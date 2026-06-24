import Stripe from "stripe";
try {
  const stripe = new Stripe("sk_test_123", { apiVersion: "2025-04-30.basil" });
  console.log("Success");
} catch (err) {
  console.log("Error:", err.message);
}
