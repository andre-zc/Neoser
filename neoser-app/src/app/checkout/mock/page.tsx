import { notFound } from "next/navigation";
import { isMockMode } from "@/lib/payments/izipay";
import CheckoutMockClient from "./checkout-mock-client";

export default function CheckoutMockPage() {
  if (!isMockMode()) {
    notFound();
  }
  return <CheckoutMockClient />;
}
