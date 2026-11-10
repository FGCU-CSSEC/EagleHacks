import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase.from("staff_roles").select("role").eq("user_id", userId).maybeSingle();
  return data?.role === "admin";
}
