"use client";

import {
  Chip,
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
import { loginSchema, type LoginSchema } from "../../../schema/login.schema";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function LoginPage() {
  const t = useTranslations("Homepage");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.ok) {
        toast.success(t("success.login"));
        router.replace(DEFAULT_LOGIN_REDIRECT);
      } else {
        toast.error(
          t(`error.${result?.error}`, {
            defaultValue: t("error.somethingWentWrong"),
          }),
        );
      }
    } catch {
      toast.error(t("error.somethingWentWrong"));
    }
  };

  return (
    <Box component="main" className={styles.page}>
      <Paper elevation={0} className={styles.card}>
        <Box className={styles.authLayout}>
          <Box className={styles.showcase}>
            <Chip
              label="e-Licensing Platform"
              size="small"
              className={styles.badge}
            />
            <Typography variant="h4" className={styles.showcaseTitle}>
              ยินดีต้อนรับกลับ
            </Typography>
            <Typography variant="body1" className={styles.showcaseDescription}>
              จัดการคำขอใบอนุญาตได้รวดเร็ว ปลอดภัย และติดตามสถานะได้แบบเรียลไทม์
            </Typography>

            <Stack spacing={1.5} className={styles.featureList}>
              <Typography variant="body2" className={styles.featureItem}>
                ติดตามคำขอได้ทุกขั้นตอน
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                ลดเวลาตรวจสอบเอกสาร
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                รองรับการใช้งานหลายหน่วยงาน
              </Typography>
            </Stack>
          </Box>

          <Box className={styles.formPanel}>
            <Box className={styles.header}>
              <Typography
                variant="body2"
                className={styles.subtitle}
                color="text.secondary"
              >
                ระบบ e-Licensing
              </Typography>
              <Typography
                variant="h5"
                className={styles.title}
                color="text.primary"
              >
                เข้าสู่ระบบขอใบอนุญาตประกอบธุรกิจโรงแรม
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
                  autoComplete="current-password"
                  placeholder="กรอกรหัสผ่าน"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  fullWidth
                  {...register("password")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" className={styles.panelFooter}>
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className={styles.footerLink}>
                สมัครสมาชิก
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
