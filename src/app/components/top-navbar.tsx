"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRole } from "@/lib/helper/use-is-admin";
import styles from "./top-navbar.module.scss";

const navItems = [
  { href: "/home", label: "หน้าแรก" },
  { href: "/home/license", label: "แนะนำใบอนุญาต" },
  { href: "/home/merchant", label: "สมัครผู้ประกอบการ" },
  { href: "/home/document", label: "ส่งเอกสาร" },
  { href: "/home/tracker", label: "ติดตามเอกสาร" },
  { href: "/home/dashboard", label: "แดชบอร์ด" },
  { href: "/home/profile", label: "โปรไฟล์" },
] as const;

export function TopNavbar() {
  const pathname = usePathname();
  const { isAdmin, authenticated, ready } = useRole();

  if (
    ["/login", "/register", "/forgot-password", "/reset-password"].includes(
      pathname,
    )
  ) {
    return null;
  }

  const items = !authenticated
    ? []
    : isAdmin
    ? [...navItems, { href: "/home/admin", label: "จัดการระบบ" }]
    : navItems;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/home" className={styles.brand}>
          <span className={styles.brandName}>e-Licensing</span>
          <span className={styles.brandSub}>แบบคำขอใบอนุญาต</span>
        </Link>
        <nav aria-label="เมนูหลัก" className={styles.cells}>
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
                {item.label}
              </Link>
            );
          })}
          {authenticated ? (
            <button
              type="button"
              className={styles.cell}
              onClick={() => void handleLogout()}
            >
              ออกจากระบบ
            </button>
          ) : ready ? (
            <Link href="/login" className={styles.cell}>
              เข้าสู่ระบบ
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
