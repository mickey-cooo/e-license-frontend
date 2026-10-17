"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { useRole } from "@/lib/helper/use-is-admin";
import styles from "./top-navbar.module.scss";

const navItems = [
  { href: "/home", label: "navHome" },
  { href: "/home/license", label: "navLicense" },
  { href: "/home/merchant", label: "navMerchant" },
  { href: "/home/document", label: "navDocument" },
  { href: "/home/tracker", label: "navTracker" },
  { href: "/home/dashboard", label: "navDashboard" },
  { href: "/home/profile", label: "navProfile" },
] as const;

export function TopNavbar() {
  const pathname = usePathname();
  const t = useTranslations("Common");
  const { isAdmin, authenticated, ready } = useRole();

  if (
    ["/login", "/register", "/forgot-password", "/reset-password"].includes(
      pathname
    )
  ) {
    return null;
  }

  const items = !authenticated
    ? []
    : isAdmin
    ? [...navItems, { href: "/home/admin", label: "navAdmin" as const }]
    : navItems;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Link href="/home" className={styles.brand}>
            <span className={styles.brandName}>e-Licensing</span>
            <span className={styles.brandSub}>{t("formTitle")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <nav aria-label={t("mainMenu")} className={styles.cells}>
          {items.map((item) => {
            const active =
              item.href === "/home"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(styles.cell, active && styles.active)}
              >
                {t(item.label)}
              </Link>
            );
          })}
          {authenticated ? (
            <button
              type="button"
              className={styles.cell}
              onClick={() => void handleLogout()}
            >
              {t("logout")}
            </button>
          ) : ready ? (
            <Link href="/login" className={styles.cell}>
              {t("login")}
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
