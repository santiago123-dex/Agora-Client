import { bffFetch } from "./bff-client";

export type StripePrice = {
  id: string;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: string;
  };
};

export type StripeProduct = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  active: boolean;
  defaultPrice: string;
  defaultPriceObject: StripePrice | null;
  type: string;
  metadata: Record<string, string>;
};

export function getProducts() {
  return bffFetch<StripeProduct[]>("/api/payment/products");
}

export function getPaymentLink(productId: string) {
  return bffFetch<{ url: string }>(`/api/payment/pay-product/${productId}`);
}

export function createCheckoutSession(
  productId: string,
  successUrl: string,
  cancelUrl: string,
) {
  return bffFetch<{ url: string }>("/api/payment/checkout", {
    method: "POST",
    body: JSON.stringify({ productId, successUrl, cancelUrl }),
  });
}
