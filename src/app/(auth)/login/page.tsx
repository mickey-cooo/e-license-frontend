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
import { loginSchema, type LoginSchema } from "../../../schema/login.schema";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { fieldError } from "@/lib/helper/field-error";
import { LanguageSwitcher } from "../../components/language-switcher";

export default function LoginPage() {
  const t = useTranslations("Homepage");
  const a = useTranslations("Auth");
  const v = useTranslations("Validation");
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
          t(
            t.has(`error.${result?.error}`)
              ? `error.${result?.error}`
              : "error.somethingWentWrong",
          )
        );
      }
    } catch {
      toast.error(t("error.somethingWentWrong"));
    }
  };

  return (
    <Box component="main" className={styles.page}>
      <Paper elevation={0} className={styles.card}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", p: 1.5, pb: 0 }}
        >
          <LanguageSwitcher />
        </Box>
        <Box className={styles.authLayout}>
          <Box className={styles.showcase}>
            <Typography variant="h4" className={styles.showcaseTitle}>
              {a("welcomeBack")}
            </Typography>
            <Typography variant="body1" className={styles.showcaseDescription}>
              {a("loginLead")}
            </Typography>

            <Stack spacing={1.5} className={styles.featureList}>
              <Typography variant="body2" className={styles.featureItem}>
                {a("loginPoint1")}
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                {a("loginPoint2")}
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                {a("loginPoint3")}
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
                {a("loginTitle")}
              </Typography>
              <Typography
                variant="body2"
                className={styles.description}
                color="text.secondary"
              >
                {a("audience")}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2}>
                <TextField
                  id="email"
                  label={a("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="name@agency.go.th"
                  error={Boolean(errors.email)}
                  helperText={fieldError(v, errors.email)}
                  fullWidth
                  {...register("email")}
                />

                <TextField
                  id="password"
                  label={a("password")}
                  type="password"
                  autoComplete="current-password"
                  placeholder={a("passwordPlaceholder")}
                  error={Boolean(errors.password)}
                  helperText={fieldError(v, errors.password)}
                  fullWidth
                  {...register("password")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? a("loggingIn") : a("loginButton")}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" className={styles.panelFooter}>
              <Link href="/forgot-password" className={styles.footerLink}>
                {a("forgotLink")}
              </Link>
              {" · "}
              {a("noAccount")}{" "}
              <Link href="/register" className={styles.footerLink}>
                {a("signUp")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
