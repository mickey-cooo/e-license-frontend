import clsx from "clsx";
import type { CSSProperties } from "react";
import styles from "./stamp.module.scss";

interface StampProps {
  label: string;
  tone?: "blue" | "red" | "graphite";
  tilt?: number;
  delayMs?: number;
  large?: boolean;
  plain?: boolean;
}

export function Stamp({ label, tone = "blue", tilt = -4, delayMs, large, plain }: StampProps) {
  const style = {
    "--tilt": `${tilt}deg`,
    ...(delayMs === undefined ? {} : { "--delay": `${delayMs}ms` }),
  } as CSSProperties;

  return (
    <span
      className={clsx(
        styles.stamp,
        styles[tone],
        large && styles.lg,
        plain && styles.plain,
        delayMs !== undefined && styles.thunk,
      )}
      style={style}
    >
      {label}
    </span>
  );
}
