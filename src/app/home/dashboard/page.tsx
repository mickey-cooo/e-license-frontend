"use client";

import { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { toast } from "react-toastify";
import { Stamp } from "../../components/stamp";
import { SectionShell } from "../section-shell";
import { getDocuments, type DocumentItem } from "@/service/document.service";
import { getMerchants, type MerchantItem } from "@/service/merchant.service";
import styles from "../page.module.scss";
import ledger from "./dashboard.module.scss";

const documentStatuses = [
  ["submitted", "ส่งแล้ว"],
  ["forwarded_to_admin", "ส่งต่อผู้ดูแล"],
  ["in_review", "กำลังตรวจสอบ"],
  ["approved", "อนุมัติแล้ว"],
  ["rejected", "ไม่อนุมัติ"],
] as const;

const merchantStatuses = [
  ["pending", "รอดำเนินการ"],
  ["approved", "อนุมัติแล้ว"],
  ["rejected", "ไม่อนุมัติ"],
] as const;

const labelOf = (list: readonly (readonly [string, string])[], status?: string) =>
  list.find(([value]) => value === status)?.[1] ?? status ?? "-";

function statusTone(status?: string) {
  if (status === "approved") return "blue";
  if (status === "rejected") return "red";
  return "graphite";
}

export default function DashboardPage() {
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
      },
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
          <SectionShell
            title="Dashboard ติดตามสถานะ"
            description="สรุปสถานะเอกสารและผู้ประกอบการของคุณจากข้อมูลในระบบ"
          >
            <table className={ledger.table}>
              <caption className={ledger.caption}>
                เอกสารทั้งหมด {documentTotal} รายการ
              </caption>
              <tbody>
                {documentStatuses.map(([value, label]) => (
                  <tr key={value}>
                    <th scope="row">{label}</th>
                    <td>{count(documents, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className={ledger.table}>
              <caption className={ledger.caption}>
                ผู้ประกอบการ {merchants.length} ราย
              </caption>
              <tbody>
                {merchantStatuses.map(([value, label]) => (
                  <tr key={value}>
                    <th scope="row">{label}</th>
                    <td>{count(merchants, value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionShell>

          <SectionShell
            title="เอกสารล่าสุด"
            description="รายการเอกสารที่ส่งล่าสุดและสถานะปัจจุบัน"
          >
            {documents.length === 0 ? (
              <p>ยังไม่มีเอกสารในระบบ</p>
            ) : (
              <div className={ledger.scroll}>
                <table className={ledger.table}>
                  <thead>
                    <tr>
                      <th scope="col">ชื่อเอกสาร</th>
                      <th scope="col">ประเภท</th>
                      <th scope="col">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.slice(0, 8).map((doc) => (
                      <tr key={doc.uuid}>
                        <th scope="row">{doc.title}</th>
                        <td>{doc.documentType}</td>
                        <td>
                          <Stamp
                            label={labelOf(documentStatuses, doc.status)}
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
