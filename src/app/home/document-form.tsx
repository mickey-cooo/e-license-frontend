"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { documentSchema, type DocumentSchema } from "@/schema/document.schema";
import { createDocument } from "@/service/document.service";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";

export function DocumentForm() {
  const compactTextFieldSx = { "& .MuiInputBase-root": { fontSize: 14 } };
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      documentType: "",
      fileUrl: "",
      description: "",
      merchantUuid: "",
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
        toast.error(result.message ?? "ไม่สามารถโหลดรายการ Merchant ได้");
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

  const onSubmit = async (values: DocumentSchema) => {
    const result = await createDocument(values);
    if (result.success) {
      toast.success("ส่งเอกสารสำเร็จ");
      reset();
      return;
    }
    toast.error(result.message ?? "ไม่สามารถส่งเอกสารได้");
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="ชื่อเอกสาร"
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            {...register("title")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="ประเภทเอกสาร"
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.documentType)}
            helperText={errors.documentType?.message}
            {...register("documentType")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="URL เอกสาร"
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.fileUrl)}
            helperText={errors.fileUrl?.message}
            {...register("fileUrl")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="merchantUuid"
            render={({ field }) => (
              <Autocomplete
                id="document-form-merchant"
                size="small"
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
                    label="เลือกผู้ประกอบการ (ถ้ามี)"
                    size="small"
                    margin="dense"
                    fullWidth
                    sx={compactTextFieldSx}
                    error={Boolean(errors.merchantUuid)}
                    helperText={
                      errors.merchantUuid?.message ??
                      "เลือกจากชื่อผู้ประกอบการ ระบบจะผูกข้อมูลผู้ประกอบการให้อัตโนมัติ"
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
        <Grid size={12}>
          <TextField
            label="รายละเอียด (ถ้ามี)"
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            multiline
            minRows={3}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            {...register("description")}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2.5, borderRadius: 1 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "กำลังส่งเอกสาร..." : "ส่งเอกสาร"}
      </Button>
    </Box>
  );
}
