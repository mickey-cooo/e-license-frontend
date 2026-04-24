"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { trackerSchema, type TrackerSchema } from "@/schema/document.schema";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";
import { getDocuments, type DocumentItem } from "@/service/document.service";

function statusLabel(status?: string) {
  if (!status) return "Pending";
  return status.replace(/_/g, " ");
}

function statusColor(status?: string): "default" | "success" | "warning" {
  const normalized = status?.toUpperCase();
  if (normalized === "APPROVED" || normalized === "COMPLETED") return "success";
  if (normalized === "REJECTED") return "warning";
  return "default";
}

export function DocumentTracker() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);

  const {
    control,
    register,
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
              sx={{ height: "56px", borderRadius: 999 }}
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
            sx={{ p: 2.5, borderRadius: 3, textAlign: "center" }}
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
              sx={{ p: 2, borderRadius: 3 }}
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
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
}
