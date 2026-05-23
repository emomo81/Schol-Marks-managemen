"use client";
import { useState } from "react";
import Image from "next/image";

const DEMO_ACCOUNTS = [
  { role:"principal", email:"j.johnson@confidenceschool.lr", label:"Principal Johnson", desc:"Full system access · finalize approvals · override marks" },
  { role:"vpa",       email:"m.tarr@confidenceschool.lr",   label:"Mrs. Tarr — VPA",   desc:"Approve/reject submissions · override marks · manage subjects" },
  { role:"teacher",   email:"m.cooper@confidenceschool.lr", label:"Mr. Cooper — Teacher",desc:"Enter marks for assigned class × subject pairs" },
  { role:"sponsor",   email:"a.wleh@confidenceschool.lr",   label:"Mrs. Wleh — Sponsor",desc:"View class marks · sign off per period · export report cards" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up Supabase auth
    // const supabase = createClient();
    // await supabase.auth.signInWithPassword({ email, password });
    setTimeout(() => { window.location.href = "/"; }, 500);
  }

  return (
    <div className="min-h-screen grid place-items-center" style={{
      background: "radial-gradient(ellipse at 30% 20%, #f1d4c5 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, #f3c3cc 0%, transparent 50%), #f7f2ec"
    }}>
      <div className="w-[420px] bg-paper-2 border border-rule rounded-[14px] p-8 shadow-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#fdf5e6] border border-[#c9a85a] flex items-center justify-center overflow-hidden">
            <Image src="/school-logo.png" alt="Confidence School System" width={40} height={40} className="object-cover"/>
          </div>
          <div>
            <h2 className="font-serif font-semibold text-[26px] m-0 leading-tight">Confidence</h2>
            <div className="text-[11px] text-ink-3 uppercase tracking-[.06em]">School System · Marks Management</div>
          </div>
        </div>
        <p className="text-ink-3 text-[13px] mb-4 mt-2">Sign in to access your dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="block text-[12px] text-ink-2 mb-1 font-medium">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine focus:shadow-[0_0_0_3px_rgba(122,29,46,0.12)]"
              placeholder="your.name@confidenceschool.lr"/>
          </div>
          <div className="mb-4">
            <label className="block text-[12px] text-ink-2 mb-1 font-medium">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine focus:shadow-[0_0_0_3px_rgba(122,29,46,0.12)]"
              placeholder="••••••••"/>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-md border border-wine bg-wine text-[#fdf5e6] text-[14px] font-medium hover:bg-wine-2 disabled:opacity-60 transition-colors">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-rule">
          <div className="text-[12px] text-ink-3 mb-3 font-medium uppercase tracking-[.08em]">Demo — click to fill credentials</div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button key={a.role} onClick={() => { setEmail(a.email); setPassword("demo1234!"); }}
                className="text-left p-2.5 border border-rule rounded-md bg-paper hover:border-wine hover:bg-wine-soft transition-colors">
                <div className="font-semibold text-[12.5px] text-ink">{a.label}</div>
                <div className="text-[11px] text-ink-3 mt-0.5 leading-tight">{a.desc}</div>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-ink-3 mt-2.5 text-center">
            Password: <span className="font-mono">demo1234!</span> · Configure Supabase in <span className="font-mono">.env.local</span>
          </div>
        </div>
      </div>
    </div>
  );
}
