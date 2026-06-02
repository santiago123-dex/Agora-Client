import { bffFetch } from "./bff-client";

export type StripePrice = {
  id: string;
  unit_amount: number;
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
