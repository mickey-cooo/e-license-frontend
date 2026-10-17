"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  analyzeLicenses,
  getMerchantTypes,
  type LicenseRecommendation,
  type MerchantTypeInfo,
} from "@/service/license-advisory.service";
import { LicenseRecommendations } from "../license-recommendations";

const activitySuggestions = [
  "hotel", "restaurant", "cafe", "bar", "spa", "tour_operator",
  "transport_service", "retail", "ecommerce", "manufacturing",
  "import_export", "education_center",
];

export function LicenseAnalyzer() {
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
    <Box component="form" onSubmit={onAnalyze} sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        ตรวจสอบใบอนุญาตที่ต้องใช้
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <TextField
          select
          label="ประเภทกิจการ"
          value={merchantType}
          onChange={(event) => setMerchantType(event.target.value)}
          helperText={types.find((type) => type.code === merchantType)?.description}
          required
          fullWidth
        >
          {types.map((type) => (
            <MenuItem key={type.code} value={type.code}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          multiple
          freeSolo
          options={activitySuggestions}
          value={activities}
          onChange={(_, value) => setActivities(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="กิจกรรมของธุรกิจ"
              helperText="เลือกหรือพิมพ์แล้วกด Enter อย่างน้อย 1 รายการ"
            />
          )}
        />
        <Stack direction={{ xs: "column", md: "row" }}>
          <FormControlLabel
            control={<Switch checked={hazardous} onChange={(_, checked) => setHazardous(checked)} />}
            label="มีวัตถุอันตราย"
          />
          <FormControlLabel
            control={<Switch checked={alcohol} onChange={(_, checked) => setAlcohol(checked)} />}
            label="มีบริการเครื่องดื่มแอลกอฮอล์"
          />
          <FormControlLabel
            control={<Switch checked={food} onChange={(_, checked) => setFood(checked)} />}
            label="มีการเตรียมอาหาร"
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={analyzing || !merchantType || activities.length === 0}
          sx={{ alignSelf: "flex-start" }}
        >
          {analyzing ? "กำลังวิเคราะห์..." : "วิเคราะห์ใบอนุญาต"}
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
