import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Train, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSCODE = "9799494321";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    if (passcode === ADMIN_PASSCODE) {
      localStorage.setItem("dlp_auth", "true");
      localStorage.setItem("dlp_role", "admin");
      localStorage.setItem("dlp_user", "Administrator");
      setLocation("/");
    } else {
      setError("Invalid passcode. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
            <Train className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">KMRCL</h1>
          <p className="text-blue-300 font-semibold mt-1">DLP Store Inventory System</p>
          <p className="text-slate-400 text-sm mt-1">Kolkata Metro Rail Corporation Ltd.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold">Secure Login</div>
              <div className="text-slate-400 text-xs">Enter your system passcode to continue</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">System Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none h-4 w-4" />
                <Input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={e => { setPasscode(e.target.value); setError(""); }}
                  placeholder="Enter passcode"
                  className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !passcode}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : "Sign In to System"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              System Online · Neon PostgreSQL Connected
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-600 text-xs">
          DLP Store Management v2.0 · KMRCL Metro Operations
        </div>
      </div>
    </div>
  );
}
