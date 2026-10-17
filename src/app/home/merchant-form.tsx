"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
  merchantSchema,
  type MerchantFormValues,
  type MerchantSchema,
} from "@/schema/merchant.schema";
import { merchantTypeOptions } from "@/service/merchant-type";
import { useState } from "react";
import {
  analyzeMerchantLicenses,
  createMerchant,
} from "@/service/merchant.service";
import type { LicenseRecommendation } from "@/service/license-advisory.service";
import { LicenseRecommendations } from "./license-recommendations";
import { ConditionChecklist } from "./condition-checklist";
import { fieldError } from "@/lib/helper/field-error";

const businessActivityOptions = [
  { value: "hotel", labelKey: "businessActivity.hotel" },
  { value: "restaurant", labelKey: "businessActivity.restaurant" },
  { value: "cafe", labelKey: "businessActivity.cafe" },
  { value: "bar", labelKey: "businessActivity.bar" },
  { value: "spa", labelKey: "businessActivity.spa" },
  { value: "tour_operator", labelKey: "businessActivity.tour_operator" },
  {
    value: "transport_service",
    labelKey: "businessActivity.transport_service",
  },
  { value: "retail", labelKey: "businessActivity.retail" },
  { value: "ecommerce", labelKey: "businessActivity.ecommerce" },
  { value: "manufacturing", labelKey: "businessActivity.manufacturing" },
  { value: "import_export", labelKey: "businessActivity.import_export" },
  { value: "education_center", labelKey: "businessActivity.education_center" },
];

const conditionNames = [
  "handlesHazardousMaterial",
  "hasAlcoholService",
  "hasFoodPreparation",
] as const;

const conditionFields = {
  hazardous: "handlesHazardousMaterial",
  alcohol: "hasAlcoholService",
  food: "hasFoodPreparation",
} as const;

export function MerchantForm({ onCreated }: { onCreated?: () => void }) {
  const t = useTranslations("MerchantForm");
  const m = useTranslations("Merchant");
  const v = useTranslations("Validation");
  const [preview, setPreview] = useState<LicenseRecommendation[] | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MerchantFormValues, undefined, MerchantSchema>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      merchantName: "",
      businessRegistrationNumber: "",
      taxId: "",
      merchantType: undefined,
      contactName: "",
      contactEmail: "",
      contactPhoneNumber: "",
      businessAddress: "",
      businessActivities: [],
      handlesHazardousMaterial: false,
      hasAlcoholService: false,
      hasFoodPreparation: false,
    },
  });

  const conditions = useWatch({
    control,
    name: [
      "handlesHazardousMaterial",
      "hasAlcoholService",
      "hasFoodPreparation",
    ],
  }).reduce(
    (acc, value, index) => ({ ...acc, [conditionNames[index]]: value }),
    {} as Record<(typeof conditionNames)[number], boolean | undefined>
  );

  const onSubmit = async (values: MerchantSchema) => {
    const payload = {
      ...values,
      businessActivities: values.businessActivities?.filter(Boolean) ?? [],
    };

    const result = await createMerchant(payload);
    if (result.success) {
      toast.success(m("registerSuccess"));
      setPreview(
        result.data?.data?.licenseAnalysis?.recommendedLicenses ?? null
      );
      onCreated?.();
      return;
    }
    toast.error(result.message ?? m("registerFailed"));
  };

  const onPreview = async () => {
    const values = getValues();
    if (!values.merchantType) {
      toast.error(m("pickTypeFirst"));
      return;
    }
    setPreviewing(true);
    const result = await analyzeMerchantLicenses({
      merchantType: values.merchantType,
      businessActivities: values.businessActivities?.filter(Boolean) ?? [],
      handlesHazardousMaterial: values.handlesHazardousMaterial,
      hasAlcoholService: values.hasAlcoholService,
      hasFoodPreparation: values.hasFoodPreparation,
    });
    setPreviewing(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setPreview(
      (result.data as { recommendedLicenses?: LicenseRecommendation[] })
        ?.recommendedLicenses ?? []
    );
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("name")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.merchantName)}
            helperText={fieldError(v, errors.merchantName)}
            {...register("merchantName")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("registrationNumber")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.businessRegistrationNumber)}
            helperText={fieldError(v, errors.businessRegistrationNumber)}
            {...register("businessRegistrationNumber")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("taxId")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.taxId)}
            helperText={fieldError(v, errors.taxId)}
            {...register("taxId")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("businessType")}
            select
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.merchantType)}
            helperText={fieldError(v, errors.merchantType)}
            {...register("merchantType")}
          >
            {merchantTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("contactName")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactName)}
            helperText={fieldError(v, errors.contactName)}
            {...register("contactName")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("contactEmail")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactEmail)}
            helperText={fieldError(v, errors.contactEmail)}
            {...register("contactEmail")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={m("contactPhone")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactPhoneNumber)}
            helperText={fieldError(v, errors.contactPhoneNumber)}
            {...register("contactPhoneNumber")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="businessActivities"
            render={({ field }) => (
              <Autocomplete
                multiple
                size="small"
                options={businessActivityOptions.map((item) => item.value)}
                value={field.value ?? []}
                onChange={(_, value: string[]) => field.onChange(value)}
                sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                      label={t(
                        businessActivityOptions.find(
                          (item) => item.value === option
                        )?.labelKey ?? "businessActivity.other"
                      )}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={m("businessSubtype")}
                    size="small"
                    margin="dense"
                    placeholder={m("subtypePlaceholder")}
                    error={Boolean(errors.businessActivities)}
                    helperText={
                      fieldError(v, errors.businessActivities) ??
                      m("subtypeHelper")
                    }
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label={m("addressOptional")}
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            multiline
            minRows={2}
            error={Boolean(errors.businessAddress)}
            helperText={fieldError(v, errors.businessAddress)}
            {...register("businessAddress")}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <ConditionChecklist
          values={{
            hazardous: Boolean(conditions.handlesHazardousMaterial),
            alcohol: Boolean(conditions.hasAlcoholService),
            food: Boolean(conditions.hasFoodPreparation),
          }}
          onChange={(key, checked) =>
            setValue(conditionFields[key], checked, { shouldDirty: true })
          }
        />
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? m("submitting") : m("submit")}
        </Button>
        <Button
          variant="outlined"
          onClick={() => void onPreview()}
          disabled={previewing}
        >
          {previewing ? m("checking") : m("checkLicenses")}
        </Button>
      </Stack>
      {preview ? (
        <Box sx={{ mt: 3 }}>
          <LicenseRecommendations licenses={preview} />
        </Box>
      ) : null}
    </Box>
  );
}
