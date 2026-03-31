"use client";

import { useState } from "react";

import { exportWeeklyReportAction } from "@/lib/actions";

export function ReportExportButton({
  startDate,
  endDate
}: {
  startDate: string;
  endDate: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    setIsLoading(true);
    const result = await exportWeeklyReportAction(startDate, endDate);
    setIsLoading(false);
    if (!result.success || !result.csv) return;

    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-semanal-${startDate}-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="button-primary" onClick={handleExport} disabled={isLoading}>
      {isLoading ? "Gerando CSV..." : "Exportar CSV"}
    </button>
  );
}
