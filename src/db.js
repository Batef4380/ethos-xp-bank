import { supabase } from "./supabase";

function requireSupabase() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

// ── Offers ──────────────────────────────────────

export async function fetchOffers() {
  const { data, error } = await requireSupabase()
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOffer({ username, displayName, avatarUrl, score, amount, durationDays }) {
  const { data, error } = await requireSupabase()
    .from("offers")
    .insert({
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      score,
      amount,
      duration_days: durationDays,
      is_open: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function borrowOffer(offerId, borrowerUsername) {
  const { error } = await requireSupabase()
    .from("offers")
    .update({ is_open: false, borrower_username: borrowerUsername })
    .eq("id", offerId);
  if (error) throw error;
}

// ── Loans ───────────────────────────────────────

export async function fetchLoans(username) {
  const { data, error } = await requireSupabase()
    .from("loans")
    .select("*")
    .or(`lender_username.eq.${username},borrower_username.eq.${username}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createLoan({ offerId, lenderUsername, lenderDisplayName, lenderAvatarUrl, lenderScore, borrowerUsername, borrowerDisplayName, borrowerAvatarUrl, borrowerScore, amount, dueDate }) {
  const { data, error } = await requireSupabase()
    .from("loans")
    .insert({
      offer_id: offerId,
      lender_username: lenderUsername,
      lender_display_name: lenderDisplayName,
      lender_avatar_url: lenderAvatarUrl,
      lender_score: lenderScore,
      borrower_username: borrowerUsername,
      borrower_display_name: borrowerDisplayName,
      borrower_avatar_url: borrowerAvatarUrl,
      borrower_score: borrowerScore,
      amount,
      due_date: dueDate,
      is_repaid: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function repayLoan(loanId) {
  const { error } = await requireSupabase()
    .from("loans")
    .update({ is_repaid: true })
    .eq("id", loanId);
  if (error) throw error;
}
