"use client";

import { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Stamp } from "../../components/stamp";
import { SectionShell } from "../section-shell";
import { getDocuments, type DocumentItem } from "@/service/document.service";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";
import styles from "../page.module.scss";
import ledger from "./dashboard.module.scss";

const documentStatuses = [
  "submitted",
  "forwarded_to_admin",
  "in_review",
  "approved",
  "rejected",
] as const;

const merchantStatuses = ["pending", "approved", "rejected"] as const;

function statusTone(status?: string) {
  if (status === "approved") return "blue";
  if (status === "rejected") return "red";
  return "graphite";
}

export default function DashboardPage() {
  const d = useTranslations("Dashboard");
  const st = useTranslations("Status");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentTotal, setDocumentTotal] = useState(0);
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);

  useEffect(() => {
    let active = true;
    void Promise.all([getDocuments({ limit: 100 }), getMerchants()]).then(
      ([docs, shops]) => {
        if (!active) return;
        if (!docs.success) toast.error(docs.message);
        else {
          setDocuments(docs.data);
          setDocumentTotal(docs.total);
        }
        if (!shops.success) toast.error(shops.message);
        else setMerchants(shops.data);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const count = <T extends { status?: string }>(items: T[], status: string) =>
    items.filter((item) => item.status === status).length;

  return (
    <Box component="main" className={styles.page}>
      <Container className={styles.container} disableGutters>
        <Stack spacing={3}>
          <SectionShell title={d("title")} description={d("desc")}>
            <table className={ledger.table}>
              <caption className={ledger.caption}>
                {d("documentsTotal", { count: documentTotal })}
              </caption>
              <tbody>
                {documentStatuses.map((value) => (
                  <tr key={value}>
                    <th scope="row">{st(value)}</th>
                    <td>{count(documents, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className={ledger.table}>
              <caption className={ledger.caption}>
                {d("merchantsTotal", { count: merchants.length })}
              </caption>
              <tbody>
                {merchantStatuses.map((value) => (
                  <tr key={value}>
                    <th scope="row">{st(value)}</th>
                    <td>{count(merchants, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionShell>

          <SectionShell title={d("latestTitle")} description={d("latestDesc")}>
            {documents.length === 0 ? (
              <p>{d("none")}</p>
            ) : (
              <div className={ledger.scroll}>
                <table className={ledger.table}>
                  <thead>
                    <tr>
                      <th scope="col">{d("colTitle")}</th>
                      <th scope="col">{d("colType")}</th>
                      <th scope="col">{d("colStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.slice(0, 8).map((doc) => (
                      <tr key={doc.uuid}>
                        <th scope="row">{doc.title}</th>
                        <td>{doc.documentType}</td>
                        <td>
                          <Stamp
                            label={
                              doc.status && st.has(doc.status)
                                ? st(doc.status)
                                : doc.status ?? "-"
                            }
                            tone={statusTone(doc.status)}
                            tilt={-2}
                            plain
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionShell>
        </Stack>
      </Container>
    </Box>
  );
}
