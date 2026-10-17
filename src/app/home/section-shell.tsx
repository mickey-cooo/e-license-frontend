import { Box, Paper, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

interface SectionShellProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function SectionShell({
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <Paper variant="outlined" component="section">
      <Typography
        variant="h5"
        component="h2"
        sx={{
          px: { xs: 2.5, md: 3 },
          py: 1.5,
          borderBottom: "1px solid",
          bgcolor: "action.hover",
        }}
      >
        {title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ px: { xs: 2.5, md: 3 }, pt: 2.5, pb: 2.5, maxWidth: "70ch" }}
      >
        {description}
      </Typography>
      <Box sx={{ px: { xs: 2.5, md: 3 }, pb: 3 }}>{children}</Box>
    </Paper>
  );
}
