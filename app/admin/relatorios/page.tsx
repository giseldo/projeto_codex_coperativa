import Link from "next/link";

import { ReportExportButton } from "@/components/report-export-button";
import { WeeklySummary } from "@/components/weekly-summary";
import { requireRole } from "@/lib/auth";
import { getWeeklyReport } from "@/lib/data";

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: monday.toISOString().slice(0, 10),
    endDate: sunday.toISOString().slice(0, 10)
  };
}

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  await requireRole("admin");
  const params = await searchParams;
  const defaults = getCurrentWeekRange();
  const startDate = params.start || defaults.startDate;
  const endDate = params.end || defaults.endDate;
  const report = await getWeeklyReport(startDate, endDate);

  return (
    <div className="grid">
      <div className="button-row">
        <Link href="/admin" className="pill-link">
          Voltar ao painel
        </Link>
      </div>

      <section className="card">
        <div className="section-title">
          <div>
            <h2>Relatório semanal</h2>
            <p className="muted">Consolide a produção pedida e exporte uma planilha CSV.</p>
          </div>
        </div>
        <form className="form-grid two">
          <div className="field">
            <label htmlFor="start">Início</label>
            <input id="start" name="start" type="date" defaultValue={startDate} />
          </div>
          <div className="field">
            <label htmlFor="end">Fim</label>
            <input id="end" name="end" type="date" defaultValue={endDate} />
          </div>
          <div className="button-row">
            <button className="button-secondary" type="submit">
              Atualizar período
            </button>
            <ReportExportButton startDate={startDate} endDate={endDate} />
          </div>
        </form>
      </section>

      {report.summary.length ? (
        <WeeklySummary summary={report.summary} totalRevenue={report.totalRevenue} />
      ) : (
        <div className="card empty-state">Nenhum pedido encontrado no período informado.</div>
      )}
    </div>
  );
}
