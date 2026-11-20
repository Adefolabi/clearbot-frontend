import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LogEntry } from "./LogEntry";
import { getNoticeText, isFailedLog } from "@/lib/logNotices";
import type { LogEntry as LogEntryType } from "@/types";

const base: LogEntryType = {
  id: "log-1",
  type: "log",
  message: "",
  timestamp: 0,
};

function render(entry: Partial<LogEntryType>) {
  return renderToStaticMarkup(
    <LogEntry entry={{ ...base, ...entry }} isRecent={false} />,
  );
}

describe("lecturer_not_assigned notice", () => {
  const notice: Partial<LogEntryType> = {
    status: "info",
    courseCode: "AES 598",
    notice: "lecturer_not_assigned",
    message: "ℹ️  AES 598 — Lecturer not assigned (only Teaching Environment is assessable)",
  };

  it("renders the friendly note for the course", () => {
    const html = render(notice);
    expect(html).toContain("AES 598: no lecturer is assigned on the school portal");
    expect(html).toContain("only Teaching Environment was assessed");
    expect(html).toContain("Nothing is wrong");
    expect(html).toContain('role="note"');
  });

  it("is styled as neutral info, not an error", () => {
    const html = render(notice);
    expect(html).not.toContain("var(--error)");
    expect(html).not.toContain("var(--warning)");
    expect(html).not.toContain("✕");
    expect(html).not.toContain("⚠");
  });

  it("is detected by the notice field, not the message text", () => {
    const sameTextNoField = render({
      status: "info",
      courseCode: "AES 598",
      message: notice.message,
    });
    expect(sameTextNoField).not.toContain('role="note"');
    expect(getNoticeText({ courseCode: "AES 598" })).toBeNull();

    const fieldWithOtherText = render({ ...notice, message: "anything else" });
    expect(fieldWithOtherText).toContain('role="note"');
  });

  it("does not count as a failure", () => {
    expect(isFailedLog(notice.status)).toBe(false);
    expect(isFailedLog("failed")).toBe(true);
  });
});

describe("skipped logs", () => {
  it.each([
    "already assessed, skipping",
    "Lecturer not assigned (no assessable rows), skipping",
  ])("render neutrally: %s", (message) => {
    const html = render({ status: "skipped", courseCode: "CSC 301", message });
    expect(html).toContain(message);
    expect(html).toContain("var(--text-secondary)");
    expect(html).not.toContain("var(--error)");
    expect(html).not.toContain("var(--warning)");
    expect(isFailedLog("skipped")).toBe(false);
  });
});
