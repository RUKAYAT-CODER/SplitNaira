"use client";

import type { NetworkGuardResult } from "../hooks/useNetworkGuard";

interface NetworkWarningBannerProps {
  guard: NetworkGuardResult;
  /** Optional extra className for positioning */
  className?: string;
}

/**
 * Renders an inline banner when the wallet's network doesn't match the app's
 * configured network. Returns null when there is no mismatch.
 *
 * @example
 * const guard = useNetworkGuard(wallet);
 * <NetworkWarningBanner guard={guard} />
 */
export function NetworkWarningBanner({
  guard,
  className = "",
}: NetworkWarningBannerProps) {
  if (!guard.mismatch) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "flex items-start gap-3",
        "rounded-xl border border-red-500/40 bg-red-500/10",
        "px-4 py-3 text-sm text-red-400",
        className,
      ].join(" ")}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-base font-bold text-red-400"
      >
        ⚠
      </span>

      {/* Body */}
      <div className="flex-1 space-y-1">
        <p className="font-semibold text-red-300">Wrong Network</p>
        <p className="leading-snug">
          Your wallet is connected to{" "}
          <span className="font-mono font-bold">{guard.actualNetwork}</span>,
          but this app requires{" "}
          <span className="font-mono font-bold">{guard.expectedNetwork}</span>.
        </p>
        <p className="text-red-400/80">
          Open your wallet, switch to{" "}
          <span className="font-mono">{guard.expectedNetwork}</span>, then
          refresh the page.
        </p>
      </div>

      {/* Network badges */}
      <div className="shrink-0 flex flex-col items-end gap-1 text-xs">
        <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-red-300">
          actual: {guard.actualNetwork}
        </span>
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-emerald-300">
          expected: {guard.expectedNetwork}
        </span>
      </div>
    </div>
  );
}
