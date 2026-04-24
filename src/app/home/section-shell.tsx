import { Paper, Typography } from "@mui/material";
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {description}
      </Typography>
      {children}
    </Paper>
  );
}
