"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useRole } from "@/lib/helper/use-is-admin";
import {
  deleteUser,
  getUser,
  updateUser,
  type UpdateUserBody,
} from "@/service/user-profile.service";

const empty = {
  nameTh: "",
  nameEn: "",
  lastNameTh: "",
  lastNameEn: "",
  phoneNumber: "",
  province: "",
  district: "",
  subDistrict: "",
  postalCode: "",
  detail: "",
};

type Values = typeof empty;

const fields: { key: keyof Values; label: string; md: number }[] = [
  { key: "nameTh", label: "ชื่อ (ไทย)", md: 6 },
  { key: "nameEn", label: "ชื่อ (อังกฤษ)", md: 6 },
  { key: "lastNameTh", label: "นามสกุล (ไทย)", md: 6 },
  { key: "lastNameEn", label: "นามสกุล (อังกฤษ)", md: 6 },
  { key: "phoneNumber", label: "เบอร์โทรศัพท์", md: 6 },
  { key: "province", label: "จังหวัด", md: 6 },
  { key: "district", label: "อำเภอ/เขต", md: 6 },
  { key: "subDistrict", label: "ตำบล/แขวง", md: 6 },
  { key: "postalCode", label: "รหัสไปรษณีย์", md: 6 },
  { key: "detail", label: "ที่อยู่เพิ่มเติม", md: 6 },
];

export function ProfileForm() {
  const { userId, ready } = useRole();
  const [email, setEmail] = useState("");
  const [values, setValues] = useState<Values>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    void getUser(userId).then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        toast.error(result.success ? "ไม่พบข้อมูลผู้ใช้" : result.message);
        return;
      }
      const user = result.data;
      setEmail(user.email);
      setValues({
        nameTh: user.name?.th ?? "",
        nameEn: user.name?.en ?? "",
        lastNameTh: user.lastName?.th ?? "",
        lastNameEn: user.lastName?.en ?? "",
        phoneNumber: user.phoneNumber ?? "",
        province: user.province ?? "",
        district: user.district ?? "",
        subDistrict: user.subDistrict ?? "",
        postalCode: user.postalCode ?? "",
        detail: user.detail ?? "",
      });
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    const addressParts = [values.province, values.district, values.subDistrict, values.postalCode];
    const hasAddress = addressParts.some(Boolean) || Boolean(values.detail);
    if (hasAddress && !addressParts.every(Boolean)) {
      toast.error("กรุณากรอกจังหวัด อำเภอ ตำบล และรหัสไปรษณีย์ให้ครบ");
      return;
    }
    const body: UpdateUserBody = {
      name: { th: values.nameTh, en: values.nameEn },
      lastName: { th: values.lastNameTh, en: values.lastNameEn },
      phoneNumber: values.phoneNumber,
      ...(hasAddress && {
        addressDetail: {
          province: values.province,
          district: values.district,
          subDistrict: values.subDistrict,
          postalCode: values.postalCode,
          detail: values.detail,
        },
      }),
    };
    setSaving(true);
    const result = await updateUser(userId, body);
    setSaving(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("บันทึกโปรไฟล์สำเร็จ");
  };

  const onDelete = async () => {
    if (!userId) return;
    if (!window.confirm("ยืนยันการลบบัญชีของคุณ การลบไม่สามารถย้อนกลับได้")) return;
    const result = await deleteUser(userId);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("ลบบัญชีแล้ว");
    await signOut({ callbackUrl: "/login" });
  };

  if (ready && !userId) {
    return <Typography>กรุณาเข้าสู่ระบบใหม่</Typography>;
  }

  return (
    <Box component="form" onSubmit={onSave}>
      <Typography sx={{ mb: 2 }} color="text.secondary">
        อีเมล: {email || "-"}
      </Typography>
      <Grid container spacing={2}>
        {fields.map(({ key, label, md }) => (
          <Grid key={key} size={{ xs: 12, md }}>
            <TextField
              label={label}
              value={values[key]}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [key]: event.target.value }))
              }
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
        </Button>
        <Button color="error" variant="outlined" onClick={() => void onDelete()}>
          ลบบัญชี
        </Button>
      </Stack>
    </Box>
  );
}
