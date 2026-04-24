"use client";

import Link from "next/link";
import {
  ArrowForwardRounded,
  AutoAwesomeRounded,
  BusinessRounded,
  ChecklistRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import styles from "../page.module.scss";
import { useTranslations } from "next-intl";
import { merchantTypeDetails } from "./constants/license.constants";

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
        <Stack spacing={3}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              borderRadius: 4,
              p: { xs: 2.5, md: 4 },
              borderColor: "primary.light",
              background:
                "linear-gradient(120deg, rgba(30,136,229,0.08), rgba(242,182,50,0.08))",
            }}
          >
            <Chip
              label="License Discovery"
              color="primary"
              variant="outlined"
              icon={<AutoAwesomeRounded />}
              sx={{ borderRadius: 999, mb: 1.5 }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "primary.dark" }}
            >
              หน้าแนะนำใบอนุญาตประกอบกิจการ
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 860, mt: 1 }}>
              เลือกประเภทกิจการของคุณเพื่อดูหมวดใบอนุญาตที่เกี่ยวข้องได้อย่างรวดเร็ว
              โดยระบบออกแบบให้ใช้ง่าย อ่านง่าย
              และต่อยอดไปขั้นตอนสมัครผู้ประกอบการได้ทันที
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              mt={2.5}
            >
              <Button
                component={Link}
                href="/home/merchant"
                variant="contained"
                endIcon={<ArrowForwardRounded />}
                sx={{ borderRadius: 999, width: "fit-content" }}
              >
                เริ่มลงทะเบียนผู้ประกอบการ
              </Button>
              <Button
                component={Link}
                href="/home/document"
                variant="outlined"
                sx={{ borderRadius: 999, width: "fit-content" }}
              >
                ไปหน้าส่งเอกสาร
              </Button>
            </Stack>
          </Paper>

          <Grid container spacing={2}>
            {merchantTypeCards.map((item, index) => (
              <Grid key={item.value} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    borderRadius: 3,
                    height: "100%",
                    borderColor: "divider",
                    transition: "all 180ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "primary.light",
                      boxShadow: "0 8px 20px rgba(13,71,161,0.10)",
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessRounded color="primary" fontSize="small" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={700}
                      >
                        ประเภทที่ {index + 1}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 800 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            variant="outlined"
            sx={{ borderRadius: 3, p: { xs: 2, md: 2.5 } }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ChecklistRounded color="primary" />
              <Typography sx={{ fontWeight: 700 }}>
                คำแนะนำก่อนยื่นคำขอ
              </Typography>
            </Stack>
            <Stack spacing={0.75}>
              <Typography variant="body2" color="text.secondary">
                1) เลือกประเภทกิจการหลักที่ใกล้เคียงที่สุดก่อนเริ่มลงทะเบียน
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2) เตรียมเอกสารพื้นฐานของกิจการเพื่อให้ยื่นในระบบได้ต่อเนื่อง
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3) หากไม่แน่ใจ ให้เลือกหมวด Other
                เพื่อเข้าสู่การวิเคราะห์แบบรายกรณี
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
