/* ─────────────────────────────────────────────
   CLEARBOT — HeroScreen (landing, "/")
   Campus design "1 Hero": headline, proof chip, CTA
   and the blue "How it works" card. Stacked on mobile,
   two columns from lg up. "Get Started" goes to /login.
   ───────────────────────────────────────────── */

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProofChip } from "@/components/ui/ProofChip";
import { StepCard } from "@/components/ui/StepCard";
import { buttonClasses } from "@/components/ui/buttonStyles";

export function HeroScreen() {
  return (
    <div className="page-enter lg:flex lg:items-center lg:gap-12 lg:px-12 lg:pb-24 lg:pt-16 xl:gap-20 xl:px-20">
      {/* ── Copy ─────────────────────────────────── */}
      <section className="flex flex-col gap-[22px] px-6 py-9 lg:flex-1 lg:items-start lg:gap-7 lg:p-0 xl:pl-10">
        <ProofChip />

        <h1 className="font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-cb-primary lg:text-[60px] xl:text-[88px]">
          Skip the clicking. Print your <span className="text-cb-blue">clearance</span>.
        </h1>

        <p className="font-body text-[17px] leading-[1.5] text-cb-secondary lg:max-w-[520px] xl:text-[20px]">
          Complete all your lecturer assessments automatically. ₦2,000. Takes 3 minutes.
        </p>

        <Link
          href="/login"
          className={`${buttonClasses({ fullWidth: true })} lg:w-fit`}
        >
          Get Started
          <Icon name="arrowRight" />
        </Link>

        <p className="font-body text-[14px] text-cb-secondary">
          “Saved me an hour during exams”
        </p>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section
        aria-labelledby="how-it-works"
        className="px-4 pb-6 lg:w-[460px] lg:shrink-0 lg:p-0 xl:w-[560px]"
      >
        <div className="flex flex-col gap-[14px] rounded-card bg-cb-green px-5 py-7 lg:gap-4 lg:px-10 lg:py-11">
          <h2
            id="how-it-works"
            className="font-display text-[26px] font-semibold tracking-[-0.26px] text-cb-on-accent lg:text-[34px] lg:tracking-[-0.68px]"
          >
            How it works
          </h2>

          <ol className="flex flex-col gap-[14px] lg:gap-4">
            <StepCard
              number="1"
              title="Log in"
              body="Enter your matric number, portal password and campus."
            />
            <StepCard
              number="2"
              title={
                <>
                  Pay <span className="font-body font-bold">₦</span>2,000
                </>
              }
              body="One-time payment, secured by Paystack."
            />
            <StepCard
              number="3"
              title="Print your clearance"
              body="The bot completes your lecturer assessments in about 3 minutes."
            />
          </ol>
        </div>
      </section>
    </div>
  );
}
