import { env } from "@/env";

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 15,
      priceIds: {
        test: env.STRIPE_PRODUCT_PRICE_ID_TEST,
        production: env.STRIPE_PRODUCT_PRICE_ID_PRODUCTION,
      },
    },
  },
];
