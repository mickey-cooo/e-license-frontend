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
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { fieldError } from "@/lib/helper/field-error";
import { documentSchema, type DocumentSchema } from "@/schema/document.schema";
import { createDocument } from "@/service/document.service";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";

export function DocumentForm() {
  const d = useTranslations("Document");
  const v = useTranslations("Validation");
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
        toast.error(result.message ?? d("loadMerchantsFailed"));
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
      toast.success(d("submitSuccess"));
      reset();
      return;
    }
    toast.error(result.message ?? d("submitFailed"));
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={d("title")}
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.title)}
            helperText={fieldError(v, errors.title)}
            {...register("title")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={d("type")}
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.documentType)}
            helperText={fieldError(v, errors.documentType)}
            {...register("documentType")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label={d("url")}
            size="small"
            margin="dense"
            fullWidth
            sx={compactTextFieldSx}
            error={Boolean(errors.fileUrl)}
            helperText={fieldError(v, errors.fileUrl)}
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
                    label={d("merchantOptional")}
                    size="small"
                    margin="dense"
                    fullWidth
                    sx={compactTextFieldSx}
                    error={Boolean(errors.merchantUuid)}
                    helperText={
                      fieldError(v, errors.merchantUuid) ??
                      d("merchantHelper")
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
            label={d("description")}
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
        {isSubmitting ? d("submitting") : d("submit")}
      </Button>
    </Box>
  );
}
