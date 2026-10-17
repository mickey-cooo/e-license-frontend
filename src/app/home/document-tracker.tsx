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
import { useFormatter, useTranslations } from "next-intl";
import { fieldError } from "@/lib/helper/field-error";
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

// Mirrors the backend transition table (approved and rejected are final).
const nextStatuses: Record<string, string[]> = {
  submitted: ["rejected"],
  forwarded_to_admin: ["in_review", "rejected"],
  in_review: ["approved", "rejected"],
};

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
  const tr = useTranslations("Tracker");
  const common = useTranslations("Common");
  const st = useTranslations("Status");
  const format = useFormatter();
  const v = useTranslations("Validation");
  const statusLabel = (status?: string) =>
    !status
      ? st("submitted")
      : st.has(status)
      ? st(status)
      : status.replace(/_/g, " ");
  const { isAdmin } = useRole();
  const [dialog, setDialog] = useState<Dialogs>(null);
  const [draft, setDraft] = useState({
    title: "",
    documentType: "",
    fileUrl: "",
    description: "",
  });
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
        toast.error(result.message ?? tr("loadMerchantsFailed"));
        return;
      }
      setMerchants(result.data);
    };

    void loadMerchants();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the translator is only read on error; a locale switch must not refetch
  }, []);

  const merchantOptions = useMemo(
    () =>
      merchants.filter(
        (merchant): merchant is MerchantItem & { uuid: string } =>
          Boolean(merchant.uuid)
      ),
    [merchants]
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
      toast.error(result.message ?? tr("loadFailed"));
      return;
    }
    setDocuments(result.data);
  };

  const reload = useCallback(
    () => onSearch(getValues()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => void reload());
    return () => window.cancelAnimationFrame(frameId);
  }, [reload]);

  // the backend pushes a progress event whenever a document changes state
  useDocumentSocket(() => {
    toast.info(tr("updated"));
    void reload();
  });

  const closeDialog = () => {
    if (!busy) setDialog(null);
  };

  const run = async (
    action: () => Promise<{ success: boolean; message?: string }>,
    done: string
  ) => {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.success) {
      toast.error(result.message ?? common("actionFailed"));
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
      toast.error(progress.message ?? tr("progressFailed"));
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
    if (!window.confirm(tr("confirmDelete", { title: doc.title }))) return;
    await run(() => deleteDocument(doc.uuid!), tr("deleteSuccess"));
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
                      (merchant) => merchant.uuid === field.value
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
                      label={tr("merchantSearch")}
                      fullWidth
                      error={Boolean(errors.merchantUuid)}
                      helperText={
                        fieldError(v, errors.merchantUuid) ?? tr("merchantHelper")
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
              label={tr("documentType")}
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
              {isSearching ? tr("searching") : common("search")}
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
            <Typography color="text.secondary">{tr("empty")}</Typography>
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
                    {tr("typeLabel", { type: doc.documentType })}
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
                    {tr("openDocument")}
                  </Link>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 1.5 }}
              >
                <Button size="small" onClick={() => void openProgress(doc)}>
                  {tr("progress")}
                </Button>
                {doc.status === "submitted" ? (
                  <Button size="small" onClick={() => openEdit(doc)}>
                    {common("edit")}
                  </Button>
                ) : null}
                <Button
                  size="small"
                  color="error"
                  onClick={() => void onDelete(doc)}
                >
                  {common("delete")}
                </Button>
                {isAdmin && doc.status === "submitted" ? (
                  <Button
                    size="small"
                    onClick={() => openNoteDialog("forward", doc)}
                  >
                    {tr("forward")}
                  </Button>
                ) : null}
                {isAdmin && nextStatuses[doc.status ?? ""] ? (
                  <Button
                    size="small"
                    onClick={() => openNoteDialog("status", doc)}
                  >
                    {tr("changeStatus")}
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          ))
        )}
      </Stack>

      <Dialog
        open={dialog?.kind === "progress"}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {tr("progressTitle", { title: dialog?.doc.title ?? "" })}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {tr("currentStatus", { status: statusLabel(dialog?.doc.status) })}
          </Typography>
          <Stack
            component="ol"
            spacing={1}
            sx={{ m: 0, p: 0, listStyle: "none" }}
          >
            {dialog?.kind === "progress" && dialog.steps.length === 0 ? (
              <Typography color="text.secondary">{tr("noHistory")}</Typography>
            ) : null}
            {dialog?.kind === "progress"
              ? dialog.steps.map((step, index) => (
                  <Box
                    component="li"
                    key={step.uuid ?? index}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Typography fontWeight={700}>
                      {statusLabel(step.status)}
                    </Typography>
                    <Typography variant="body2">{step.note}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.createdAt
                        ? format.dateTime(new Date(step.createdAt), {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </Typography>
                  </Box>
                ))
              : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{common("close")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialog?.kind === "edit"}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{tr("editTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={tr("fieldTitle")}
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label={tr("documentType")}
              value={draft.documentType}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  documentType: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label={tr("fieldUrl")}
              value={draft.fileUrl}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, fileUrl: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label={tr("fieldDescription")}
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            {common("cancel")}
          </Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              dialog?.doc.uuid &&
              void run(
                () => updateDocument(dialog.doc.uuid!, draft),
                tr("editSuccess")
              )
            }
          >
            {common("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialog?.kind === "forward" || dialog?.kind === "status"}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialog?.kind === "forward" ? tr("forward") : tr("changeStatus")}:{" "}
          {dialog?.doc.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {dialog?.kind === "status" ? (
              <TextField
                select
                label={tr("newStatus")}
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value)}
                fullWidth
              >
                {(nextStatuses[dialog.doc.status ?? ""] ?? []).map((status) => (
                  <MenuItem key={status} value={status}>
                    {statusLabel(status)}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
            <TextField
              label={common("optionalNote")}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={busy}>
            {common("cancel")}
          </Button>
          <Button
            variant="contained"
            disabled={busy || (dialog?.kind === "status" && !nextStatus)}
            onClick={() => {
              const target = dialog?.doc.uuid;
              if (!target) return;
              if (dialog.kind === "forward") {
                void run(
                  () => forwardDocument(target, note || undefined),
                  tr("forwardSuccess")
                );
              } else {
                void run(
                  () =>
                    updateDocumentStatus(target, {
                      status: nextStatus,
                      note: note || undefined,
                    }),
                  tr("statusSuccess")
                );
              }
            }}
          >
            {common("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
