"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { forgotPassword } from "@/service/user.service";
import { LanguageSwitcher } from "../../components/language-switcher";
import styles from "../login/page.module.scss";

export default function ForgotPasswordPage() {
  const a = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    const result = await forgotPassword(email.trim());
    setSending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setSent(true);
  };

  return (
    <Box component="main" className={styles.page}>
      <Paper elevation={0} className={styles.card} sx={{ maxWidth: 520 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", p: 1.5, pb: 0 }}
        >
          <LanguageSwitcher />
        </Box>
        <Box className={styles.formPanel}>
          <Box className={styles.header}>
            <Typography variant="h5" className={styles.title}>
              {a("forgotTitle")}
            </Typography>
            <Typography
              variant="body2"
              className={styles.description}
              color="text.secondary"
            >
              {a("forgotLead")}
            </Typography>
          </Box>

          {sent ? (
            <Typography role="status">{a("forgotSent")}</Typography>
          ) : (
            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label={a("email")}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={sending || !email}
                  className={styles.submitButton}
                >
                  {sending ? a("sending") : a("sendLink")}
                </Button>
              </Stack>
            </Box>
          )}

          <Typography variant="body2" className={styles.panelFooter}>
            <Link href="/login" className={styles.footerLink}>
              {a("backToLogin")}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
