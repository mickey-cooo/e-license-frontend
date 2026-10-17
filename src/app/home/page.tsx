"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, Typography } from "@mui/material";
import { Stamp } from "../components/stamp";
import styles from "./page.module.scss";

const steps = [
  { key: "step1", href: "/home/license" },
  { key: "step2", href: "/home/merchant" },
  { key: "step3", href: "/home/document" },
  { key: "step4", href: "/home/tracker" },
] as const;

const notes = ["note1", "note2", "note3", "note4"] as const;

export default function HomePage() {
  const t = useTranslations("Home");
  const status = useTranslations("Status");

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <article className={styles.sheet}>
            <div className={styles.strike} aria-hidden="true">
              <Stamp label={status("approved")} tone="blue" tilt={-9} delayMs={400} large />
            </div>

            <div className={styles.body}>
              <Typography variant="h1" component="h1" className={styles.title}>
                {t("title")}
              </Typography>
              <Typography className={styles.lead}>{t("lead")}</Typography>
              <div className={styles.actions}>
                <Button component={Link} href="/home/merchant" variant="contained">
                  {t("start")}
                </Button>
                <Button component={Link} href="/home/license" variant="outlined">
                  {t("viewGuide")}
                </Button>
              </div>
            </div>

            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step.href} className={styles.step}>
                  <span className={styles.stepNo}>{index + 1}</span>
                  <div className={styles.stepText}>
                    <div className={styles.stepLabel}>{t(`${step.key}Label`)}</div>
                    <div className={styles.stepDesc}>{t(`${step.key}Desc`)}</div>
                  </div>
                  <Link href={step.href} className={styles.stepLink}>
                    {t("proceed")}
                  </Link>
                </li>
              ))}
            </ol>

            <div className={styles.notes}>
              <h2 className={styles.notesTitle}>{t("notesTitle")}</h2>
              <ul className={styles.notesList}>
                {notes.map((note) => (
                  <li key={note} className={styles.note}>
                    {t(note)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className={styles.slots} aria-label={t("stampsAria")}>
            <div className={styles.slotsHead}>
              <h2 className={styles.slotsTitle}>{t("stampsTitle")}</h2>
              <p className={styles.slotsSample}>{t("stampsSample")}</p>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>{t("agency", { n: 1 })}</span>
              <div className={styles.slotMark}>
                <Stamp label={status("approved")} tone="blue" tilt={-5} />
              </div>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>{t("agency", { n: 2 })}</span>
              <div className={styles.slotMark}>
                <Stamp label={status("needsFix")} tone="red" tilt={3} />
              </div>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>{t("agency", { n: 3 })}</span>
              <div className={styles.slotMark}>
                <span className={styles.slotEmpty}>{status("awaitingReview")}</span>
              </div>
            </div>
            <p className={styles.slotsFoot}>{t("stampsFoot")}</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
