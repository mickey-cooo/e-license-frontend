"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import styles from "../page.module.scss";
import grid from "./license.module.scss";
import { useTranslations } from "next-intl";
import { merchantTypeDetails } from "./constants/license.constants";
import { LicenseAnalyzer } from "./license-analyzer";

export default function LicenseGuidePage() {
  const t = useTranslations("MerchantForm");

  const merchantTypeCards = Object.entries(merchantTypeDetails).map(
    ([value, detail]) => ({
      value,
      label: t(`merchantType.${detail.label}`),
      description: t(`merchantTypeDescription.${detail.description}`),
    }),
  );

  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <article className={styles.sheet}>

          <div className={styles.body}>
            <Typography variant="h2" component="h1" className={styles.title}>
              หน้าแนะนำใบอนุญาตประกอบกิจการ
            </Typography>
            <Typography className={styles.lead}>
              เลือกประเภทกิจการของคุณเพื่อดูหมวดใบอนุญาตที่เกี่ยวข้องได้อย่างรวดเร็ว
              โดยระบบออกแบบให้ใช้ง่าย อ่านง่าย
              และต่อยอดไปขั้นตอนสมัครผู้ประกอบการได้ทันที
            </Typography>
            <div className={styles.actions}>
              <Button
                component={Link}
                href="/home/merchant"
                variant="contained"
              >
                เริ่มลงทะเบียนผู้ประกอบการ
              </Button>
              <Button component={Link} href="/home/document" variant="outlined">
                ไปหน้าส่งเอกสาร
              </Button>
            </div>
          </div>

          <ul className={grid.types}>
            {merchantTypeCards.map((item) => (
              <li key={item.value} className={grid.type}>
                <span className={grid.tick} aria-hidden="true" />
                <div>
                  <div className={styles.stepLabel}>{item.label}</div>
                  <div className={styles.stepDesc}>{item.description}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.steps}>
            <LicenseAnalyzer />
          </div>

          <div className={styles.notes}>
            <h2 className={styles.notesTitle}>คำแนะนำก่อนยื่นคำขอ</h2>
            <ol className={grid.advice}>
              <li>เลือกประเภทกิจการหลักที่ใกล้เคียงที่สุดก่อนเริ่มลงทะเบียน</li>
              <li>เตรียมเอกสารพื้นฐานของกิจการเพื่อให้ยื่นในระบบได้ต่อเนื่อง</li>
              <li>
                หากไม่แน่ใจ ให้เลือกหมวด Other เพื่อเข้าสู่การวิเคราะห์แบบรายกรณี
              </li>
            </ol>
          </div>
        </article>
      </Container>
    </Box>
  );
}
