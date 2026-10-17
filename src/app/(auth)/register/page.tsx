"use client";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./page.module.scss";
import {
  registerSchema,
  type RegisterSchema,
} from "../../../schema/register.schema";
import Link from "next/link";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    console.log("register payload:", values);
  };

  return (
    <Box component="main" className={styles.page}>
      <Paper elevation={0} className={styles.card}>
        <Box className={styles.authLayout}>
          <Box className={styles.showcase}>
            <Typography variant="h4" className={styles.showcaseTitle}>
              เริ่มต้นใช้งานภายในไม่กี่นาที
            </Typography>
            <Typography variant="body1" className={styles.showcaseDescription}>
              สร้างบัญชีเพื่อส่งคำขอใบอนุญาต ตรวจสอบสถานะ และรับการแจ้งเตือนสำคัญได้ทันที
            </Typography>

            <Stack spacing={1.5} className={styles.featureList}>
              <Typography variant="body2" className={styles.featureItem}>
                สมัครใช้งานง่ายและปลอดภัย
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                รองรับการยืนยันตัวตนตามมาตรฐาน
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                จัดเก็บประวัติคำขอเป็นระบบ
              </Typography>
            </Stack>
          </Box>

          <Box className={styles.formPanel}>
            <Box className={styles.header}>
              <Typography
                variant="h5"
                className={styles.title}
                color="text.primary"
              >
                สมัครสมาชิกเพื่อขอใบอนุญาตประกอบธุรกิจทุกประเภท
              </Typography>
              <Typography
                variant="body2"
                className={styles.description}
                color="text.secondary"
              >
                สำหรับเจ้าหน้าที่ภาครัฐและผู้ยื่นคำขอ
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2}>
                <TextField
                  id="email"
                  label="อีเมล"
                  type="email"
                  autoComplete="email"
                  placeholder="name@agency.go.th"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  fullWidth
                  {...register("email")}
                />

                <TextField
                  id="password"
                  label="รหัสผ่าน"
                  type="password"
                  autoComplete="new-password"
                  placeholder="กรอกรหัสผ่าน"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  fullWidth
                  {...register("password")}
                />

                <TextField
                  id="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  autoComplete="new-password"
                  placeholder="กรอกยืนยันรหัสผ่าน"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                  {...register("confirmPassword")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" className={styles.panelFooter}>
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className={styles.footerLink}>
                เข้าสู่ระบบ
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
