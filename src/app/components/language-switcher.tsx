"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/lib/actions/locale";
import type { Locale } from "@/lib/i18n/locales";
import styles from "./language-switcher.module.scss";

const options: { value: Locale; label: string; name: string }[] = [
  { value: "th", label: "TH", name: "ไทย" },
  { value: "en", label: "EN", name: "English" },
];

export function LanguageSwitcher() {
  const current = useLocale();
  const t = useTranslations("Common");
  const [pending, startTransition] = useTransition();

  const change = (locale: Locale) => {
    if (locale === current) return;
    startTransition(async () => {
      await setLocale(locale);
    });
  };

  return (
    <div className={styles.group} role="group" aria-label={t("language")}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          title={option.name}
          aria-pressed={option.value === current}
          disabled={pending}
          className={clsx(styles.option, option.value === current && styles.active)}
          onClick={() => change(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
