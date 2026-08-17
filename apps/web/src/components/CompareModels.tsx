'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, GitCompareArrows, Trophy } from 'lucide-react';
import ModelReportCard from '@/components/ModelReportCard';
import { getAllMakes } from '@/lib/catalogo';
import { analyzeVehicle } from '@/lib/api';
import { computeScores } from '@/lib/score';
import type { AutoReport } from '@autoesperto/types';

const defaultLeft = 'Fiat|Panda';
const defaultRight = 'Toyota|Yaris';

const MAINT_RANK: Record<string, number> = { basso: 1, medio: 2, alto: 3, 'molto alto': 4 };
const VERDICT_RANK: Record<string, number> = { BUY: 1, NEGOTIATE: 2, AVOID: 3 };
const VERDICT_SHORT: Record<string, string> = {
  BUY: 'Sì, comprabile',
  NEGOTIATE: 'Trattabile',
  AVOID: 'Meglio evitare',
};

type Side = 'left' | 'right' | 'tie';

interface CompareRow {
  label: string;
  left: string;
  right: string;
  better: Side;
}

function splitModel(value: string) {
  const [make, model] = value.split('|');
  return { make, model };
}

function modelLabel(make: string, model: string) {
  return model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
}

function formatPrice(n: number) {
  return n.toLocaleString('it-IT') + ' €';
}

function marketPrice(report: AutoReport) {
  return report.price.market?.priceAvg ?? report.price.estimatedValue;
}

function sideWinner<T>(a: T | undefined, b: T | undefined, rank: (v: T) => number): Side {
  if (a == null || b == null) return 'tie';
  const ra = rank(a);
  const rb = rank(b);
  if (ra < rb) return 'left';
  if (ra > rb) return 'right';
  return 'tie';
}

