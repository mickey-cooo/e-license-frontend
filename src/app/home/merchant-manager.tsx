"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { LicenseRecommendations } from "./license-recommendations";
import {
  deleteMerchant,
  getMerchantById,
  getMerchants,
  reviewMerchant,
  type MerchantItem,
} from "@/service/merchant.service";

type ReviewStatus = "approved" | "rejected";

const statusOptions = [
  { value: "", label: "ทั้งหมด" },
  { value: "pending", label: "รอดำเนินการ" },
  { value: "approved", label: "อนุมัติแล้ว" },
  { value: "rejected", label: "ไม่อนุมัติ" },
] as const;

function getStatusLabel(status?: string) {
  if (status === "approved") return "อนุมัติแล้ว";
  if (status === "rejected") return "ไม่อนุมัติ";
  return "รอดำเนินการ";
}

function getStatusColor(
  status?: string,
): "default" | "success" | "error" | "warning" {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  return "warning";
}

export function MerchantManager() {
  const compactTextFieldSx = { "& .MuiInputBase-root": { fontSize: 14 } };
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(
    null,
  );
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("approved");
  const [remark, setRemark] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [details, setDetails] = useState<MerchantItem | null>(null);

  const loadMerchants = useCallback(async () => {
    setLoading(true);
    const result = await getMerchants({
      search: search || undefined,
      status: status || undefined,
    });
    setLoading(false);

    if (!result.success) {
      toast.error(result.message ?? "ไม่สามารถโหลดรายการ Merchant ได้");
      return;
    }
    setMerchants(result.data);
  }, [search, status]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void loadMerchants();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [loadMerchants]);

  const openReviewDialog = (merchant: MerchantItem) => {
    setSelectedMerchant(merchant);
    setReviewStatus("approved");
    setRemark(merchant.remark ?? "");
    setDetails(null);
    void getMerchantById(merchant.uuid).then((result) => {
      if (result.success) setDetails(result.data);
    });
  };

  const closeReviewDialog = () => {
    if (submittingReview) return;
    setSelectedMerchant(null);
    setReviewStatus("approved");
    setRemark("");
  };

  const handleReview = async () => {
    if (!selectedMerchant?.uuid) return;
    setSubmittingReview(true);
    const result = await reviewMerchant(selectedMerchant.uuid, {
      status: reviewStatus,
      remark: remark || undefined,
    });
    setSubmittingReview(false);

    if (!result.success) {
      toast.error(result.message ?? "ไม่สามารถอัปเดตสถานะ Merchant ได้");
      return;
    }
    toast.success("อัปเดตสถานะ Merchant สำเร็จ");
    closeReviewDialog();
    await loadMerchants();
  };

  const handleDelete = async (merchant: MerchantItem) => {
    if (!merchant.uuid) return;
    const isConfirmed = window.confirm(
      `ยืนยันการลบ Merchant: ${merchant.merchantName}`,
    );
    if (!isConfirmed) return;

    const result = await deleteMerchant(merchant.uuid);
    if (!result.success) {
      toast.error(result.message ?? "ไม่สามารถลบ Merchant ได้");
      return;
    }
    toast.success("ลบ Merchant สำเร็จ");
    await loadMerchants();
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label="ค้นหา (ชื่อกิจการ/อีเมล)"
          size="small"
          margin="dense"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
          sx={compactTextFieldSx}
        />
        <TextField
          select
          label="สถานะ"
          size="small"
          margin="dense"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ ...compactTextFieldSx, minWidth: { xs: "100%", md: 200 } }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={() => void loadMerchants()}
          disabled={loading}
        >
          {loading ? "กำลังโหลด..." : "รีเฟรช"}
        </Button>
      </Stack>

      {merchants.length === 0 && !loading ? (
        <Alert severity="info">
          ยังไม่มีข้อมูล Merchant ตามเงื่อนไขที่เลือก
        </Alert>
      ) : null}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ชื่อกิจการ</TableCell>
              <TableCell>ผู้ติดต่อ</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="right">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant.uuid}>
                <TableCell>
                  <Typography fontWeight={700}>
                    {merchant.merchantName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {merchant.businessRegistrationNumber || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{merchant.contactName || "-"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {merchant.contactEmail || "-"}
                  </Typography>
                </TableCell>
                <TableCell>{merchant.merchantType || "-"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={getStatusLabel(merchant.status)}
                    color={getStatusColor(merchant.status)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      onClick={() => openReviewDialog(merchant)}
                    >
                      รีวิว
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => void handleDelete(merchant)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selectedMerchant)}
        onClose={closeReviewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>รีวิว Merchant</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography fontWeight={700}>
                {selectedMerchant?.merchantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMerchant?.contactEmail ?? "-"}
              </Typography>
            </Box>
            {details?.licenseAnalysisSnapshot?.result?.recommendedLicenses ? (
              <Box>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  ใบอนุญาตที่ระบบวิเคราะห์ไว้
                </Typography>
                <LicenseRecommendations
                  licenses={
                    details.licenseAnalysisSnapshot.result.recommendedLicenses
                  }
                />
              </Box>
            ) : null}
            <TextField
              select
              label="ผลการพิจารณา"
              size="small"
              margin="dense"
              value={reviewStatus}
              onChange={(event) =>
                setReviewStatus(event.target.value as ReviewStatus)
              }
              fullWidth
              sx={compactTextFieldSx}
            >
              <MenuItem value="approved">อนุมัติ</MenuItem>
              <MenuItem value="rejected">ไม่อนุมัติ</MenuItem>
            </TextField>
            <TextField
              label="หมายเหตุ (ถ้ามี)"
              size="small"
              margin="dense"
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
              fullWidth
              sx={compactTextFieldSx}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog} disabled={submittingReview}>
            ยกเลิก
          </Button>
          <Button
            onClick={() => void handleReview()}
            variant="contained"
            disabled={submittingReview}
          >
            {submittingReview ? "กำลังบันทึก..." : "บันทึกผลรีวิว"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
