"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { authConfig } from "@/features/auth/config/auth";
import { TerminalTile } from "@/components/ui/terminal-tile";

export function LoginBranding() {
  const t = useTranslations();

  return (
    <div className="relative z-10 w-full max-w-lg px-8">
      {/* Modern Logo & Title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-tile">
          <span className="text-xl font-bold font-mono text-white">
            {`>_`}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t(authConfig.systemNameKey)}
          </h1>
          <p className="text-sm text-zinc-300 mt-1">
            {t(authConfig.systemDescriptionKey)}
          </p>
        </div>
      </div>

      {/* Hero Terminal Window */}
      <TerminalTile
        title="python3 — authenticate.py"
        className="shadow-2xl border border-white/10"
      >
        <div className="space-y-1 sm:text-sm text-xs">
          <p className="text-terminal-muted">
            # 🚀 Initialize Learning Environment
          </p>
          <p>
            <span className="text-[#C792EA]">import</span>{" "}
            <span className="text-[#82AAFF]">pylearn</span>
          </p>
          <br />
          <p>
            <span className="text-[#82AAFF]">session</span> = pylearn.
            <span className="text-[#82AAFF]">authenticate</span>()
          </p>
          <p>
            <span className="text-[#C792EA]">if</span> session.is_ready:
          </p>
          <p className="pl-4">
            <span className="text-[#82AAFF]">print</span>(
            <span className="text-[#C3E88D]">
              f"Welcome back, {`{session.user.name}`}!"
            </span>
            )
          </p>
          <p className="pl-4">
            session.<span className="text-[#82AAFF]">start_learning</span>()
          </p>
          <br />
          <p className="text-emerald-400 animate-pulse drop-shadow-sm">
            <span className="text-terminal-muted">→</span> Awaiting
            authentication payload...
          </p>
        </div>
      </TerminalTile>
    </div>
  );
}
