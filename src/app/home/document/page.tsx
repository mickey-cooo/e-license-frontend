import { Box, Container } from "@mui/material";
import { DocumentForm } from "../document-form";
import { getTranslations } from "next-intl/server";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default async function DocumentSubmitPage() {
  const t = await getTranslations("Document");
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title={t("pageTitle")}
          description={t("pageDesc")}
        >
          <DocumentForm />
        </SectionShell>
      </Container>
    </Box>
  );
}
