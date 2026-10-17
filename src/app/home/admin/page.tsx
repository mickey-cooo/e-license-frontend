"use client";

import { useState } from "react";
import { Alert, Box, Container, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRole } from "@/lib/helper/use-is-admin";
import { MerchantManager } from "../merchant-manager";
import { SectionShell } from "../section-shell";
import { UserManager } from "../user-manager";
import styles from "../page.module.scss";

export default function AdminPage() {
  const t = useTranslations("Admin");
  const { ready, isAdmin } = useRole();
  const [tab, setTab] = useState(0);

  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title={t("title")}
          description={t("desc")}
        >
          {!ready ? null : !isAdmin ? (
            <Alert severity="warning">{t("adminsOnly")}</Alert>
          ) : (
            <>
              <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
                <Tab label={t("tabMerchants")} />
                <Tab label={t("tabUsers")} />
              </Tabs>
              {tab === 0 ? <MerchantManager /> : <UserManager />}
            </>
          )}
        </SectionShell>
      </Container>
    </Box>
  );
}
