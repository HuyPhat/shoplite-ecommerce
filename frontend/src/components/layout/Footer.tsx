import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

function SocialIcon({ name }: { name: string }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };
  switch (name) {
    case "twitter":
      return (
        <svg {...common}>
          <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.7 4.8a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8.1 8.1 0 0 1 2 18.6a11.4 11.4 0 0 0 6.2 1.8c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.1z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V14h2.7v8h3.4z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6zM18.6 8.2a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0zM12 4.8c-2 0-2.2 0-3 .1-.8 0-1.3.2-1.8.4-.5.2-.9.5-1.3.9-.4.4-.7.8-.9 1.3-.2.5-.3 1-.4 1.8-.1.8-.1 1-.1 3s0 2.2.1 3c0 .8.2 1.3.4 1.8.2.5.5.9.9 1.3.4.4.8.7 1.3.9.5.2 1 .3 1.8.4.8.1 1 .1 3 .1s2.2 0 3-.1c.8 0 1.3-.2 1.8-.4.5-.2.9-.5 1.3-.9.4-.4.7-.8.9-1.3.2-.5.3-1 .4-1.8.1-.8.1-1 .1-3s0-2.2-.1-3c0-.8-.2-1.3-.4-1.8a3.6 3.6 0 0 0-.9-1.3 3.6 3.6 0 0 0-1.3-.9c-.5-.2-1-.3-1.8-.4-.8-.1-1-.1-3-.1zM12 3.5c2 0 2.3 0 3.1.1.8 0 1.4.2 1.9.4.5.2 1 .5 1.4 1 .5.4.8.8 1 1.3.2.5.3 1.1.4 1.9.1.8.1 1.1.1 3.1s0 2.3-.1 3.1c0 .8-.2 1.4-.4 1.9a4 4 0 0 1-1 1.4 4 4 0 0 1-1.3 1c-.5.2-1.1.3-1.9.4-.8.1-1.1.1-3.1.1s-2.3 0-3.1-.1c-.8 0-1.4-.2-1.9-.4a4 4 0 0 1-1.4-1 4 4 0 0 1-1-1.3c-.2-.5-.3-1.1-.4-1.9-.1-.8-.1-1.1-.1-3.1s0-2.3.1-3.1c0-.8.2-1.4.4-1.9a4 4 0 0 1 1-1.4 4 4 0 0 1 1.3-1c.5-.2 1.1-.3 1.9-.4.8-.1 1.1-.1 3.1-.1z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="bg-surface">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.6fr_repeat(4,1fr)] lg:gap-16">
          <div className="col-span-2 flex flex-col gap-6 lg:col-span-1">
            <p className="font-display text-[1.8rem] leading-none lg:text-display">
              {siteConfig.name}
            </p>
            <p className="max-w-xs text-body text-muted">
              We have clothes that suits your style and which you&apos;re proud to wear.
              From women to men.
            </p>
            <div className="flex items-center gap-3">
              {siteConfig.socials.map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>

          {siteConfig.footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4 lg:gap-6">
              <h3 className="text-overline-sm font-medium uppercase text-foreground lg:text-overline">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3 lg:gap-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="/shop" className="text-body text-muted hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 lg:mt-12">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p className="text-body text-muted">
              {siteConfig.name} © 2000-2023, All Rights Reserved
            </p>
            <div className="flex items-center gap-2.5">
              {siteConfig.payments.map((name) => (
                <span
                  key={name}
                  className="flex h-[26px] items-center rounded-badge border border-neutral-400 bg-background px-1.5 text-[9px] font-medium text-foreground shadow-badge lg:h-[30px] lg:px-2 lg:text-[10px] lg:shadow-badge-lg"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
