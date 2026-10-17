"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { resetPassword } from "@/service/user.service";
import styles from "../login/page.module.scss";

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const mismatch = confirmNewPassword !== "" && newPassword !== confirmNewPassword;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await resetPassword({ token, newPassword, confirmNewPassword });
    setSaving(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ");
    router.replace("/login");
  };

  if (!token) {
    return <Alert severity="error">ลิงก์ไม่ถูกต้อง กรุณาขอลิงก์ตั้งรหัสผ่านใหม่อีกครั้ง</Alert>;
  }

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          label="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          fullWidth
          slotProps={{ htmlInput: { minLength: 8, maxLength: 72 } }}
        />
        <TextField
          label="ยืนยันรหัสผ่านใหม่"
          type="password"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          error={mismatch}
          helperText={mismatch ? "รหัสผ่านไม่ตรงกัน" : undefined}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={saving || mismatch || newPassword.length < 8}
          className={styles.submitButton}
        >
          {saving ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </Button>
      </Stack>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box component="main" className={styles.page}>
      <Paper elevation={0} className={styles.card} sx={{ maxWidth: 520 }}>
        <Box className={styles.formPanel}>
          <Box className={styles.header}>
            <Typography variant="h5" className={styles.title}>
              ตั้งรหัสผ่านใหม่
            </Typography>
          </Box>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
          <Typography variant="body2" className={styles.panelFooter}>
            <Link href="/login" className={styles.footerLink}>
              กลับไปเข้าสู่ระบบ
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
