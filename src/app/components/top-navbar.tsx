"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

const navItems = [
  { href: "/home", label: "หน้าแรก" },
  { href: "/home/merchant", label: "สมัครผู้ประกอบการ" },
  { href: "/home/document", label: "ส่งเอกสาร" },
  { href: "/home/tracker", label: "ติดตามเอกสาร" },
] as const;

export function TopNavbar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ flexGrow: 1 }}>
            <Link href="/home">e-Licensing</Link>
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                variant="text"
                color="inherit"
                disableRipple
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    transform: "translateY(-4px)",
                    transition: "transform 0.2s ease",
                  },
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {item.label}
                </Typography>
              </Button>
            ))}
          </Box>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => void handleLogout()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              ml: "auto",
              flexShrink: 0,
            }}
          >
            ออกจากระบบ
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
