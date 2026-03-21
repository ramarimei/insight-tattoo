import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { productName, price, productId } = await request.json();

  if (!productName || !price) {
    return NextResponse.json(
      { error: "Product name and price are required" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "afterpay_clearpay"],
    line_items: [
      {
        price_data: {
          currency: "nzd",
          product_data: {
            name: productName,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${request.nextUrl.origin}/shop?success=true`,
    cancel_url: `${request.nextUrl.origin}/shop?cancelled=true`,
    metadata: {
      productId: productId || "",
    },
  });

  return NextResponse.json({ url: session.url });
}
