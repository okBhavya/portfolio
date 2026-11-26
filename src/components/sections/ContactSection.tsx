"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Mail, Send } from "lucide-react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/SocialIcons";
import { profileConfig, type SocialLink } from "@/data/profile";
import { SectionReveal } from "@/components/SectionReveal";

function getSocialIcon(id: SocialLink["id"]) {
  switch (id) {
    case "email":
      return Mail;
    case "linkedin":
      return LinkedInIcon;
    case "github":
      return GitHubIcon;
    case "instagram":
    default:
      return InstagramIcon;
  }
}

export function sanitizeField(input: string, maxLength: number): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function buildMailtoHref(
  email: string,
  subject: string,
  body: string
): string {
  const cleanSubject =
    sanitizeField(subject, 120) || "Hello from your portfolio";
  const cleanBody = body
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 1200);
  const params = new URLSearchParams({
    subject: cleanSubject,
    body: cleanBody,
  });
  return `mailto:${email}?${params.toString()}`;
}

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [topic, setTopic] = useState("Collaboration / Project Idea");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profileConfig.email}`;
    }
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeField(senderName, 80);
    const cleanMsg = message.trim();

    if (cleanMsg.length < 4) {
      setValidationError(
        "Write a short note (at least 4 characters) before opening your email client."
      );
      return;
    }

    setValidationError(null);
    const fullSubject = cleanName ? `[${topic}] from ${cleanName}` : topic;
    const fullBody = `${cleanMsg}\n\n— ${
      cleanName || "A visitor from your portfolio"
    }`;
    window.location.href = buildMailtoHref(
      profileConfig.email,
      fullSubject,
      fullBody
    );
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-lab-dots py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="max-w-3xl">
            <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-green)] uppercase">
              06 · Get in Touch
            </p>
            <h2
              id="contact-heading"
              className="text-balance mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-5xl"
            >
              Have an interesting idea? Let&apos;s build something.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--ink-secondary)]">
              Always happy to talk about applied AI, distributed systems,
              product strategy, or quirky side experiments.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left: Direct Channels + Direct Email Bar aligned cleanly to right form height */}
          <SectionReveal delay={0.05} className="flex flex-col lg:col-span-6">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                {profileConfig.socials.map((social) => {
                  const Icon = getSocialIcon(social.id);
                  const isExternal = social.id !== "email";
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="ink-card ink-card-interactive flex flex-col justify-between rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)] text-[var(--ink-primary)]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        {isExternal && (
                          <ExternalLink
                            className="h-4 w-4 text-[var(--ink-muted)]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="mt-4 min-w-0">
                        <p className="font-serif-display text-lg font-bold text-[var(--ink-primary)]">
                          {social.label}
                        </p>
                        <p className="mt-0.5 break-words font-mono-tech text-[11.5px] font-semibold leading-snug text-[var(--accent-orange)] [overflow-wrap:anywhere]">
                          {social.handle}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
                          {social.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Direct Copy Email Bar */}
              <div className="ink-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-mono-tech text-[11px] font-bold text-[var(--ink-muted)] uppercase">
                    Direct Email
                  </p>
                  <p className="mt-0.5 break-words font-mono-tech text-xs font-bold leading-snug text-[var(--ink-primary)] [overflow-wrap:anywhere] sm:text-sm">
                    {profileConfig.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--bg-paper)] px-3.5 py-2 text-xs font-bold text-[var(--ink-primary)]"
                  >
                    {copied ? (
                      <>
                        <Check
                          className="h-3.5 w-3.5 text-[var(--accent-green)]"
                          aria-hidden="true"
                        />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${profileConfig.email}`}
                    className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-orange-fill)] px-3.5 py-2 text-xs font-bold text-[#FFFDF9]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Email Me</span>
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Right: Static Privacy-Safe Mailto Note Builder (matches left column height) */}
          <SectionReveal delay={0.1} className="flex flex-col lg:col-span-6">
            <form
              onSubmit={handleComposeSubmit}
              noValidate
              className="ink-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--border-soft)] pb-3.5">
                  <h3 className="font-serif-display text-xl font-bold text-[var(--ink-primary)]">
                    Quick Note Composer
                  </h3>
                  <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
                    Opens your mail app · Zero tracking
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-bold text-[var(--ink-primary)]"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      maxLength={80}
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Alex from ..."
                      className="mt-1.5 w-full rounded-xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] px-3.5 py-2 text-sm text-[var(--ink-primary)] transition-colors focus:border-[var(--border-ink)] focus:ring-2 focus:ring-[var(--accent-orange)]/25 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-bold text-[var(--ink-primary)]"
                    >
                      Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] px-3.5 py-2 text-sm text-[var(--ink-primary)] transition-colors focus:border-[var(--border-ink)] focus:ring-2 focus:ring-[var(--accent-orange)]/25 focus:outline-none"
                    >
                      <option>Collaboration / Project Idea</option>
                      <option>AI / ML or Product Role</option>
                      <option>Research &amp; Engineering Chat</option>
                      <option>Just saying hello</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-bold text-[var(--ink-primary)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      maxLength={1200}
                      value={message}
                      onChange={(e) => {
                        const nextVal = e.target.value;
                        setMessage(nextVal);
                        if (validationError && nextVal.trim().length >= 4) {
                          setValidationError(null);
                        }
                      }}
                      placeholder="Tell me what you're building or exploring..."
                      className="mt-1.5 w-full rounded-xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] px-3.5 py-2 text-sm text-[var(--ink-primary)] transition-colors focus:border-[var(--border-ink)] focus:ring-2 focus:ring-[var(--accent-orange)]/25 focus:outline-none"
                    />
                  </div>

                  {validationError && (
                    <p
                      role="alert"
                      className="rounded-xl border border-[var(--accent-orange)] bg-[var(--accent-orange-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent-orange)]"
                    >
                      {validationError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="ink-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-green)] px-5 py-3 text-sm font-bold text-[#FFFDF9]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Compose Email</span>
              </button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
