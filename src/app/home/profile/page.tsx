import { Box, Container } from "@mui/material";
import { ProfileForm } from "../profile-form";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

export default function ProfilePage() {
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title="โปรไฟล์ของฉัน"
          description="ตรวจสอบและแก้ไขข้อมูลส่วนตัวที่ใช้ในการยื่นคำขอ"
        >
          <ProfileForm />
        </SectionShell>
      </Container>
    </Box>
  );
}
