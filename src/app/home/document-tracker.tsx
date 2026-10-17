"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { trackerSchema, type TrackerSchema } from "@/schema/document.schema";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";
import {
  deleteDocument,
  forwardDocument,
  getDocumentById,
  getDocumentProgress,
  getDocuments,
  updateDocument,
  updateDocumentStatus,
  type DocumentItem,
  type DocumentProgressItem,
} from "@/service/document.service";
import { useRole } from "@/lib/helper/use-is-admin";
import { useDocumentSocket } from "@/lib/helper/use-document-socket";

const statusText: Record<string, string> = {
  submitted: "ส่งแล้ว",
  forwarded_to_admin: "ส่งต่อผู้ดูแล",
  in_review: "กำลังตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
  deleted: "ลบแล้ว",
};

// Mirrors the backend transition table (approved and rejected are final).
const nextStatuses: Record<string, string[]> = {
  submitted: ["rejected"],
  forwarded_to_admin: ["in_review", "rejected"],
  in_review: ["approved", "rejected"],
};

function statusLabel(status?: string) {
  if (!status) return "ส่งแล้ว";
  return statusText[status] ?? status.replace(/_/g, " ");
}

function statusColor(status?: string): "default" | "success" | "error" {
  const normalized = status?.toUpperCase();
  if (normalized === "APPROVED" || normalized === "COMPLETED") return "success";
  if (normalized === "REJECTED") return "error";
  return "default";
}

type Dialogs =
  | { kind: "progress"; doc: DocumentItem; steps: DocumentProgressItem[] }
  | { kind: "edit"; doc: DocumentItem }
  | { kind: "forward"; doc: DocumentItem }
  | { kind: "status"; doc: DocumentItem }
  | null;

