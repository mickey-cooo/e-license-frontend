"use client";

import clsx from "clsx";
import { Checkbox } from "@mui/material";
import { useTranslations } from "next-intl";
import styles from "./condition-checklist.module.scss";

export type Conditions = {
  hazardous: boolean;
  alcohol: boolean;
  food: boolean;
};

const items = ["hazardous", "alcohol", "food"] as const;

// Plain tick-boxes with an example under each, instead of switches whose "off" state is unclear.
export function ConditionChecklist({
  values,
  onChange,
}: {
  values: Conditions;
  onChange: (key: keyof Conditions, checked: boolean) => void;
}) {
  const m = useTranslations("Merchant");

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{m("conditionsTitle")}</legend>
      <p className={styles.help}>{m("conditionsHelp")}</p>
      <div className={styles.rows}>
        {items.map((key) => (
          <label
            key={key}
            className={clsx(styles.row, values[key] && styles.checked)}
          >
            <Checkbox
              checked={values[key]}
              onChange={(_, checked) => onChange(key, checked)}
            />
            <span>
              <span className={styles.label}>{m(key)}</span>
              <span className={styles.hint}>{m(`${key}Hint`)}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
