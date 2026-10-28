import React, { useState } from 'react';
import {
  SimulationParams,
  calculateCDB,
  formatCurrencyBRL,
  formatPercentBR,
  generateMonthlyProgression,
  compareWithBenchmarks,
} from '../utils/finance';
import {
  TrendingUp,
  ShieldCheck,
  Percent,
  Calendar,
  DollarSign,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface SimulatorViewProps {
  onOpenTerminalWithParams?: (params: SimulationParams) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onOpenTerminalWithParams }) => {
  const [valorInicialStr, setValorInicialStr] = useState<string>('10000');
  const [taxaCdiStr, setTaxaCdiStr] = useState<string>('10.75');
  const [percentualCdbStr, setPercentualCdbStr] = useState<string>('110');
  const [prazoMeses, setPrazoMeses] = useState<number>(24);
  const [showMonthlyTable, setShowMonthlyTable] = useState<boolean>(false);

  // Parsing seguro aceitando vírgula ou ponto
  const parseVal = (str: string, fallback: number) => {
    const cleaned = str.replace(/[R$\s%]/g, '').replace(',', '.');
    const val = parseFloat(cleaned);
    return isNaN(val) ? fallback : val;
  };

  const valorInicial = Math.max(1, parseVal(valorInicialStr, 10000));
  const taxaCdiAnual = Math.max(0.1, parseVal(taxaCdiStr, 10.75));
  const percentualCdb = Math.max(1, parseVal(percentualCdbStr, 110));

  const params: SimulationParams = {
    valorInicial,
    taxaCdiAnual,
    percentualCdb,
    prazoMeses,
  };

  const res = calculateCDB(params);
  const monthlyData = generateMonthlyProgression(params);
  const benchmarks = compareWithBenchmarks(params, res.valorLiquido);

  const presets = [
    { label: '100% CDI · Reserva (12m)', valor: 10000, cdi: 10.75, cdb: 100, prazo: 12 },
    { label: '110% CDI · Sofisa/Daycoval (24m)', valor: 25000, cdi: 10.75, cdb: 110, prazo: 24 },
    { label: '120% CDI · Banco Médio (36m)', valor: 50000, cdi: 10.75, cdb: 120, prazo: 36 },
    { label: '102% CDI · Liquidez Diária (6m)', valor: 15000, cdi: 10.75, cdb: 102, prazo: 6 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setValorInicialStr(p.valor.toString());
    setTaxaCdiStr(p.cdi.toString());
    setPercentualCdbStr(p.cdb.toString());
    setPrazoMeses(p.prazo);
  };

  // Cálculo de proporções para a barra visual de capital
  const totalBar = res.valorBruto;
  const pctInicial = totalBar > 0 ? (res.valorInvestido / totalBar) * 100 : 100;
  const pctLucro = totalBar > 0 ? (res.lucroLiquido / totalBar) * 100 : 0;
  const pctIr = totalBar > 0 ? (res.descontoIr / totalBar) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Intro hero banner */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
            <span>Matemática Financeira B3 & ANBIMA</span>
            <span aria-hidden="true">·</span>
            <span>Tabela Regressiva da Receita Federal</span>
            <span aria-hidden="true">·</span>
            <span>Juros Compostos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Simulador de Rendimento em CDB Pós-Fixado
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Calcule o retorno bruto e líquido do seu investimento considerando a capitalização composta e o desconto automático do Imposto de Renda (IR) incidente sobre o lucro.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Cenários Rápidos de Mercado:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-all whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900/60 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-semibold text-white">Parâmetros da Aplicação</h2>
            <p className="text-xs text-slate-400 mt-1">
              Aceita valores com vírgula ou ponto (ex: 10.000,50 ou 10000.50).
            </p>
          </div>

          {/* 1. Valor Inicial */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Valor inicial investido (R$)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-sm pointer-events-none">
                R$
              </span>
              <input
                type="text"
                value={valorInicialStr}
                onChange={(e) => setValorInicialStr(e.target.value)}
                placeholder="10000,00"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-1.5 pt-1">
              {[5000, 10000, 25000, 50000, 100000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValorInicialStr(v.toString())}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60 transition-colors"
                >
                  {v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Taxa atual do CDI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Taxa atual do CDI (% ao ano)
              </label>
              <span className="text-[11px] text-slate-400">Meta Selic ref.</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={taxaCdiStr}
                onChange={(e) => setTaxaCdiStr(e.target.value)}
                placeholder="10.75"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 font-mono text-sm pointer-events-none">
                % a.a.
              </span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {['10.75', '11.25', '12.00', '13.25'].map((cdi) => (
                <button
                  key={cdi}
                  type="button"
                  onClick={() => setTaxaCdiStr(cdi)}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60 transition-colors"
                >
                  {cdi.replace('.', ',')}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Percentual do CDI pago pelo CDB */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Percentual do CDI pago pelo CDB
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">
                {res.taxaCdbAnual.toFixed(2)}% a.a. efetiva
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={percentualCdbStr}
                onChange={(e) => setPercentualCdbStr(e.target.value)}
                placeholder="110"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 font-mono text-sm pointer-events-none">
                % CDI
              </span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[100, 105, 110, 115, 120, 130].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPercentualCdbStr(pct.toString())}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 4. Prazo em meses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Prazo da aplicação em meses
              </label>
              <span className="text-xs font-mono font-semibold text-emerald-400">
                {prazoMeses} {prazoMeses === 1 ? 'mês' : 'meses'} (~{res.diasCorridosEst} dias)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={prazoMeses}
              onChange={(e) => setPrazoMeses(parseInt(e.target.value) || 1)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex gap-1.5">
              {[3, 6, 12, 24, 36, 48, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPrazoMeses(m)}
                  className={`flex-1 py-1 text-[11px] font-mono rounded border transition-colors ${
                    prazoMeses === m
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Quick Button to test in CLI */}
          {onOpenTerminalWithParams && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenTerminalWithParams(params)}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>Rodar esses parâmetros no Terminal Python</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Results & Analytics (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Valor Investido */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-xs text-slate-400 block mb-1">Valor Investido</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                {formatCurrencyBRL(res.valorInvestido)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Capital original aportado
              </span>
            </div>

            {/* Rendimento Bruto */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-xs text-slate-400 block mb-1">Rendimento Bruto</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                +{formatCurrencyBRL(res.rendimentoBruto)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                +{formatPercentBR(res.rentabilidadeBrutaPeriodo)} no período total
              </span>
            </div>

            {/* Alíquota e Desconto de IR */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Imposto de Renda (IR)</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {res.aliquotaIr.toFixed(1)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                -{formatCurrencyBRL(res.descontoIr)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Retido na fonte sobre o lucro
              </span>
            </div>

            {/* Lucro Líquido */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <span className="text-xs text-slate-400 block mb-1">Lucro Líquido Real</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
                +{formatCurrencyBRL(res.lucroLiquido)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                +{formatPercentBR(res.rentabilidadeLiquidaPeriodo)} líquido no bolso
              </span>
            </div>
          </div>

          {/* Valor Final a Resgatar (Highlight Box) */}
          <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                  Valor Final a Resgatar (Líquido)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                  {formatCurrencyBRL(res.valorLiquido)}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Montante bruto: {formatCurrencyBRL(res.valorBruto)}</span>
                  <span>·</span>
                  <span>Taxa mensal equiv.: {res.taxaMensalEquivalente.toFixed(4)}% a.m.</span>
                </div>
              </div>
              <div className="text-right sm:self-center">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                  {res.rentabilidadeLiquidaPeriodo.toFixed(2)}% de retorno líquido
                </div>
              </div>
            </div>

            {/* Capital Composition Bar */}
            <div className="mt-5 pt-5 border-t border-emerald-500/20">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Composição do Capital Bruto</span>
                <span className="font-mono text-slate-300">{formatCurrencyBRL(res.valorBruto)}</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${pctInicial}%` }}
                  className="bg-slate-600 transition-all duration-300"
                  title={`Capital Original: ${pctInicial.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${pctLucro}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                  title={`Lucro Líquido: ${pctLucro.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${pctIr}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title={`Imposto de Renda: ${pctIr.toFixed(1)}%`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
                  <span>Capital ({pctInicial.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Lucro Líquido ({pctLucro.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>IR Retido ({pctIr.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela Regressiva da Receita Federal (Interactive Brackets) */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Tabela Regressiva de IR (Lei nº 11.033/2004)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Seu prazo: ~{res.diasCorridosEst} dias
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { label: 'Até 180 dias', meses: 'Até 6 meses', aliq: 22.5, maxDays: 180 },
                { label: '181 a 360 dias', meses: '6 a 12 meses', aliq: 20.0, maxDays: 360 },
                { label: '361 a 720 dias', meses: '12 a 24 meses', aliq: 17.5, maxDays: 720 },
                { label: 'Acima de 720 dias', meses: 'Mais de 24 meses', aliq: 15.0, maxDays: Infinity },
              ].map((bracket, i) => {
                const isActive = res.aliquotaIr === bracket.aliq;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold text-white">
                        {bracket.aliq.toFixed(1)}%
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                          Ativa
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-slate-200">{bracket.label}</div>
                    <div className="text-[11px] text-slate-500">{bracket.meses}</div>
                  </div>
                );
              })}
            </div>

            {/* Smart Advice on Next Tax Bracket */}
            {res.proximaFaixaIr && (
              <div className="mt-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-300">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Dica de Eficiência Tributária: </span>
                  Se mantiver o investimento por mais cerca de{' '}
                  <strong className="text-emerald-300">
                    {res.proximaFaixaIr.mesesNecessarios}{' '}
                    {res.proximaFaixaIr.mesesNecessarios === 1 ? 'mês' : 'meses'} (~
                    {res.proximaFaixaIr.diasNecessarios} dias)
                  </strong>
                  , a alíquota de IR cai para{' '}
                  <strong className="text-emerald-300">{res.proximaFaixaIr.aliquotaFutura}%</strong>
                  , gerando uma economia estimada em impostos de{' '}
                  <strong className="text-emerald-300">
                    {formatCurrencyBRL(res.proximaFaixaIr.economiaIrEstimada)}
                  </strong>
                  .
                </div>
              </div>
            )}
          </div>

          {/* Benchmark comparison: CDB vs Poupança vs 100% CDI */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Comparativo de Mercado (Valores Líquidos Finais)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Este CDB */}
              <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20">
                <span className="text-slate-400 block mb-0.5">Seu CDB ({params.percentualCdb}% CDI)</span>
                <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                  {formatCurrencyBRL(benchmarks.cdbLiquido)}
                </span>
                <span className="text-[11px] text-emerald-500 block mt-1">
                  Lucro: +{formatCurrencyBRL(res.lucroLiquido)}
                </span>
              </div>

              {/* 100% do CDI */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40">
                <span className="text-slate-400 block mb-0.5">CDB 100% CDI Padrão</span>
                <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
                  {formatCurrencyBRL(benchmarks.cdi100Liquido)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Diferença: {formatCurrencyBRL(benchmarks.cdbLiquido - benchmarks.cdi100Liquido)}
                </span>
              </div>

              {/* Poupança */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40">
                <span className="text-slate-400 block mb-0.5">Poupança Tradicional (Isenta)</span>
                <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
                  {formatCurrencyBRL(benchmarks.poupancaLiquido)}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-1">
                  Vantagem do CDB: +{formatCurrencyBRL(benchmarks.cdbLiquido - benchmarks.poupancaLiquido)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Evolution Table (Collapsible) */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowMonthlyTable(!showMonthlyTable)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Evolução Mês a Mês do Patrimônio
              </h3>
              <p className="text-xs text-slate-400">
                Visualização detalhada da progressão de juros compostos e apuração do IR por competência
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{showMonthlyTable ? 'Ocultar Detalhes' : 'Expandir Tabela'}</span>
            {showMonthlyTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showMonthlyTable && (
          <div className="border-t border-slate-800 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Mês</th>
                  <th className="py-3 px-4">Dias Est.</th>
                  <th className="py-3 px-4 text-right">Saldo Bruto</th>
                  <th className="py-3 px-4 text-right">Rend. Bruto</th>
                  <th className="py-3 px-4 text-center">Aliq. IR</th>
                  <th className="py-3 px-4 text-right">IR Retido</th>
                  <th className="py-3 px-4 text-right">Lucro Líquido</th>
                  <th className="py-3 px-4 text-right">Saldo Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {monthlyData.map((row) => (
                  <tr key={row.mes} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">Mês {row.mes}</td>
                    <td className="py-2.5 px-4 text-slate-500">{row.diasCorridos}d</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-200">
                      {formatCurrencyBRL(row.valorBruto)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-400">
                      +{formatCurrencyBRL(row.rendimentoBrutoAcumulado)}
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {row.aliquotaIr.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-amber-400">
                      -{formatCurrencyBRL(row.descontoIr)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-emerald-300">
                      +{formatCurrencyBRL(row.lucroLiquidoAcumulado)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-bold text-white">
                      {formatCurrencyBRL(row.valorLiquido)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
