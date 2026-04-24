import { Box, Container } from "@mui/material";
import { DocumentForm } from "../document-form";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default function DocumentSubmitPage() {
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title="ส่งเอกสาร"
          description="แนบรายละเอียดและ URL เอกสารเพื่อส่งเข้าระบบตรวจสอบ"
        >
          <DocumentForm />
        </SectionShell>
      </Container>
    </Box>
  );
}
