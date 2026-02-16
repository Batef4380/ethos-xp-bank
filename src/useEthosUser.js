import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { fetchUserByWallet } from "./ethos";

/**
 * Custom hook that connects Privy auth state → Ethos user profile.
 *
 * Flow:
 * 1. User clicks "Sign in with Ethos" → Privy handles cross-app auth
 * 2. After login, Privy gives us linkedAccounts with Ethos Everywhere wallet
 * 3. We call Ethos API to get full profile (score, xp, stats, etc.)
 */
export function useEthosUser() {
  const { ready, authenticated, user: privyUser, login, logout } = usePrivy();
  const [ethosUser, setEthosUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authenticated || !privyUser) {
      setEthosUser(null);
      return;
    }

    // Find Ethos Everywhere wallet from Privy linked accounts
    const crossAppAccount = privyUser.linkedAccounts?.find(
      (acc) => acc.type === "cross_app"
    );
    const walletAddress = crossAppAccount?.embeddedWallets?.[0]?.address;

    if (!walletAddress) {
      // User is authenticated via Privy but doesn't have Ethos linked
      setError("No Ethos profile linked. Please sign in with Ethos.");
      return;
    }

    // Fetch full Ethos profile from wallet address
    setLoading(true);
    setError(null);

    fetchUserByWallet(walletAddress)
      .then((data) => {
        setEthosUser(data);
      })
      .catch((err) => {
        console.error("Failed to fetch Ethos profile:", err);
        setError("Could not load your Ethos profile. Please try again.");
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
  };
}
