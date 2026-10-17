"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  analyzeLicenses,
  getMerchantTypes,
  type LicenseRecommendation,
  type MerchantTypeInfo,
} from "@/service/license-advisory.service";
import { LicenseRecommendations } from "../license-recommendations";
import { ConditionChecklist } from "../condition-checklist";

const activitySuggestions = [
  "hotel",
  "restaurant",
  "cafe",
  "bar",
  "spa",
  "tour_operator",
  "transport_service",
  "retail",
  "ecommerce",
  "manufacturing",
  "import_export",
  "education_center",
];

export function LicenseAnalyzer() {
  const l = useTranslations("License");
  const mf = useTranslations("MerchantForm");
  // the API sends English labels; show the translated one when we have it
  const typeText = (
    group: "merchantType" | "merchantTypeDescription",
    code: string,
    fallback?: string
  ) => (mf.has(`${group}.${code}`) ? mf(`${group}.${code}`) : fallback);
  const activityLabel = (value: string) =>
    mf.has(`businessActivity.${value}`)
      ? mf(`businessActivity.${value}`)
      : value;
  const [types, setTypes] = useState<MerchantTypeInfo[]>([]);
  const [merchantType, setMerchantType] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [hazardous, setHazardous] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [food, setFood] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<LicenseRecommendation[] | null>(null);

  useEffect(() => {
    let active = true;
    void getMerchantTypes().then((response) => {
      if (!active) return;
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setTypes(response.data);
    });
    return () => {
      active = false;
    };
  }, []);

  const onAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();
    setAnalyzing(true);
    const response = await analyzeLicenses({
      merchantType,
      businessActivities: activities,
      handlesHazardousMaterial: hazardous,
      hasAlcoholService: alcohol,
      hasFoodPreparation: food,
    });
    setAnalyzing(false);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    setResult(response.data?.recommendedLicenses ?? []);
  };

  return (
    <Box
      component="form"
      onSubmit={onAnalyze}
      sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {l("analyzerTitle")}
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <TextField
          select
          label={l("analyzerType")}
          value={merchantType}
          onChange={(event) => setMerchantType(event.target.value)}
          helperText={
            merchantType
              ? typeText(
                  "merchantTypeDescription",
                  merchantType,
                  types.find((type) => type.code === merchantType)?.description
                )
              : undefined
          }
          required
          fullWidth
        >
          {types.map((type) => (
            <MenuItem key={type.code} value={type.code}>
              {typeText("merchantType", type.code, type.label)}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          multiple
          freeSolo
          options={activitySuggestions}
          getOptionLabel={activityLabel}
          value={activities}
          onChange={(_, value) => setActivities(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={l("analyzerActivities")}
              helperText={l("analyzerActivitiesHelper")}
            />
          )}
        />
        <ConditionChecklist
          values={{ hazardous, alcohol, food }}
          onChange={(key, checked) =>
            ({ hazardous: setHazardous, alcohol: setAlcohol, food: setFood }[
              key
            ](checked))
          }
        />
        <Button
          type="submit"
          variant="contained"
          disabled={analyzing || !merchantType || activities.length === 0}
          sx={{ alignSelf: "flex-start" }}
        >
          {analyzing ? l("analyzing") : l("analyze")}
        </Button>
      </Stack>
      {result ? (
        <Box sx={{ mt: 3 }}>
          <LicenseRecommendations licenses={result} />
        </Box>
      ) : null}
    </Box>
  );
}
