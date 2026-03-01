import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);
    const result = await register(
      username.trim(),
      displayName.trim(),
      password,
    );
    setIsLoading(false);

    if (result.success) {
      navigate({ to: "/" });
    } else {
      setError(result.error ?? "Registration failed. Please try again.");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(160deg, #0a1520 0%, #0c2233 50%, #071520 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #06B6D4 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img
              src="/assets/uploads/cropped_circle_image-1.png"
              alt="WebFoo Mart"
              className="h-20 w-20 object-contain rounded-full shadow-lg mb-4"
              style={{ border: "3px solid rgba(6,182,212,0.4)" }}
            />
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-white mb-1">
            Create your account
          </h1>
          <p className="text-sm text-white/50">
            Join WebFoo Mart and start shopping
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(12, 22, 34, 0.88)",
            border: "1px solid rgba(6,182,212,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.28)",
                    color: "#FCA5A5",
                  }}
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              {/* Display Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="displayName"
                  className="text-sm font-semibold text-white/80"
                >
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your full name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                  required
                  className="h-11 rounded-xl placeholder:text-white/30 focus-visible:ring-cyan-400/40"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-white/80"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="h-11 rounded-xl placeholder:text-white/30 focus-visible:ring-cyan-400/40"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-white/80"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-11 rounded-xl pr-11 placeholder:text-white/30 focus-visible:ring-cyan-400/40"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-white/80"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-11 rounded-xl pr-11 placeholder:text-white/30 focus-visible:ring-cyan-400/40"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11 rounded-xl font-bold text-white mt-2 shadow-md hover:opacity-90 transition-all"
                style={{ backgroundColor: "#0891B2" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link
              to="/login"
              search={{ redirect: undefined }}
              className="font-semibold transition-colors hover:underline"
              style={{ color: "#22D3EE" }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Back to browsing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            ← Continue browsing as guest
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
