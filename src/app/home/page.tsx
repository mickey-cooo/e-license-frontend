"use client";

import Link from "next/link";
import { Button, Typography } from "@mui/material";
import { Stamp } from "../components/stamp";
import styles from "./page.module.scss";

const steps = [
  {
    label: "ดูแนะนำใบอนุญาต",
    description: "ตรวจสอบประเภทกิจการทั้งหมด เพื่อเลือกแนวทางยื่นใบอนุญาตให้ตรงหมวด",
    href: "/home/license",
  },
  {
    label: "ลงทะเบียนผู้ประกอบการ",
    description: "เริ่มต้นด้วยการยืนยันตัวตนและสร้างข้อมูลผู้ประกอบการในระบบ",
    href: "/home/merchant",
  },
  {
    label: "อัปโหลดเอกสารคำขอ",
    description:
      "แนบเอกสารประกอบที่จำเป็น เพื่อลดความซ้ำซ้อนในการยื่นหลายหน่วยงาน",
    href: "/home/document",
  },
  {
    label: "ติดตามผลการพิจารณา",
    description: "ติดตามสถานะคำขอทุกใบอนุญาตแบบรวมศูนย์ผ่าน Dashboard",
    href: "/home/tracker",
  },
] as const;

const notes = [
  "เช็กใบอนุญาตที่ต้องใช้ให้ครบก่อนยื่นคำขอ เพื่อลดการส่งเอกสารซ้ำ",
  "อัปโหลดเอกสารครั้งเดียว แล้วติดตามสถานะได้จากหน้า Dashboard",
  "หากบางขั้นตอนยังต้องใช้เอกสารจริง ระบบจะแจ้งขั้นตอนต่อไปให้ชัดเจน",
  "ต้องการความช่วยเหลือ สามารถเริ่มจากเมนูลงทะเบียนและทำตามลำดับทีละขั้น",
] as const;

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <article className={styles.sheet}>
            <div className={styles.strike} aria-hidden="true">
              <Stamp label="อนุมัติแล้ว" tone="blue" tilt={-9} delayMs={400} large />
            </div>

            <div className={styles.body}>
              <Typography variant="h1" component="h1" className={styles.title}>
                ระบบการขอใบอนุญาตประกอบธุรกิจทุกประเภท
              </Typography>
              <Typography className={styles.lead}>
                ศูนย์กลางการยื่นคำขอใบอนุญาตที่ช่วยลดเอกสารซ้ำซ้อน
                จัดลำดับขั้นตอนให้ชัดเจน และติดตามความคืบหน้าได้ในที่เดียว
              </Typography>
              <div className={styles.actions}>
                <Button
                  component={Link}
                  href="/home/merchant"
                  variant="contained"
                >
                  เริ่มลงทะเบียนคำขอ
                </Button>
                <Button component={Link} href="/home/license" variant="outlined">
                  ดูแนะนำใบอนุญาต
                </Button>
              </div>
            </div>

            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step.href} className={styles.step}>
                  <span className={styles.stepNo}>{index + 1}</span>
                  <div className={styles.stepText}>
                    <div className={styles.stepLabel}>{step.label}</div>
                    <div className={styles.stepDesc}>{step.description}</div>
                  </div>
                  <Link href={step.href} className={styles.stepLink}>
                    ดำเนินการ
                  </Link>
                </li>
              ))}
            </ol>

            <div className={styles.notes}>
              <h2 className={styles.notesTitle}>หมายเหตุ</h2>
              <ul className={styles.notesList}>
                {notes.map((note) => (
                  <li key={note} className={styles.note}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className={styles.slots} aria-label="ตัวอย่างการประทับตรา">
            <div className={styles.slotsHead}>
              <h2 className={styles.slotsTitle}>ตราประทับของหน่วยงาน</h2>
              <p className={styles.slotsSample}>ตัวอย่างประกอบ ไม่ใช่ข้อมูลจริง</p>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>หน่วยงานที่ 1</span>
              <div className={styles.slotMark}>
                <Stamp label="อนุมัติแล้ว" tone="blue" tilt={-5} />
              </div>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>หน่วยงานที่ 2</span>
              <div className={styles.slotMark}>
                <Stamp label="ต้องแก้ไข" tone="red" tilt={3} />
              </div>
            </div>
            <div className={styles.slot}>
              <span className={styles.slotAgency}>หน่วยงานที่ 3</span>
              <div className={styles.slotMark}>
                <span className={styles.slotEmpty}>รอตรวจเอกสาร</span>
              </div>
            </div>
            <p className={styles.slotsFoot}>
              ยื่นเอกสารครั้งเดียว แต่ละหน่วยงานประทับตราผลการพิจารณาของตนเอง
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
