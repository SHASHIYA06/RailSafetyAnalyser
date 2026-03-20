import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Train, Eye, EyeOff, Shield, Mail, LogIn, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isFirebaseConfigured, firebaseLogin } from "@/lib/firebase";

const ADMIN_PASSCODE = "9799494321";

type LoginMode = "passcode" | "firebase";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<LoginMode>("passcode");
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 500));
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

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      setError("Firebase is not configured. Please use passcode login.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await firebaseLogin(email, password);
      const user = result.user;
      localStorage.setItem("dlp_auth", "true");
      localStorage.setItem("dlp_role", "user");
      localStorage.setItem("dlp_user", user.displayName || user.email || "User");
      setLocation("/");
    } catch (err: any) {
      const msg = err?.code === "auth/invalid-credential" ? "Invalid email or password."
        : err?.code === "auth/too-many-requests" ? "Too many attempts. Please try again later."
        : "Login failed. Please try again.";
      setError(msg);
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

        {/* Mode Toggle */}
        {isFirebaseConfigured && (
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-4">
            <button
              onClick={() => { setMode("passcode"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "passcode" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Shield className="h-4 w-4" />
              Passcode
            </button>
            <button
              onClick={() => { setMode("firebase"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "firebase" ? "bg-orange-500 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Flame className="h-4 w-4" />
              Firebase Login
            </button>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {mode === "passcode" ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-bold">Admin Passcode Login</div>
                  <div className="text-slate-400 text-xs">Enter your system passcode</div>
                </div>
              </div>
              <form onSubmit={handlePasscodeLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">System Passcode</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={e => { setPasscode(e.target.value); setError(""); }}
                      placeholder="Enter passcode"
                      className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 rounded-xl"
                    />
                    <button type="button" onClick={() => setShowPasscode(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">{error}</div>}
                <Button type="submit" disabled={loading || !passcode} className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Verifying...</> : "Sign In to System"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white font-bold">Firebase Authentication</div>
                  <div className="text-slate-400 text-xs">Sign in with your account</div>
                </div>
              </div>
              <form onSubmit={handleFirebaseLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="admin@kmrcl.com" className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input type={showPwd ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 rounded-xl" />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">{error}</div>}
                <Button type="submit" disabled={loading || !email || !password} className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Signing in...</> : <><LogIn className="h-4 w-4 mr-2" />Sign In with Firebase</>}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              System Online · Neon PostgreSQL Connected
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-slate-600 text-xs">
          DLP Store Management v2.0 · KMRCL Metro Operations · Vercel + Neon + Firebase
        </div>
      </div>
    </div>
  );
}
