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
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  createUser,
  deleteUser,
  listUsers,
  type UserItem,
} from "@/service/user-profile.service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const blank = {
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

const createFields = Object.keys(blank) as (keyof typeof blank)[];

export function UserManager() {
  const u = useTranslations("Users");
  const person = useTranslations("Person");
  const common = useTranslations("Common");
  const [idsText, setIdsText] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);

  const onLookup = async () => {
    const ids = idsText.split(/[\s,]+/).filter(Boolean);
    if (ids.length === 0 || ids.some((id) => !UUID.test(id))) {
      toast.error(u("invalidIds"));
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
    if (!window.confirm(u("confirmDelete", { email: user.email }))) return;
    const result = await deleteUser(user.uuid);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(u("deleted"));
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
    toast.success(u("created"));
    setCreating(false);
    setForm(blank);
  };

  return (
    <Stack spacing={2}>
      <Alert severity="info">{u("lookupOnly")}</Alert>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label={u("idsLabel")}
          value={idsText}
          onChange={(event) => setIdsText(event.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={() => void onLookup()}
          disabled={loading}
        >
          {loading ? u("searching") : common("search")}
        </Button>
        <Button variant="outlined" onClick={() => setCreating(true)}>
          {u("create")}
        </Button>
      </Stack>

      {users.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{u("colEmail")}</TableCell>
              <TableCell>{u("colName")}</TableCell>
              <TableCell>{u("colPhone")}</TableCell>
              <TableCell align="right">{u("colActions")}</TableCell>
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
                  {user.name
                    ? `${user.name.th} ${user.lastName?.th ?? ""}`
                    : "-"}
                </TableCell>
                <TableCell>{user.phoneNumber ?? "-"}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    color="error"
                    onClick={() => void onDelete(user)}
                  >
                    {common("delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{u("create")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {createFields.map((key) => (
              <Grid key={key} size={{ xs: 12, md: 6 }}>
                <TextField
                  label={person(key)}
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
          <Button onClick={() => setCreating(false)}>{common("cancel")}</Button>
          <Button variant="contained" onClick={() => void onCreate()}>
            {u("createConfirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
