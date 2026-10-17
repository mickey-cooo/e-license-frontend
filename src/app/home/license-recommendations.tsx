import { Box, Typography } from "@mui/material";
import type { LicenseRecommendation } from "@/service/license-advisory.service";

export function LicenseRecommendations({
  licenses,
}: {
  licenses: LicenseRecommendation[];
}) {
  if (licenses.length === 0) {
    return <Typography color="text.secondary">ไม่พบใบอนุญาตที่ต้องใช้</Typography>;
  }
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", border: "1px solid", borderBottom: 0 }}>
      {licenses.map((license) => (
        <Box
          component="li"
          key={license.code}
          sx={{ px: 2, py: 1.5, borderBottom: "1px solid" }}
        >
          <Typography fontWeight={700}>
            {license.name}{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              {license.code}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {license.authority}
          </Typography>
          <Typography variant="body2">{license.reason}</Typography>
          {license.note ? (
            <Typography variant="body2" color="text.secondary">
              {license.note}
            </Typography>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}
