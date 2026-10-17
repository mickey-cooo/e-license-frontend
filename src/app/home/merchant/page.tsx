"use client";

import { Box, Container } from "@mui/material";
import { MerchantForm } from "../merchant-form";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MyMerchantCard } from "../my-merchant-card";

export default function MerchantRegisterPage() {
  const t = useTranslations("MerchantForm");
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell title={t("register")} description={t("description")}>
          <MyMerchantCard refreshKey={refreshKey} />
          <MerchantForm onCreated={() => setRefreshKey((value) => value + 1)} />
        </SectionShell>
      </Container>
    </Box>
  );
}
