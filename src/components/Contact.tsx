
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../config/emailjs';
import { GITHUB_URL, LINKEDIN_URL, SITE_EMAIL } from '../config/site';

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Record<keyof FormData, string>;

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  message: '',
};

const INITIAL_ERRORS: FormErrors = {
  name: '',
  email: '',
  message: '',
};

const githubPath =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

const linkedinPath =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774.792 0 1.771 0h20.454z';

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d={githubPath} />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d={linkedinPath} />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11z"
        strokeWidth="1.6"
      />
      <path
        d="m4 6 7.05 5.3a1.55 1.55 0 001.9 0L20 6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M20 10.5c0 5.25-8 10.5-8 10.5S4 15.75 4 10.5a8 8 0 1116 0Z"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10.5" r="2.5" strokeWidth="1.6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const reveal = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const validateForm = () => {
    const nextErrors: FormErrors = { ...INITIAL_ERRORS };
    let valid = true;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required';
      valid = false;
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
      valid = false;
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      nextErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Message is required';
      valid = false;
    } else if (trimmedMessage.length < 10) {
      nextErrors.message = 'Message must be at least 10 characters';
      valid = false;
    }

    setErrors(nextErrors);

    if (!valid) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
    }

    return valid;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    if (
      !emailjsConfig.serviceId ||
      !emailjsConfig.templateId ||
      !emailjsConfig.publicKey
    ) {
      setSubmitError(
        `The contact form is not configured yet. Please email me directly at ${SITE_EMAIL}.`,
      );
      return;
    }

    if (!formRef.current) {
      setSubmitError(
        'Unable to send your message right now. Please refresh the page and try again.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey
      );

      if (result.status !== 200) {
        throw new Error(
          `EmailJS returned status ${result.status}`
        );
      }

      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
    } catch (error) {
      console.error('Error sending contact form:', error);

      setSubmitError(
        'Unable to send your message right now. Please try again or email me directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    /*
     * The HTML names are intentionally:
     * user_name
     * user_email
     * message
     *
     * These match the EmailJS template variables.
     *
     * But React state uses:
     * name
     * email
     * message
     *
     * So we map the HTML field names to the correct state keys.
     */
    const stateKey =
      name === 'user_name'
        ? 'name'
        : name === 'user_email'
          ? 'email'
          : 'message';

    setFormData((current) => ({
      ...current,
      [stateKey]: value,
    }));

    const errorKey = stateKey as keyof FormErrors;

    if (errors[errorKey]) {
      setErrors((current) => ({
        ...current,
        [errorKey]: '',
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  useEffect(() => {
    if (!isSubmitted) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSubmitted(false);

        requestAnimationFrame(() => {
          firstInputRef.current?.focus();
        });
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSubmitted]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="contact-title"
    >
      {/* Structural background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-[5%] top-0 h-full w-px bg-[var(--line)] opacity-60" />

        <div className="absolute right-[5%] top-0 h-full w-px bg-[var(--line)] opacity-60" />

        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          variants={reveal}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-14 border-b border-[var(--line)] pb-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--primary)]">
                  04 / Contact
                </span>

                <span className="hidden h-px w-14 bg-[var(--primary)] sm:block" />
              </div>

              <h2
                id="contact-title"
                className="font-[var(--font-orbitron)] text-[clamp(3rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]"
              >
                LET&apos;S
                <br />
                <span className="text-[var(--primary)]">
                  BUILD.
                </span>
              </h2>
            </div>

            <div className="max-w-sm text-right">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Open for opportunities
              </span>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Have an idea, project, or opportunity worth
                discussing? Send me a message.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-[0.72fr_1.28fr]">
          {/* Contact information */}
          <motion.div
            variants={reveal}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative bg-[var(--surface)] p-6 sm:p-8 lg:p-10"
          >
            <div className="flex h-full flex-col">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  Start a conversation
                </span>

                <h3 className="mt-4 max-w-md font-[var(--font-orbitron)] text-2xl font-bold leading-tight tracking-[-0.04em] sm:text-3xl">
                  Good work starts with a good brief.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">
                  Tell me what you&apos;re building, what problem
                  you&apos;re trying to solve, or simply what
                  you&apos;d like to discuss.
                </p>
              </div>

              <div className="mt-10 space-y-1 border-y border-[var(--line)]">
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="group flex items-center gap-4 border-b border-[var(--line)] py-5 transition-colors hover:text-[var(--primary)] focus:outline-none focus-visible:text-[var(--primary)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--primary)] transition-colors group-hover:border-[var(--primary)]">
                    <MailIcon />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Email
                    </span>

                    <span className="mt-1 block truncate text-sm">
                      {SITE_EMAIL}
                    </span>
                  </span>

                  <span className="ml-auto shrink-0">
                    <ArrowIcon />
                  </span>
                </a>

                <div className="flex items-center gap-4 border-b border-[var(--line)] py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--primary)]">
                    <LocationIcon />
                  </span>

                  <span>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Location
                    </span>

                    <span className="mt-1 block text-sm">
                      Kerala, India
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Find me online
                </span>

                <div className="mt-4 flex gap-2">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit GitHub profile"
                    className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  >
                    <GithubIcon />
                  </a>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit LinkedIn profile"
                    className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  >
                    <LinkedinIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={reveal}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative bg-[var(--surface)] p-6 sm:p-8 lg:p-10"
          >
            <div
              className="pointer-events-none absolute left-0 top-0 h-px w-1/3 bg-[var(--primary)]"
              aria-hidden="true"
            />

            {isSubmitted ? (
              <motion.div
                className="flex min-h-[520px] flex-col items-start justify-center border border-[var(--line)] bg-[var(--background)] p-7 sm:p-10"
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center border border-[var(--primary)] bg-[var(--primary)] text-black">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className="mt-8 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  Transmission complete
                </span>

                <h3 className="mt-3 font-[var(--font-orbitron)] text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  Message sent.
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted)]">
                  Thanks for reaching out. Your message has been
                  sent successfully. I&apos;ll get back to you as
                  soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);

                    requestAnimationFrame(() => {
                      firstInputRef.current?.focus();
                    });
                  }}
                  className="mt-8 border border-[var(--line)] px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="border border-[var(--line)] bg-[var(--background)] p-5 sm:p-7 lg:p-8"
              >
                <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--primary)]">
                      Contact form
                    </span>

                    <h3 className="mt-2 text-lg font-semibold">
                      Send a message
                    </h3>
                  </div>

                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    04 — 01
                  </span>
                </div>

                {submitError && (
                  <motion.div
                    className="mb-6 border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-500"
                    role="alert"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {submitError}
                  </motion.div>
                )}

                <div className="space-y-7">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]"
                    >
                      01 / Name
                    </label>

                    <input
                      ref={firstInputRef}
                      type="text"
                      id="name"
                      name="user_name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? 'name-error' : undefined
                      }
                      required
                      className={`w-full border-b bg-transparent px-0 py-3 text-base text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-dark)] ${
                        errors.name
                          ? 'border-red-500'
                          : 'border-[var(--line)] focus:border-[var(--primary)]'
                      }`}
                    />

                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-red-500"
                        role="alert"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]"
                    >
                      02 / Email
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="user_email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={100}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      required
                      className={`w-full border-b bg-transparent px-0 py-3 text-base text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-dark)] ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-[var(--line)] focus:border-[var(--primary)]'
                      }`}
                    />

                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-red-500"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]"
                    >
                      03 / Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={6}
                      maxLength={500}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message
                          ? 'message-error'
                          : undefined
                      }
                      required
                      className={`w-full resize-none border-b bg-transparent px-0 py-3 text-base leading-7 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-dark)] ${
                        errors.message
                          ? 'border-red-500'
                          : 'border-[var(--line)] focus:border-[var(--primary)]'
                      }`}
                    />

                    <div className="mt-2 flex items-start justify-between gap-4">
                      {errors.message ? (
                        <p
                          id="message-error"
                          className="font-mono text-[8px] uppercase tracking-[0.12em] text-red-500"
                          role="alert"
                        >
                          {errors.message}
                        </p>
                      ) : (
                        <span />
                      )}

                      <span className="shrink-0 font-mono text-[8px] text-[var(--muted)]">
                        {formData.message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Hidden reply-to field for EmailJS */}
                  <input
                    type="hidden"
                    name="reply_to"
                    value={formData.email}
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-between border border-[var(--primary)] bg-[var(--primary)] px-5 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  >
                    <span>
                      {isSubmitting
                        ? 'Sending message...'
                        : 'Send message'}
                    </span>

                    {isSubmitting ? (
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          variants={reveal}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
            AI / ML / Software engineering
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Response channel / Email
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">
            ↓ 04
          </span>
        </motion.div>
      </div>
    </section>
  );
}
