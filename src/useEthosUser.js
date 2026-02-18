import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { fetchUserByX } from "./ethos";

/**
 * Custom hook that connects Privy auth state → Ethos user profile.
 *
 * Flow:
 * 1. User clicks "Sign in with X" → Privy handles Twitter/X OAuth
 * 2. After login, Privy gives us linkedAccounts with Twitter username
 * 3. We call Ethos API to get full profile by X username (score, xp, stats, etc.)
 */
export function useEthosUser() {
  const { ready, authenticated, user: privyUser, login, logout, getAccessToken } = usePrivy();
  const [ethosUser, setEthosUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authenticated || !privyUser) {
      setEthosUser(null);
      return;
    }

    // Find Twitter/X account from Privy linked accounts
    const twitterAccount = privyUser.linkedAccounts?.find(
      (acc) => acc.type === "twitter_oauth"
    );
    const xUsername = twitterAccount?.username;

    if (!xUsername) {
      setError("No X/Twitter account linked. Please sign in with X.");
      return;
    }

    // Fetch Ethos profile by X username
    setLoading(true);
    setError(null);

    fetchUserByX(xUsername)
      .then((data) => {
        setEthosUser(data);
      })
      .catch((err) => {
        console.error("Failed to fetch Ethos profile:", err);
        if (err.message === "NOT_FOUND") {
          setError("No Ethos profile found for @" + xUsername + ". Create one at ethos.network");
        } else {
          setError("Could not load your Ethos profile. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authenticated, privyUser]);

  return {
    ready,
    authenticated,
    ethosUser,
    loading,
    error,
    login,
    logout,
    getAccessToken,
  };
}
