import { describe, it, expect } from "vitest";

describe("Supabase Configuration", () => {
  it("should have SUPABASE_URL configured", () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toContain("supabase.co");
  });

  it("should have SUPABASE_ANON_KEY configured", () => {
    const key = process.env.SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(10);
  });

  it("should have SUPABASE_PUBLISHABLE_KEY configured", () => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(5);
  });

  it("should be able to reach Supabase API", async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("Supabase credentials not set, skipping API test");
      return;
    }

    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    // Supabase returns 200 for valid credentials
    expect(response.status).toBeLessThan(500);
  });
});
