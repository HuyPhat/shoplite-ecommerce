"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setDone(true);
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="rounded-card bg-foreground p-9 lg:p-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-md font-display text-display text-background lg:text-display-lg">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          {done ? (
            <p className="text-body-lg text-background">Thanks! You&apos;re subscribed.</p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
              <label className="flex h-11 items-center gap-3 rounded-pill bg-background px-4">
                <Mail size={20} className="shrink-0 text-subtle" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-body-lg text-foreground outline-none placeholder:text-subtle"
                />
              </label>
              <Button
                type="submit"
                className="w-full rounded-pill bg-background text-foreground hover:bg-surface"
              >
                Subscribe to Newsletter
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
