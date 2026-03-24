import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const sb = getClient();
  const { data } = await sb.from("site_content").select("key, value");
  const content: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      content[row.key] = row.value;
    }
  }
  return content;
}

export async function getSiteAssets(): Promise<Record<string, string>> {
  const sb = getClient();
  const { data } = await sb.from("site_assets").select("key, image_url");
  const assets: Record<string, string> = {
    hero_image: "/images/generated/hero-v2-clean.jpeg",
    hero_logo: "/images/logo-hero-sage.png",
    cta_background: "/images/generated/bg-ocean-botanical.jpeg",
    about_image: "/images/renee-studio-bw.jpg",
    divider_art: "/images/generated/divider-fantail-clean.jpeg",
  };
  if (data) {
    for (const row of data) {
      assets[row.key] = row.image_url;
    }
  }
  return assets;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatar_url: string | null;
  availability: string;
  specialties: string[];
  sort_order: number;
}

export async function getArtists(): Promise<Artist[]> {
  const sb = getClient();
  const { data } = await sb
    .from("artists")
    .select("*")
    .order("sort_order");
  return data || [];
}

export interface GalleryImage {
  id: string;
  artist_id: string;
  image_url: string;
  title: string | null;
}

export async function getGalleryImages(artistId?: string): Promise<GalleryImage[]> {
  const sb = getClient();
  let query = sb.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (artistId) query = query.eq("artist_id", artistId);
  const { data } = await query;
  return data || [];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  sort_order: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const sb = getClient();
  const { data } = await sb
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return data || [];
}

export interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  sort_order: number;
}

export interface PricingPolicy {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  const sb = getClient();
  const { data } = await sb.from("pricing_tiers").select("*").order("sort_order");
  return data || [];
}

export async function getPricingPolicies(): Promise<PricingPolicy[]> {
  const sb = getClient();
  const { data } = await sb.from("pricing_policies").select("*").order("sort_order");
  return data || [];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export async function getProducts(): Promise<Product[]> {
  const sb = getClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return data || [];
}
