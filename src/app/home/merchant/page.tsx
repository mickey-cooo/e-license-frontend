"use client";

import { Box, Container } from "@mui/material";
import { MerchantForm } from "../merchant-form";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";
import { useTranslations } from "next-intl";

export default function MerchantRegisterPage() {
  const t = useTranslations("MerchantForm");
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell title={t("register")} description={t("description")}>
          <MerchantForm />
        </SectionShell>
      </Container>
    </Box>
  );
}
