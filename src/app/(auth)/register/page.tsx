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
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { signUp } from "@/service/user.service";
import { fieldError } from "@/lib/helper/field-error";
import { LanguageSwitcher } from "../../components/language-switcher";

export default function RegisterPage() {
  const a = useTranslations("Auth");
  const v = useTranslations("Validation");
  const router = useRouter();
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
    const result = await signUp(values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(a("registerSuccess"));
    router.replace("/login");
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
              {a("registerWelcome")}
            </Typography>
            <Typography variant="body1" className={styles.showcaseDescription}>
              {a("registerLead")}
            </Typography>

            <Stack spacing={1.5} className={styles.featureList}>
              <Typography variant="body2" className={styles.featureItem}>
                {a("registerPoint1")}
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                {a("registerPoint2")}
              </Typography>
              <Typography variant="body2" className={styles.featureItem}>
                {a("registerPoint3")}
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
                {a("registerTitle")}
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
                  autoComplete="new-password"
                  placeholder={a("passwordPlaceholder")}
                  error={Boolean(errors.password)}
                  helperText={fieldError(v, errors.password)}
                  fullWidth
                  {...register("password")}
                />

                <TextField
                  id="confirmPassword"
                  label={a("confirmPassword")}
                  type="password"
                  autoComplete="new-password"
                  placeholder={a("confirmPlaceholder")}
                  error={Boolean(errors.confirmPassword)}
                  helperText={fieldError(v, errors.confirmPassword)}
                  fullWidth
                  {...register("confirmPassword")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? a("registering") : a("signUp")}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" className={styles.panelFooter}>
              {a("haveAccount")}{" "}
              <Link href="/login" className={styles.footerLink}>
                {a("loginButton")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
