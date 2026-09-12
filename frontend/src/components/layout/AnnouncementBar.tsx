"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-foreground text-background">
      <Container className="relative flex h-9 items-center justify-center text-caption">
        <p className="truncate px-8 text-center">
          Sign up and get 20% off to your first order.{" "}
          <button className="font-medium underline underline-offset-2">
            Sign Up Now
          </button>
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setOpen(false)}
          className="absolute right-4 text-background"
        >
          <X size={20} />
        </button>
      </Container>
    </div>
  );
}
