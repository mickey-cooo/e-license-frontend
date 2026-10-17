"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { resetPassword } from "@/service/user.service";
import { LanguageSwitcher } from "../../components/language-switcher";
import styles from "../login/page.module.scss";

function ResetPasswordForm() {
  const a = useTranslations("Auth");
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const mismatch =
    confirmNewPassword !== "" && newPassword !== confirmNewPassword;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await resetPassword({
      token,
      newPassword,
      confirmNewPassword,
    });
    setSaving(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(a("resetSuccess"));
    router.replace("/login");
  };

  if (!token) {
    return <Alert severity="error">{a("badLink")}</Alert>;
  }

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          label={a("newPasswordLabel")}
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          fullWidth
          slotProps={{ htmlInput: { minLength: 8, maxLength: 72 } }}
        />
        <TextField
          label={a("confirmNewLabel")}
          type="password"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          error={mismatch}
          helperText={mismatch ? a("mismatch") : undefined}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={saving || mismatch || newPassword.length < 8}
          className={styles.submitButton}
        >
          {saving ? a("saving") : a("saveNewPassword")}
        </Button>
      </Stack>
    </Box>
  );
}

export default function ResetPasswordPage() {
  const a = useTranslations("Auth");
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
              {a("resetTitle")}
            </Typography>
          </Box>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
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
