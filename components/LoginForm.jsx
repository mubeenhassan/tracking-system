"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/app/action/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loader
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show loader when form is submitted

    // Get location if permission is granted
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => {
              console.error("Location error:", error);
              resolve(null); // Continue even if location is not available
            }
          );
        } else {
          resolve(null);
        }
      });
    };

    const location = await getLocation();

    try {
      // Pass location with login details
      const result = await login(email, password, location);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false); // Hide loader after processing
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-12">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
        </div>
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        {loading ? (
          <div class="loader"></div>
        ) : (
          <Button type="submit" className="w-full" disabled={loading}>
            Login
          </Button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