export default function CompareModels({
  initialLeftReport,
  initialRightReport
}: {
  initialLeftReport?: AutoReport;
  initialRightReport?: AutoReport;
}) {
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const [reports, setReports] = useState<Record<string, AutoReport>>(() => {
    const init: Record<string, AutoReport> = {};
    if (initialLeftReport) init[defaultLeft] = initialLeftReport;
    if (initialRightReport) init[defaultRight] = initialRightReport;
    return init;
  });
  const [loading, setLoading] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (!initialLeftReport) init[defaultLeft] = true;
    if (!initialRightReport) init[defaultRight] = true;
    return init;
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const leftModel = splitModel(left);
  const rightModel = splitModel(right);

  const allModels = useMemo(() => {
    const list: { make: string; model: string; label: string }[] = [];
    getAllMakes().forEach((m) => {
      m.models.forEach((mod) => {
        list.push({ make: m.name, model: mod, label: modelLabel(m.name, mod) });
      });
    });
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const handleChange = (side: 'left' | 'right', value: string) => {
    if (side === 'left') setLeft(value);
    else setRight(value);
    setLoading((s) => ({ ...s, [value]: true }));
    setErrors((s) => ({ ...s, [value]: false }));
  };

  useEffect(() => {
    let active = true;
    const keys = Array.from(new Set([left, right]));
    keys.forEach((key) => {
      if (reports[key]) return;
      const { make, model } = splitModel(key);
      analyzeVehicle({ make, model })
        .then((res) => {
          if (active) setReports((s) => ({ ...s, [key]: res.report }));
        })
        .catch(() => {
          if (active) setErrors((s) => ({ ...s, [key]: true }));
        })
        .finally(() => {
          if (active) setLoading((s) => ({ ...s, [key]: false }));
        });
    });
    return () => {
      active = false;
    };
  }, [left, right, reports]);

  const leftReport = reports[left];
  const rightReport = reports[right];
  const labelLeft = modelLabel(leftModel.make, leftModel.model);
  const labelRight = modelLabel(rightModel.make, rightModel.model);
  const canCompare = !!leftReport && !!rightReport && left !== right;

  const rows: CompareRow[] = [];
  let winner: Side = 'tie';
  let reasons: string[] = [];

  if (canCompare) {
    const lp = marketPrice(leftReport);
    const rp = marketPrice(rightReport);
    const lScores = computeScores(leftReport);
    const rScores = computeScores(rightReport);
    rows.push({
      label: 'Punteggio AutoEsperto',
      left: `${lScores.overall} / 100`,
      right: `${rScores.overall} / 100`,
      better: sideWinner(lScores.overall, rScores.overall, (v) => -v),
    });
    rows.push({
      label: 'Prezzo medio',
      left: formatPrice(lp),
      right: formatPrice(rp),
      better: sideWinner(lp, rp, (v) => v),
    });

    const lRel = leftReport.reliability;
    const rRel = rightReport.reliability;
    rows.push({
      label: 'Affidabilità',
      left: `${lRel.score.toFixed(1)} / 10`,
      right: `${rRel.score.toFixed(1)} / 10`,
      better: sideWinner(lRel, rRel, (v) => -v.score),
    });
    rows.push({
      label: 'Manutenzione',
      left: `Manutenzione ${lRel.maintenance}`,
      right: `Manutenzione ${rRel.maintenance}`,
      better: sideWinner(lRel.maintenance, rRel.maintenance, (v) => MAINT_RANK[v] ?? 3),
    });

    const lCons = lRel.consumption?.combined;
    const rCons = rRel.consumption?.combined;
    const lUnit = lRel.consumption?.fuelType || 'l/100 km';
    const rUnit = rRel.consumption?.fuelType || 'l/100 km';
    rows.push({
      label: 'Consumi combinati',
      left: lCons != null ? `${lCons.toLocaleString('it-IT')} ${lUnit}` : '—',
      right: rCons != null ? `${rCons.toLocaleString('it-IT')} ${rUnit}` : '—',
      better: sideWinner(lCons, rCons, (v) => v),
    });
    rows.push({
      label: 'Giudizio',
      left: VERDICT_SHORT[lRel.verdict] ?? lRel.verdict,
      right: VERDICT_SHORT[rRel.verdict] ?? rRel.verdict,
      better: sideWinner(lRel.verdict, rRel.verdict, (v) => VERDICT_RANK[v] ?? 3),
    });

    const scoreDiff = lScores.overall - rScores.overall;
    if (scoreDiff >= 4) winner = 'left';
    else if (scoreDiff <= -4) winner = 'right';
    else {
      const relDiff = lRel.score - rRel.score;
      if (relDiff >= 0.3) winner = 'left';
      else if (relDiff <= -0.3) winner = 'right';
      else {
        const pricePct = (lp - rp) / ((lp + rp) / 2);
        if (pricePct > 0.02) winner = 'right';
        else if (pricePct < -0.02) winner = 'left';
        else winner = sideWinner(lRel.verdict, rRel.verdict, (v) => VERDICT_RANK[v] ?? 3);
      }
    }

    reasons = rows
      .filter((row) => row.better !== 'tie')
      .map((row) =>
        row.label === 'Punteggio AutoEsperto'
          ? `Punteggio AutoEsperto: ${lScores.overall} vs ${rScores.overall} — meglio ${row.better === 'left' ? labelLeft : labelRight}`
          : `${row.label}: meglio ${row.better === 'left' ? labelLeft : labelRight}`
      );
  }

  const winnerText = winner === 'left' ? labelLeft : winner === 'right' ? labelRight : null;

  return (
    <div>
      <div className="bg-surface-2 rounded-2xl border border-border p-5 md:p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
          <GitCompareArrows className="w-4 h-4 text-accent" />
          Scegli due modelli
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { side: 'left' as const, label: 'Primo modello', value: left },
            { side: 'right' as const, label: 'Secondo modello', value: right },
          ].map((field) => (
            <label key={field.label} className="text-sm font-semibold text-text-primary flex flex-col">
              {field.label}
              <select
                value={field.value}
                onChange={(event) => handleChange(field.side, event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 max-h-48 overflow-y-auto"
              >
                {allModels.map((item) => (
                  <option key={`${item.make}|${item.model}`} value={`${item.make}|${item.model}`}>{item.label}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      {canCompare && (
        <div className="mt-6 space-y-4">
          <div className={winner === 'tie' ? 'rounded-2xl border border-border bg-surface-2 p-5' : 'rounded-2xl border border-accent/30 bg-accent-light p-5'}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${winner === 'tie' ? 'bg-white text-text-secondary' : 'bg-accent text-white'}`}>
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Quale scegliere?</div>
                {winner !== 'tie' ? (
                  <>
                    <div className="mt-0.5 text-lg font-extrabold text-text-primary">{winnerText}</div>
                    <ul className="mt-2 space-y-1.5">
                      {reasons.map((reason) => (
                        <li key={reason} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="mt-0.5 text-sm font-semibold text-text-primary">
                    Sono molto vicine: scegli in base a condizioni, chilometraggio e allestimento dell&apos;esemplare reale.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Confronto tra {labelLeft} e {labelRight}</caption>
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-text-tertiary">Confronto</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-text-primary">{labelLeft}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-text-primary">{labelRight}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">{row.label}</th>
                    {[row.left, row.right].map((value, i) => {
                      const sideBetter = i === 0 ? row.better === 'left' : row.better === 'right';
                      return (
                        <td key={i} className={`px-4 py-3 ${sideBetter ? 'bg-success-light' : ''}`}>
                          <span className={`inline-flex items-center gap-1.5 ${sideBetter ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                            {sideBetter && <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />}
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <ModelReportCard
          make={leftModel.make}
          model={leftModel.model}
          initialReport={leftReport}
          isLoading={!!loading[left] && !leftReport}
          hasError={!!errors[left]}
        />
        <ModelReportCard
          make={rightModel.make}
          model={rightModel.model}
          initialReport={rightReport}
          isLoading={!!loading[right] && !rightReport}
          hasError={!!errors[right]}
        />
      </div>
    </div>
  );
}
