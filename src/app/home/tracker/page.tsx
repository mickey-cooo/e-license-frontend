import { Box, Container } from "@mui/material";
import { DocumentTracker } from "../document-tracker";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default function DocumentTrackerPage() {
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title="ติดตามเอกสาร"
          description="ค้นหาเอกสารและตรวจสอบสถานะล่าสุดได้แบบเรียลไทม์"
        >
          <DocumentTracker />
        </SectionShell>
      </Container>
    </Box>
  );
}
