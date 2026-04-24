import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import NotificationImportantRoundedIcon from "@mui/icons-material/NotificationImportantRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { SectionShell } from "../section-shell";
import styles from "../page.module.scss";

const highlights = [
  {
    icon: <DashboardRoundedIcon fontSize="small" />,
    label: "ภาพรวมสถานะคำขอ",
  },
  {
    icon: <InsightsRoundedIcon fontSize="small" />,
    label: "ติดตามเอกสารแบบเรียลไทม์",
  },
  {
    icon: <NotificationImportantRoundedIcon fontSize="small" />,
    label: "รวมแจ้งเตือนสำคัญในหน้าเดียว",
  },
] as const;

const mockSummary = [
  { label: "คำขอทั้งหมด", value: 128, color: "#0d47a1" },
  { label: "อนุมัติแล้ว", value: 84, color: "#2e7d32" },
  { label: "รอตรวจเอกสาร", value: 31, color: "#ed6c02" },
  { label: "ต้องแก้ไข", value: 13, color: "#d32f2f" },
] as const;

const mockAgencyStatus = [
  { agency: "กรมพัฒนาธุรกิจการค้า", progress: 88, done: 44, total: 50 },
  { agency: "กรมสรรพากร", progress: 72, done: 36, total: 50 },
  { agency: "สำนักงานเขต", progress: 56, done: 28, total: 50 },
] as const;

const mockLatestRequests = [
  {
    requestNo: "EL-2026-00419",
    merchant: "BlueWave Hotel",
    status: "รอตรวจเอกสาร",
  },
  {
    requestNo: "EL-2026-00417",
    merchant: "Sunrise Stay",
    status: "อนุมัติแล้ว",
  },
  {
    requestNo: "EL-2026-00411",
    merchant: "Moonlight Residence",
    status: "ต้องแก้ไขข้อมูล",
  },
  {
    requestNo: "EL-2026-00403",
    merchant: "Seaside Resort",
    status: "กำลังพิจารณา",
  },
] as const;

export default function DashboardPage() {
  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <Stack spacing={2.5}>
          <SectionShell
            title="Dashboard ติดตามสถานะ"
            description="รวมการติดตามความคืบหน้าของใบอนุญาตและเอกสารไว้ในหน้าเดียว เพื่อให้ผู้ประกอบการตรวจสอบได้สะดวกขึ้น"
          >
            <Stack
              direction="row"
              gap={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2.5 }}
            >
              {highlights.map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  variant="outlined"
                />
              ))}
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={1.5}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2.5 }}
            >
              {mockSummary.map((item) => (
                <Paper
                  key={item.label}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    flex: "1 1 220px",
                    minWidth: { xs: "100%", md: "220px" },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.75 }}
                  >
                    <TrendingUpRoundedIcon
                      sx={{ color: item.color }}
                      fontSize="small"
                    />
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: item.color }}
                    >
                      {item.value}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Stack spacing={1.25}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                ความคืบหน้าแยกตามหน่วยงาน
              </Typography>
              {mockAgencyStatus.map((item) => (
                <Paper
                  key={item.agency}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2.5 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    sx={{ mb: 0.75 }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.agency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.done}/{item.total} คำขอ
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{ height: 8, borderRadius: 99 }}
                  />
                </Paper>
              ))}
            </Stack>
          </SectionShell>

          <SectionShell
            title="คำขอล่าสุด (Mock Data)"
            description="รายการคำขอล่าสุดสำหรับติดตามสถานะอย่างรวดเร็ว"
          >
            <Stack spacing={1.25}>
              {mockLatestRequests.map((item) => (
                <Paper
                  key={item.requestNo}
                  variant="outlined"
                  sx={{ p: 1.75, borderRadius: 2.5, backgroundColor: "#fff" }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={0.5}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.requestNo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ผู้ประกอบการ: {item.merchant}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionShell>
        </Stack>
      </Container>
    </Box>
  );
}
