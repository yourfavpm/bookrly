import Stripe from "npm:stripe@22.0.1";
const stripe = new Stripe("sk_test_123", { apiVersion: "2025-04-30.basil" as any });
console.log("Success");
