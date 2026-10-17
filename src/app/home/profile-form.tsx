"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
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

// each field's label is the Person message with the same key
const fields = Object.keys(empty) as (keyof Values)[];

export function ProfileForm() {
  const p = useTranslations("Profile");
  const person = useTranslations("Person");
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
        toast.error(result.success ? p("userNotFound") : result.message);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the translator is only read on error; a locale switch must not refetch
  }, [userId]);

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    const addressParts = [
      values.province,
      values.district,
      values.subDistrict,
      values.postalCode,
    ];
    const hasAddress = addressParts.some(Boolean) || Boolean(values.detail);
    if (hasAddress && !addressParts.every(Boolean)) {
      toast.error(p("addressIncomplete"));
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
    toast.success(p("saved"));
  };

  const onDelete = async () => {
    if (!userId) return;
    if (!window.confirm(p("confirmDelete"))) return;
    const result = await deleteUser(userId);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(p("deleted"));
    await signOut({ callbackUrl: "/login" });
  };

  if (ready && !userId) {
    return <Typography>{p("loginAgain")}</Typography>;
  }

  return (
    <Box component="form" onSubmit={onSave}>
      <Typography sx={{ mb: 2 }} color="text.secondary">
        {p("email", { email: email || "-" })}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((key) => (
          <Grid key={key} size={{ xs: 12, md: 6 }}>
            <TextField
              label={person(key)}
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
          {saving ? p("saving") : p("save")}
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={() => void onDelete()}
        >
          {p("deleteAccount")}
        </Button>
      </Stack>
    </Box>
  );
}
