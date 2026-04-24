"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import styles from "./page.module.scss";

const serviceItems = [
  {
    title: "ยื่นขอใบอนุญาตในระบบเดียว",
    description: "ยื่นคำขอหลายหน่วยงานผ่าน e-Licensing ลดการยื่นซ้ำหลายรอบ",
    href: undefined,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "แนะนำใบอนุญาต",
    description:
      "วิเคราะห์ประเภทกิจการเพื่อแนะนำใบอนุญาตที่ต้องขออย่างเป็นขั้นตอน",
    href: "/home/license",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Dashboard ติดตามสถานะ",
    description:
      "ตรวจสอบความคืบหน้าและรับแจ้งเตือนในจุดเดียว ลดการโทรติดตามด้วยตนเอง",
    href: "/home/dashboard",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

const quickActions = [
  {
    label: "ดูแนะนำใบอนุญาต",
    description: "ตรวจสอบประเภทกิจการทั้งหมด เพื่อเลือกแนวทางยื่นใบอนุญาตให้ตรงหมวด",
    href: "/home/license",
    icon: <FactCheckRoundedIcon fontSize="small" />,
  },
  {
    label: "ลงทะเบียนผู้ประกอบการ",
    description: "เริ่มต้นด้วยการยืนยันตัวตนและสร้างข้อมูลผู้ประกอบการในระบบ",
    href: "/home/merchant",
    icon: <StorefrontRoundedIcon fontSize="small" />,
  },
  {
    label: "อัปโหลดเอกสารคำขอ",
    description:
      "แนบเอกสารประกอบที่จำเป็น เพื่อลดความซ้ำซ้อนในการยื่นหลายหน่วยงาน",
    href: "/home/document",
    icon: <DescriptionRoundedIcon fontSize="small" />,
  },
  {
    label: "ติดตามผลการพิจารณา",
    description: "ติดตามสถานะคำขอทุกใบอนุญาตแบบรวมศูนย์ผ่าน Dashboard",
    href: "/home/tracker",
    icon: <ManageSearchRoundedIcon fontSize="small" />,
  },
] as const;

const infoItems = [
  "เช็กใบอนุญาตที่ต้องใช้ให้ครบก่อนยื่นคำขอ เพื่อลดการส่งเอกสารซ้ำ",
  "อัปโหลดเอกสารครั้งเดียว แล้วติดตามสถานะได้จากหน้า Dashboard",
  "หากบางขั้นตอนยังต้องใช้เอกสารจริง ระบบจะแจ้งขั้นตอนต่อไปให้ชัดเจน",
  "ต้องการความช่วยเหลือ สามารถเริ่มจากเมนูลงทะเบียนและทำตามลำดับทีละขั้น",
] as const;

export default function HomePage() {
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <Stack spacing={4}>
          <Paper elevation={0} className={styles.hero} variant="outlined">
            <Box className={styles.heroOverlay}>
              <Chip
                label="Digital Platform for Hotel Licensing"
                color="primary"
                variant="outlined"
                sx={{ width: "fit-content", borderRadius: 999, mb: 2 }}
              />
              <Typography variant="h3" className={styles.heroTitle}>
                ระบบการขอใบอนุญาตประกอบธุรกิจโรงแรม
              </Typography>
              <Typography
                color="text.secondary"
                className={styles.heroDescription}
              >
                ศูนย์กลางการยื่นคำขอใบอนุญาตที่ช่วยลดเอกสารซ้ำซ้อน
                จัดลำดับขั้นตอนให้ชัดเจน และติดตามความคืบหน้าได้ในที่เดียว
              </Typography>
              <Button
                component={Link}
                href="/home/merchant"
                variant="contained"
                sx={{
                  width: "fit-content",
                  borderRadius: 999,
                  textTransform: "none",
                  mt: 1,
                }}
              >
                เริ่มลงทะเบียนคำขอ
              </Button>
            </Box>
          </Paper>

          <Box>
            <Typography variant="h5" className={styles.sectionTitle}>
              ฟีเจอร์หลักของระบบ
            </Typography>
            <Box className={styles.serviceGrid}>
              {serviceItems.map((item) => (
                <Card
                  key={item.title}
                  elevation={0}
                  variant="outlined"
                  className={styles.serviceCard}
                  component={item.href ? Link : "div"}
                  href={item.href}
                  sx={
                    item.href
                      ? {
                          textDecoration: "none",
                          color: "inherit",
                          cursor: "pointer",
                          transition: "all 180ms ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 18px rgba(13, 71, 161, 0.10)",
                          },
                        }
                      : undefined
                  }
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" className={styles.sectionTitle}>
              ขั้นตอนการใช้งาน
            </Typography>
            <Stack spacing={2}>
              {quickActions.map((item) => (
                <Paper
                  key={item.href}
                  elevation={0}
                  className={styles.tabsCard}
                  variant="outlined"
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    sx={{ p: { xs: 2, md: 2.5 } }}
                  >
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.icon}
                        <Typography fontWeight={700}>{item.label}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Stack>
                    <Button
                      component={Link}
                      href={item.href}
                      variant="contained"
                      sx={{ borderRadius: 999, textTransform: "none" }}
                    >
                      ดำเนินการ
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Paper
            elevation={0}
            variant="outlined"
            className={styles.newsSection}
          >
            <Typography variant="h5" className={styles.sectionTitle}>
              ข้อมูลที่ควรรู้ก่อนเริ่มใช้งาน
            </Typography>
            <Stack spacing={1.25} mt={1}>
              {infoItems.map((item) => (
                <Box key={item}>
                  <Typography>{item}</Typography>
                  <Divider sx={{ mt: 1.25 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
