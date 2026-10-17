import { Box, Container } from "@mui/material";
import { ProfileForm } from "../profile-form";
import { getTranslations } from "next-intl/server";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title={t("pageTitle")}
          description={t("pageDesc")}
        >
          <ProfileForm />
        </SectionShell>
      </Container>
    </Box>
  );
}
