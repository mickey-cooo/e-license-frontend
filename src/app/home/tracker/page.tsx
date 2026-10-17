import { Box, Container } from "@mui/material";
import { DocumentTracker } from "../document-tracker";
import { getTranslations } from "next-intl/server";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default async function DocumentTrackerPage() {
  const t = await getTranslations("Document");
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title={t("trackerTitle")}
          description={t("trackerDesc")}
        >
          <DocumentTracker />
        </SectionShell>
      </Container>
    </Box>
  );
}
