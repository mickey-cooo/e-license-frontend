"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import styles from "../page.module.scss";
import grid from "./license.module.scss";
import { useTranslations } from "next-intl";
import { merchantTypeDetails } from "./constants/license.constants";
import { LicenseAnalyzer } from "./license-analyzer";

export default function LicenseGuidePage() {
  const t = useTranslations("MerchantForm");
  const l = useTranslations("License");

  const merchantTypeCards = Object.entries(merchantTypeDetails).map(
    ([value, detail]) => ({
      value,
      label: t(`merchantType.${detail.label}`),
      description: t(`merchantTypeDescription.${detail.description}`),
    })
  );

  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <article className={styles.sheet}>
          <div className={styles.body}>
            <Typography variant="h2" component="h1" className={styles.title}>
              {l("pageTitle")}
            </Typography>
            <Typography className={styles.lead}>{l("pageLead")}</Typography>
            <div className={styles.actions}>
              <Button
                component={Link}
                href="/home/merchant"
                variant="contained"
              >
                {l("startRegister")}
              </Button>
              <Button component={Link} href="/home/document" variant="outlined">
                {l("toDocuments")}
              </Button>
            </div>
          </div>

          <ul className={grid.types}>
            {merchantTypeCards.map((item) => (
              <li key={item.value} className={grid.type}>
                <span className={grid.tick} aria-hidden="true" />
                <div>
                  <div className={styles.stepLabel}>{item.label}</div>
                  <div className={styles.stepDesc}>{item.description}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.steps}>
            <LicenseAnalyzer />
          </div>

          <div className={styles.notes}>
            <h2 className={styles.notesTitle}>{l("adviceTitle")}</h2>
            <ol className={grid.advice}>
              <li>{l("advice1")}</li>
              <li>{l("advice2")}</li>
              <li>{l("advice3")}</li>
            </ol>
          </div>
        </article>
      </Container>
    </Box>
  );
}
