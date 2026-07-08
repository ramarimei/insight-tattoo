import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

// Cache the tax rate ID so we don't create a new one every request
let cachedTaxRateId: string | null = null;

async function getGstTaxRate(): Promise<string> {
  if (cachedTaxRateId) return cachedTaxRateId;

  const stripe = getStripe();

  // Check if we already have a GST tax rate
  const existing = await stripe.taxRates.list({ limit: 10 });
  const gstRate = existing.data.find(
    (r) => r.display_name === "GST" && r.percentage === 15 && r.inclusive && r.active
  );

  if (gstRate) {
    cachedTaxRateId = gstRate.id;
    return gstRate.id;
  }

  // Create one if it doesn't exist
  const taxRate = await stripe.taxRates.create({
    display_name: "GST",
    description: "New Zealand Goods and Services Tax",
    percentage: 15,
    inclusive: true,
    country: "NZ",
  });

  cachedTaxRateId = taxRate.id;
  return taxRate.id;
}

export async function POST(request: NextRequest) {
  const { productName, price, productId } = await request.json();

  if (!productName || !price) {
    return NextResponse.json(
      { error: "Product name and price are required" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const taxRateId = await getGstTaxRate();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "nzd",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(price * 100),
          },
          tax_rates: [taxRateId],
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
