"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContentRow {
  id: string;
  key: string;
  value: string;
  label: string;
  section: string;
}

interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  sort_order: number;
}

interface PricingPolicy {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

const sectionLabels: Record<string, string> = {
  hours: "Studio Hours",
  contact: "Contact Information",
  about: "About Section",
  hero: "Hero Section",
  cta: "Call to Action Section",
};

const sectionOrder = ["hours", "contact", "about", "hero", "cta"];

export default function SettingsPage() {
  const [content, setContent] = useState<ContentRow[]>([]);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [editedTiers, setEditedTiers] = useState<Record<string, Partial<PricingTier>>>({});
  const [editedPolicies, setEditedPolicies] = useState<Record<string, Partial<PricingPolicy>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [contentRes, tiersRes, policiesRes] = await Promise.all([
      supabase.from("site_content").select("*").order("key"),
      supabase.from("pricing_tiers").select("*").order("sort_order"),
      supabase.from("pricing_policies").select("*").order("sort_order"),
    ]);
    if (contentRes.data) setContent(contentRes.data);
    if (tiersRes.data) setTiers(tiersRes.data);
    if (policiesRes.data) setPolicies(policiesRes.data);
  };

  const handleContentChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleTierChange = (id: string, field: string, value: string) => {
    setEditedTiers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
    setSaved(false);
  };

  const handlePolicyChange = (id: string, field: string, value: string) => {
    setEditedPolicies((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);

    // Save content changes
    for (const [key, value] of Object.entries(edited)) {
      await supabase
        .from("site_content")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
    }

    // Save pricing tier changes
    for (const [id, changes] of Object.entries(editedTiers)) {
      await supabase.from("pricing_tiers").update(changes).eq("id", id);
    }

    // Save pricing policy changes
    for (const [id, changes] of Object.entries(editedPolicies)) {
      await supabase.from("pricing_policies").update(changes).eq("id", id);
    }

    setEdited({});
    setEditedTiers({});
    setEditedPolicies({});
    setSaving(false);
    setSaved(true);
    fetchAll();
  };

  const hasChanges =
    Object.keys(edited).length > 0 ||
    Object.keys(editedTiers).length > 0 ||
    Object.keys(editedPolicies).length > 0;

  const grouped: Record<string, ContentRow[]> = {};
  for (const row of content) {
    if (!grouped[row.section]) grouped[row.section] = [];
    grouped[row.section].push(row);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted text-sm mt-1">
            Edit text content, hours, contact info, and pricing. Changes appear
            on the live site within 60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sage text-sm">Saved!</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-5 py-2 bg-sage text-background text-sm tracking-wider uppercase font-medium hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Site Content Sections */}
        {sectionOrder.map((section) => {
          const rows = grouped[section];
          if (!rows) return null;

          return (
            <div key={section} className="bg-card-bg border border-border p-6">
              <h2 className="text-lg font-bold mb-4">
                {sectionLabels[section] || section}
              </h2>
              <div className="space-y-4">
                {rows.map((row) => {
                  const currentValue =
                    edited[row.key] !== undefined ? edited[row.key] : row.value;
                  const isLong = row.value.length > 80;

                  return (
                    <div key={row.key}>
                      <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                        {row.label}
                      </label>
                      {isLong ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) =>
                            handleContentChange(row.key, e.target.value)
                          }
                          rows={3}
                          className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) =>
                            handleContentChange(row.key, e.target.value)
                          }
                          className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Pricing Tiers */}
        <div className="bg-card-bg border border-border p-6">
          <h2 className="text-lg font-bold mb-4">Pricing Tiers</h2>
          <div className="space-y-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedTiers[tier.id]?.title ?? tier.title}
                    onChange={(e) =>
                      handleTierChange(tier.id, "title", e.target.value)
                    }
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={editedTiers[tier.id]?.price ?? tier.price}
                    onChange={(e) =>
                      handleTierChange(tier.id, "price", e.target.value)
                    }
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={
                      editedTiers[tier.id]?.description ?? tier.description
                    }
                    onChange={(e) =>
                      handleTierChange(tier.id, "description", e.target.value)
                    }
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Policies */}
        <div className="bg-card-bg border border-border p-6">
          <h2 className="text-lg font-bold mb-4">Pricing Policies</h2>
          <div className="space-y-6">
            {policies.map((policy) => (
              <div key={policy.id} className="space-y-2">
                <div>
                  <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={
                      editedPolicies[policy.id]?.title ?? policy.title
                    }
                    onChange={(e) =>
                      handlePolicyChange(policy.id, "title", e.target.value)
                    }
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-muted text-xs tracking-wider uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    value={
                      editedPolicies[policy.id]?.description ??
                      policy.description
                    }
                    onChange={(e) =>
                      handlePolicyChange(
                        policy.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-sage transition-colors resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