export function DocumentTracker() {
  const { isAdmin } = useRole();
  const [dialog, setDialog] = useState<Dialogs>(null);
  const [draft, setDraft] = useState({ title: "", documentType: "", fileUrl: "", description: "" });
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);

  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackerSchema>({
    resolver: zodResolver(trackerSchema),
    defaultValues: {
      merchantUuid: "",
      documentType: "",
    },
  });

  useEffect(() => {
    let active = true;
    const loadMerchants = async () => {
      setLoadingMerchants(true);
      const result = await getMerchants();
      if (!active) return;
      setLoadingMerchants(false);

      if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถโหลดรายการผู้ประกอบการได้");
        return;
      }
      setMerchants(result.data);
    };

    void loadMerchants();
    return () => {
      active = false;
    };
  }, []);

  const merchantOptions = useMemo(
    () =>
      merchants.filter(
        (merchant): merchant is MerchantItem & { uuid: string } =>
          Boolean(merchant.uuid),
      ),
    [merchants],
  );

  const getMerchantLabel = (merchant: MerchantItem) => {
    const secondary =
      merchant.businessRegistrationNumber || merchant.contactEmail || "";
    return secondary
      ? `${merchant.merchantName} (${secondary})`
      : merchant.merchantName;
  };

  const onSearch = async (values: TrackerSchema) => {
    setIsSearching(true);
    const result = await getDocuments({
      merchantUuid: values.merchantUuid || undefined,
      documentType: values.documentType || undefined,
    });
    setIsSearching(false);

    if (!result.success) {
      toast.error(result.message ?? "ไม่สามารถดึงข้อมูลเอกสารได้");
      return;
    }
    setDocuments(result.data);
  };

  const reload = useCallback(
    () => onSearch(getValues()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => void reload());
    return () => window.cancelAnimationFrame(frameId);
  }, [reload]);

  // the backend pushes a progress event whenever a document changes state
  useDocumentSocket(() => {
    toast.info("สถานะเอกสารมีการอัปเดต");
    void reload();
  });

  const closeDialog = () => {
    if (!busy) setDialog(null);
  };

  const run = async (
    action: () => Promise<{ success: boolean; message?: string }>,
    done: string,
  ) => {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.success) {
      toast.error(result.message ?? "ดำเนินการไม่สำเร็จ");
      return;
    }
    toast.success(done);
    setDialog(null);
    void reload();
  };

  const openProgress = async (doc: DocumentItem) => {
    if (!doc.uuid) return;
    const [detail, progress] = await Promise.all([
      getDocumentById(doc.uuid),
      getDocumentProgress(doc.uuid),
    ]);
    if (!progress.success) {
      toast.error(progress.message ?? "ไม่สามารถโหลดความคืบหน้าได้");
      return;
    }
    setDialog({
      kind: "progress",
      doc: detail.success && detail.data ? detail.data : doc,
      steps: progress.data,
    });
  };

  const openEdit = (doc: DocumentItem) => {
    setDraft({
      title: doc.title,
      documentType: doc.documentType,
      fileUrl: doc.fileUrl,
      description: doc.description ?? "",
    });
    setDialog({ kind: "edit", doc });
  };

  const openNoteDialog = (kind: "forward" | "status", doc: DocumentItem) => {
    setNote("");
    setNextStatus(nextStatuses[doc.status ?? ""]?.[0] ?? "");
    setDialog({ kind, doc });
  };

  const onDelete = async (doc: DocumentItem) => {
    if (!doc.uuid) return;
    if (!window.confirm(`ยืนยันการลบเอกสาร: ${doc.title}`)) return;
    await run(() => deleteDocument(doc.uuid!), "ลบเอกสารสำเร็จ");
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit(onSearch)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Controller
              control={control}
              name="merchantUuid"
              render={({ field }) => (
                <Autocomplete
                  id="document-tracker-merchant"
                  options={merchantOptions}
                  loading={loadingMerchants}
                  value={
                    merchantOptions.find(
                      (merchant) => merchant.uuid === field.value,
                    ) ?? null
                  }
                  onChange={(_, value) => field.onChange(value?.uuid ?? "")}
                  getOptionLabel={getMerchantLabel}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.uuid
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ค้นหาด้วยชื่อผู้ประกอบการ"
                      fullWidth
                      error={Boolean(errors.merchantUuid)}
                      helperText={
                        errors.merchantUuid?.message ??
                        "เลือกชื่อกิจการ ระบบจะค้นหาให้อัตโนมัติ"
                      }
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingMerchants ? (
                                <CircularProgress color="inherit" size={16} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              label="ประเภทเอกสาร"
              fullWidth
              {...register("documentType")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              disabled={isSearching}
              sx={{ height: "56px", borderRadius: 1 }}
            >
              {isSearching ? "ค้นหา..." : "ค้นหา"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Stack spacing={1.5} sx={{ mt: 2.5 }}>
        {documents.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 1, textAlign: "center" }}
          >
            <Typography color="text.secondary">
              ยังไม่พบเอกสาร ลองค้นหาด้วยชื่อผู้ประกอบการ หรือประเภทเอกสาร
            </Typography>
          </Paper>
        ) : (
          documents.map((doc) => (
            <Paper
              key={`${doc.uuid ?? doc.fileUrl}-${doc.title}`}
              variant="outlined"
              sx={{ p: 2, borderRadius: 1 }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Box>
                  <Typography fontWeight={700}>{doc.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ประเภท: {doc.documentType}
                  </Typography>
                  {doc.description ? (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {doc.description}
                    </Typography>
                  ) : null}
                </Box>
                <Stack alignItems={{ xs: "start", md: "end" }} spacing={0.75}>
                  <Chip
                    label={statusLabel(doc.status)}
                    color={statusColor(doc.status)}
                    size="small"
                  />
                  <Link href={doc.fileUrl} target="_blank" rel="noreferrer">
                    เปิดเอกสาร
                  </Link>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
                <Button size="small" onClick={() => void openProgress(doc)}>
                  ความคืบหน้า
                </Button>
                {doc.status === "submitted" ? (
                  <Button size="small" onClick={() => openEdit(doc)}>
                    แก้ไข
                  </Button>
                ) : null}
                <Button size="small" color="error" onClick={() => void onDelete(doc)}>
                  ลบ
                </Button>
                {isAdmin && doc.status === "submitted" ? (
                  <Button size="small" onClick={() => openNoteDialog("forward", doc)}>
                    ส่งต่อผู้ดูแล
                  </Button>
                ) : null}
                {isAdmin && nextStatuses[doc.status ?? ""] ? (
                  <Button size="small" onClick={() => openNoteDialog("status", doc)}>
                    เปลี่ยนสถานะ
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          ))
        )}
      </Stack>

      <Dialog open={dialog?.kind === "progress"} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>ความคืบหน้า: {dialog?.doc.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            สถานะปัจจุบัน: {statusLabel(dialog?.doc.status)}
          </Typography>
          <Stack component="ol" spacing={1} sx={{ m: 0, p: 0, listStyle: "none" }}>
            {dialog?.kind === "progress" && dialog.steps.length === 0 ? (
              <Typography color="text.secondary">ยังไม่มีประวัติ</Typography>
            ) : null}
            {dialog?.kind === "progress"
              ? dialog.steps.map((step, index) => (
                  <Box component="li" key={step.uuid ?? index} sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                    <Typography fontWeight={700}>{statusLabel(step.status)}</Typography>
                    <Typography variant="body2">{step.note}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.createdAt ? new Date(step.createdAt).toLocaleString("th-TH") : ""}
                    </Typography>
                  </Box>
                ))
              : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>ปิด</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialog?.kind === "edit"} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>แก้ไขเอกสาร</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="ชื่อเอกสาร" value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} fullWidth />
            <TextField label="ประเภทเอกสาร" value={draft.documentType} onChange={(event) => setDraft((prev) => ({ ...prev, documentType: event.target.value }))} fullWidth />
            <TextField label="URL เอกสาร (https)" value={draft.fileUrl} onChange={(event) => setDraft((prev) => ({ ...prev, fileUrl: event.target.value }))} fullWidth />
            <TextField label="รายละเอียด" value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} multiline minRows={2} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>ยกเลิก</Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              dialog?.doc.uuid &&
              void run(() => updateDocument(dialog.doc.uuid!, draft), "แก้ไขเอกสารสำเร็จ")
            }
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialog?.kind === "forward" || dialog?.kind === "status"} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialog?.kind === "forward" ? "ส่งต่อผู้ดูแล" : "เปลี่ยนสถานะ"}: {dialog?.doc.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {dialog?.kind === "status" ? (
              <TextField select label="สถานะใหม่" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} fullWidth>
                {(nextStatuses[dialog.doc.status ?? ""] ?? []).map((status) => (
                  <MenuItem key={status} value={status}>{statusLabel(status)}</MenuItem>
                ))}
              </TextField>
            ) : null}
            <TextField label="หมายเหตุ (ถ้ามี)" value={note} onChange={(event) => setNote(event.target.value)} multiline minRows={2} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>ยกเลิก</Button>
          <Button
            variant="contained"
            disabled={busy || (dialog?.kind === "status" && !nextStatus)}
            onClick={() => {
              const target = dialog?.doc.uuid;
              if (!target) return;
              if (dialog.kind === "forward") {
                void run(() => forwardDocument(target, note || undefined), "ส่งต่อเอกสารสำเร็จ");
              } else {
                void run(() => updateDocumentStatus(target, { status: nextStatus, note: note || undefined }), "เปลี่ยนสถานะสำเร็จ");
              }
            }}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
