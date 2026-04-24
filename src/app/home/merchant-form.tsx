"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  merchantSchema,
  type MerchantFormValues,
  type MerchantSchema,
} from "@/schema/merchant.schema";
import { merchantTypeOptions } from "@/service/merchant-type";
import { createMerchant } from "@/service/merchant.service";

const businessActivityOptions = [
  { value: "hotel", labelKey: "businessActivity.hotel" },
  { value: "restaurant", labelKey: "businessActivity.restaurant" },
  { value: "cafe", labelKey: "businessActivity.cafe" },
  { value: "bar", labelKey: "businessActivity.bar" },
  { value: "spa", labelKey: "businessActivity.spa" },
  { value: "tour_operator", labelKey: "businessActivity.tour_operator" },
  { value: "transport_service", labelKey: "businessActivity.transport_service" },
  { value: "retail", labelKey: "businessActivity.retail" },
  { value: "ecommerce", labelKey: "businessActivity.ecommerce" },
  { value: "manufacturing", labelKey: "businessActivity.manufacturing" },
  { value: "import_export", labelKey: "businessActivity.import_export" },
  { value: "education_center", labelKey: "businessActivity.education_center" },
];

export function MerchantForm() {
  const t = useTranslations("MerchantForm");
  const {
    control,
    register,
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

  const onSubmit = async (values: MerchantSchema) => {
    const payload = {
      ...values,
      businessActivities: values.businessActivities?.filter(Boolean) ?? [],
    };

    const result = await createMerchant(payload);
    if (result.success) {
      toast.success("สมัคร Merchant สำเร็จ");
      return;
    }
    toast.error(result.message ?? "ไม่สามารถสมัคร Merchant ได้");
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="ชื่อกิจการ"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.merchantName)}
            helperText={errors.merchantName?.message}
            {...register("merchantName")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="เลขทะเบียนพาณิชย์"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.businessRegistrationNumber)}
            helperText={errors.businessRegistrationNumber?.message}
            {...register("businessRegistrationNumber")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="เลขผู้เสียภาษี 13 หลัก"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.taxId)}
            helperText={errors.taxId?.message}
            {...register("taxId")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="ประเภทธุรกิจ"
            select
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.merchantType)}
            helperText={errors.merchantType?.message}
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
            label="ชื่อผู้ติดต่อ"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactName)}
            helperText={errors.contactName?.message}
            {...register("contactName")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="อีเมลผู้ติดต่อ"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactEmail)}
            helperText={errors.contactEmail?.message}
            {...register("contactEmail")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="เบอร์โทรผู้ติดต่อ"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            error={Boolean(errors.contactPhoneNumber)}
            helperText={errors.contactPhoneNumber?.message}
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
                      label={
                        t(
                          businessActivityOptions.find((item) => item.value === option)
                            ?.labelKey ?? "businessActivity.other",
                        )
                      }
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ประเภทธุรกิจ"
                    size="small"
                    margin="dense"
                    placeholder="เลือกประเภทธุรกิจย่อย"
                    error={Boolean(errors.businessActivities)}
                    helperText={
                      errors.businessActivities?.message ??
                      "สามารถเลือกได้มากกว่า 1 รายการ"
                    }
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="ที่อยู่กิจการ (ถ้ามี)"
            size="small"
            margin="dense"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 14 } }}
            multiline
            minRows={2}
            error={Boolean(errors.businessAddress)}
            helperText={errors.businessAddress?.message}
            {...register("businessAddress")}
          />
        </Grid>
      </Grid>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mt: 2 }}>
        <Controller
          control={control}
          name="handlesHazardousMaterial"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="มีวัตถุอันตราย"
            />
          )}
        />
        <Controller
          control={control}
          name="hasAlcoholService"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="มีบริการเครื่องดื่มแอลกอฮอล์"
            />
          )}
        />
        <Controller
          control={control}
          name="hasFoodPreparation"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="มีการเตรียมอาหาร"
            />
          )}
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2.5, borderRadius: 999 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "กำลังส่งข้อมูล..." : "สมัครเป็น Merchant"}
      </Button>
    </Box>
  );
}
