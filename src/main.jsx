import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (!PRIVY_APP_ID || PRIVY_APP_ID === "your-privy-app-id-here") {
  document.getElementById("root").innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#08080f;color:#fff;font-family:monospace;padding:40px;text-align:center">
      <div>
        <h1 style="font-size:24px;margin-bottom:16px">⚠️ Privy App ID Required</h1>
        <p style="color:#6b7280;font-size:14px;margin-bottom:20px">Create a <code>.env</code> file with your Privy App ID.</p>
        <pre style="background:#111;padding:16px;border-radius:8px;text-align:left;font-size:12px;color:#4ade80">
# .env
VITE_PRIVY_APP_ID=your-actual-privy-app-id</pre>
        <p style="color:#6b7280;font-size:12px;margin-top:16px">
          Get it from <a href="https://dashboard.privy.io" target="_blank" style="color:#4488cc">dashboard.privy.io</a><br/>
          Enable <strong>Ethos Network</strong> in Global Settings → Integrations
        </p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#22c55e",
            logo: null,
          },
          loginMethods: ["twitter"],
        }}
      >
        <App />
      </PrivyProvider>
    </React.StrictMode>
  );
}
