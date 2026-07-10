"use client";

import { supabase } from "@/lib/supabase/client";

function getOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username?: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || email.split("@")[0] },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signInWithOAuth(provider: "google" | "github") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${getOrigin()}/auth/callback` },
  });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getOrigin()}/auth/callback`,
  });
  if (error) throw new Error(error.message);
}

export async function updateEmail(email: string) {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw new Error(error.message);
}

export async function updateUsername(username: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update({ username, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}
