"use client";

import { useState } from "react";
import { Alert, Box, Container, Tab, Tabs } from "@mui/material";
import { useRole } from "@/lib/helper/use-is-admin";
import { MerchantManager } from "../merchant-manager";
import { SectionShell } from "../section-shell";
import { UserManager } from "../user-manager";
import styles from "../page.module.scss";

export default function AdminPage() {
  const { ready, isAdmin } = useRole();
  const [tab, setTab] = useState(0);

  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <SectionShell
          title="จัดการระบบ"
          description="สำหรับผู้ดูแลระบบ: พิจารณาผู้ประกอบการ และจัดการผู้ใช้ (การส่งต่อและเปลี่ยนสถานะเอกสารอยู่ในหน้าติดตามเอกสาร)"
        >
          {!ready ? null : !isAdmin ? (
            <Alert severity="warning">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</Alert>
          ) : (
            <>
              <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
                <Tab label="ผู้ประกอบการ" />
                <Tab label="ผู้ใช้" />
              </Tabs>
              {tab === 0 ? <MerchantManager /> : <UserManager />}
            </>
          )}
        </SectionShell>
      </Container>
    </Box>
  );
}
