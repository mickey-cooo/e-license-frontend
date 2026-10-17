"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  createUser,
  deleteUser,
  listUsers,
  type UserItem,
} from "@/service/user-profile.service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const blank = {
  nameTh: "", nameEn: "", lastNameTh: "", lastNameEn: "", phoneNumber: "",
  province: "", district: "", subDistrict: "", postalCode: "", detail: "",
};

const createFields: [keyof typeof blank, string][] = [
  ["nameTh", "ชื่อ (ไทย)"], ["nameEn", "ชื่อ (อังกฤษ)"],
  ["lastNameTh", "นามสกุล (ไทย)"], ["lastNameEn", "นามสกุล (อังกฤษ)"],
  ["phoneNumber", "เบอร์โทรศัพท์"], ["province", "จังหวัด"],
  ["district", "อำเภอ/เขต"], ["subDistrict", "ตำบล/แขวง"],
  ["postalCode", "รหัสไปรษณีย์"], ["detail", "ที่อยู่เพิ่มเติม"],
];

export function UserManager() {
  const [idsText, setIdsText] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);

  const onLookup = async () => {
    const ids = idsText.split(/[\s,]+/).filter(Boolean);
    if (ids.length === 0 || ids.some((id) => !UUID.test(id))) {
      toast.error("กรอก UUID ของผู้ใช้ให้ถูกต้อง (คั่นด้วยเว้นวรรคหรือจุลภาค)");
      return;
    }
    setLoading(true);
    const result = await listUsers(ids);
    setLoading(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setUsers(result.data);
  };

  const onDelete = async (user: UserItem) => {
    if (!window.confirm(`ยืนยันการลบผู้ใช้: ${user.email}`)) return;
    const result = await deleteUser(user.uuid);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("ลบผู้ใช้สำเร็จ");
    setUsers((prev) => prev.filter((item) => item.uuid !== user.uuid));
  };

  const onCreate = async () => {
    const result = await createUser({
      name: { th: form.nameTh, en: form.nameEn },
      lastName: { th: form.lastNameTh, en: form.lastNameEn },
      phoneNumber: form.phoneNumber,
      addressDetail: {
        province: form.province,
        district: form.district,
        subDistrict: form.subDistrict,
        postalCode: form.postalCode,
        detail: form.detail,
      },
    });
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("สร้างผู้ใช้สำเร็จ");
    setCreating(false);
    setForm(blank);
  };

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        ระบบค้นหาผู้ใช้ด้วย UUID เท่านั้น (ไม่มีรายการผู้ใช้ทั้งหมด)
      </Alert>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label="UUID ผู้ใช้ (หลายรายการได้)"
          value={idsText}
          onChange={(event) => setIdsText(event.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => void onLookup()} disabled={loading}>
          {loading ? "กำลังค้นหา..." : "ค้นหา"}
        </Button>
        <Button variant="outlined" onClick={() => setCreating(true)}>
          สร้างผู้ใช้
        </Button>
      </Stack>

      {users.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>อีเมล</TableCell>
              <TableCell>ชื่อ</TableCell>
              <TableCell>เบอร์โทร</TableCell>
              <TableCell align="right">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uuid}>
                <TableCell>
                  <Typography fontWeight={700}>{user.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.uuid}
                  </Typography>
                </TableCell>
                <TableCell>
                  {user.name ? `${user.name.th} ${user.lastName?.th ?? ""}` : "-"}
                </TableCell>
                <TableCell>{user.phoneNumber ?? "-"}</TableCell>
                <TableCell align="right">
                  <Button size="small" color="error" onClick={() => void onDelete(user)}>
                    ลบ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      <Dialog open={creating} onClose={() => setCreating(false)} fullWidth maxWidth="sm">
        <DialogTitle>สร้างผู้ใช้</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {createFields.map(([key, label]) => (
              <Grid key={key} size={{ xs: 12, md: 6 }}>
                <TextField
                  label={label}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [key]: event.target.value }))
                  }
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={() => void onCreate()}>
            สร้าง
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
