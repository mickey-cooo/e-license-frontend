"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  getMyMerchant,
  updateMerchant,
  type MerchantItem,
} from "@/service/merchant.service";
import { LicenseRecommendations } from "./license-recommendations";

const editable = [
  ["merchantName", "ชื่อกิจการ"],
  ["contactName", "ชื่อผู้ติดต่อ"],
  ["contactEmail", "อีเมลผู้ติดต่อ"],
  ["contactPhoneNumber", "เบอร์โทรผู้ติดต่อ"],
  ["businessAddress", "ที่อยู่กิจการ"],
] as const;

const statusText: Record<string, string> = {
  pending: "รอดำเนินการ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
};

export function MyMerchantCard({ refreshKey }: { refreshKey: number }) {
  const [merchant, setMerchant] = useState<MerchantItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    void getMyMerchant().then((result) => {
      if (!active) return;
      setLoaded(true);
      // 404 just means this user has not registered a merchant yet
      if (result.success) setMerchant(result.data);
    });
    return () => {
      active = false;
    };
  }, [refreshKey, reload]);

  if (!loaded || !merchant) return null;

  const openEdit = () => {
    setDraft(
      Object.fromEntries(
        editable.map(([key]) => [key, (merchant[key] as string | undefined) ?? ""]),
      ),
    );
    setEditing(true);
  };

  const onSave = async () => {
    setSaving(true);
    const result = await updateMerchant(merchant.uuid, draft);
    setSaving(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("บันทึกข้อมูลผู้ประกอบการสำเร็จ");
    setEditing(false);
    setReload((value) => value + 1);
  };

  const licenses =
    merchant.licenseAnalysisSnapshot?.result?.recommendedLicenses ?? [];

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Box>
          <Typography variant="h6" component="h2">
            กิจการของฉัน: {merchant.merchantName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {merchant.contactName} · {merchant.contactEmail} · {merchant.contactPhoneNumber}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={statusText[merchant.status ?? "pending"] ?? merchant.status} />
          <Button variant="outlined" onClick={openEdit}>
            แก้ไขข้อมูล
          </Button>
        </Stack>
      </Stack>
      {merchant.remark ? (
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          หมายเหตุจากผู้ตรวจ: {merchant.remark}
        </Typography>
      ) : null}
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        ใบอนุญาตที่ต้องใช้
      </Typography>
      <LicenseRecommendations licenses={licenses} />

      <Dialog open={editing} onClose={() => !saving && setEditing(false)} fullWidth maxWidth="sm">
        <DialogTitle>แก้ไขข้อมูลผู้ประกอบการ</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {editable.map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                value={draft[key] ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, [key]: event.target.value }))
                }
                fullWidth
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(false)} disabled={saving}>
            ยกเลิก
          </Button>
          <Button variant="contained" onClick={() => void onSave()} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
