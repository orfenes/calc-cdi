import React, { useState, useRef, useEffect } from 'react';
import {
  parseBrazilianNumber,
  formatCurrencyBRL,
  calculateCDB,
  SimulationParams,
} from '../utils/finance';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

interface TerminalLine {
  type: 'prompt' | 'input' | 'output' | 'error' | 'header' | 'divider';
  text: string;
}

interface TerminalViewProps {
  initialParams?: SimulationParams;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ initialParams }) => {
  const [step, setStep] = useState<number>(0); // 0: Start, 1: Valor, 2: CDI, 3: CDB%, 4: Prazo, 5: Finished
  const [currentInput, setCurrentInput] = useState<string>('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Armazenamento dos valores digitados pelo usuário
  const [valorInicial, setValorInicial] = useState<number>(10000);
  const [taxaCdi, setTaxaCdi] = useState<number>(10.75);
  const [percentualCdb, setPercentualCdb] = useState<number>(110);
  const [prazoMeses, setPrazoMeses] = useState<number>(24);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Iniciar terminal
  const resetTerminal = () => {
    setStep(1);
    setCurrentInput('');
    setHistory([
      { type: 'header', text: '$ python calculadora_cdb.py' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: '      SIMULADOR FINANCEIRO DE CDB PÓS-FIXADO (INDEXADO AO CDI)      ' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: 'Insira os parâmetros solicitados abaixo:\n' },
    ]);
  };

  useEffect(() => {
    if (initialParams) {
      setValorInicial(initialParams.valorInicial);
      setTaxaCdi(initialParams.taxaCdiAnual);
      setPercentualCdb(initialParams.percentualCdb);
      setPrazoMeses(initialParams.prazoMeses);
      // Execute automatically with initialParams
      const res = calculateCDB(initialParams);
      setHistory([
        { type: 'header', text: '$ python calculadora_cdb.py' },
        { type: 'divider', text: '====================================================================' },
        { type: 'output', text: '      SIMULADOR FINANCEIRO DE CDB PÓS-FIXADO (INDEXADO AO CDI)      ' },
        { type: 'divider', text: '====================================================================' },
        { type: 'output', text: 'Insira os parâmetros solicitados abaixo:\n' },
        { type: 'input', text: `• Valor inicial investido (R$): ${formatCurrencyBRL(initialParams.valorInicial)}` },
        { type: 'input', text: `• Taxa atual do CDI (% ao ano): ${initialParams.taxaCdiAnual}%` },
        { type: 'input', text: `• Percentual do CDI pago pelo CDB: ${initialParams.percentualCdb}%` },
        { type: 'input', text: `• Prazo da aplicação em meses: ${initialParams.prazoMeses}` },
        { type: 'output', text: '\n' },
        { type: 'divider', text: '====================================================================' },
        { type: 'output', text: '                RESUMO DA SIMULAÇÃO FINANCEIRA                     ' },
        { type: 'divider', text: '====================================================================' },
        { type: 'output', text: '  Parâmetros da Aplicação:' },
        {
          type: 'output',
          text: `    - Rentabilidade Efetiva:     ${res.taxaCdbAnual.toFixed(2)}% a.a. (${res.percentualCdb.toFixed(1)}% do CDI)`,
        },
        {
          type: 'output',
          text: `    - Taxa Mensal Equivalente:   ${res.taxaMensalEquivalente.toFixed(4)}% a.m.`,
        },
        {
          type: 'output',
          text: `    - Prazo:                     ${res.prazoMeses} meses (~${res.diasCorridosEst} dias corridos)`,
        },
        { type: 'divider', text: '--------------------------------------------------------------------' },
        { type: 'output', text: '  Demonstrativo de Rendimentos e Tributação:' },
        {
          type: 'output',
          text: `    • Valor Investido:           ${formatCurrencyBRL(res.valorInvestido).padStart(20)}`,
        },
        {
          type: 'output',
          text: `    • Rendimento Bruto:          ${('+' + formatCurrencyBRL(res.rendimentoBruto)).padStart(20)}`,
        },
        {
          type: 'output',
          text: `    • Alíquota de IR:            ${(res.aliquotaIr.toFixed(1) + '%').padStart(20)}`,
        },
        {
          type: 'output',
          text: `    • Desconto de IR:           ${('-' + formatCurrencyBRL(res.descontoIr)).padStart(20)}`,
        },
        { type: 'divider', text: '--------------------------------------------------------------------' },
        { type: 'output', text: '  Resultado Líquido Final:' },
        {
          type: 'output',
          text: `    • Lucro Líquido:             ${('+' + formatCurrencyBRL(res.lucroLiquido)).padStart(20)}`,
        },
        {
          type: 'output',
          text: `    • Valor Final a Resgatar:    ${formatCurrencyBRL(res.valorLiquido).padStart(20)}`,
        },
        { type: 'divider', text: '====================================================================' },
        {
          type: 'output',
          text: '  Nota: Cálculo baseado na Tabela Regressiva da Receita Federal (RFB).',
        },
        {
          type: 'output',
          text: '  Garantia do FGC (Fundo Garantidor de Créditos) de até R$ 250.000,00.',
        },
        { type: 'divider', text: '====================================================================\n' },
        { type: 'output', text: 'Programa finalizado com sucesso. (código de saída 0)' },
      ]);
      setStep(5);
    } else {
      resetTerminal();
    }
  }, [initialParams]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, step]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitCurrentInput();
    }
  };

  const submitCurrentInput = () => {
    const raw = currentInput.trim();
    if (!raw && step <= 4) return;

    if (step === 1) {
      // Valor inicial
      try {
        const val = parseBrazilianNumber(raw);
        if (val <= 0) {
          setHistory((prev) => [
            ...prev,
            { type: 'input', text: `• Valor inicial investido (R$): ${raw}` },
            { type: 'error', text: '  [!] O valor deve ser maior que zero. Tente novamente.' },
          ]);
          setCurrentInput('');
          return;
        }
        setValorInicial(val);
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Valor inicial investido (R$): ${raw}` },
        ]);
        setCurrentInput('');
        setStep(2);
      } catch {
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Valor inicial investido (R$): ${raw}` },
          { type: 'error', text: '  [X] Entrada inválida! Digite um número válido (ex: 10000 ou 10.000,50).' },
        ]);
        setCurrentInput('');
      }
    } else if (step === 2) {
      // Taxa CDI
      try {
        const val = parseBrazilianNumber(raw);
        if (val < 0) {
          setHistory((prev) => [
            ...prev,
            { type: 'input', text: `• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): ${raw}` },
            { type: 'error', text: '  [!] A taxa do CDI não pode ser negativa.' },
          ]);
          setCurrentInput('');
          return;
        }
        setTaxaCdi(val);
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): ${raw}` },
        ]);
        setCurrentInput('');
        setStep(3);
      } catch {
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): ${raw}` },
          { type: 'error', text: '  [X] Entrada inválida! Digite uma taxa válida (ex: 10.75 ou 10,75).' },
        ]);
        setCurrentInput('');
      }
    } else if (step === 3) {
      // Percentual CDB
      try {
        const val = parseBrazilianNumber(raw);
        if (val <= 0) {
          setHistory((prev) => [
            ...prev,
            { type: 'input', text: `• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): ${raw}` },
            { type: 'error', text: '  [!] O percentual do CDB deve ser maior que zero.' },
          ]);
          setCurrentInput('');
          return;
        }
        setPercentualCdb(val);
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): ${raw}` },
        ]);
        setCurrentInput('');
        setStep(4);
      } catch {
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): ${raw}` },
          { type: 'error', text: '  [X] Entrada inválida! Digite um percentual válido (ex: 110).' },
        ]);
        setCurrentInput('');
      }
    } else if (step === 4) {
      // Prazo meses
      try {
        const val = Math.round(parseBrazilianNumber(raw));
        if (val < 1) {
          setHistory((prev) => [
            ...prev,
            { type: 'input', text: `• Prazo da aplicação em meses (ex: 6, 12, 24): ${raw}` },
            { type: 'error', text: '  [!] O prazo deve ser de pelo menos 1 mês.' },
          ]);
          setCurrentInput('');
          return;
        }
        setPrazoMeses(val);

        // Gera o resultado
        const res = calculateCDB({
          valorInicial,
          taxaCdiAnual: taxaCdi,
          percentualCdb,
          prazoMeses: val,
        });

        // Monta a saída final
        const outLines: TerminalLine[] = [
          { type: 'input', text: `• Prazo da aplicação em meses (ex: 6, 12, 24): ${raw}` },
          { type: 'output', text: '\n' },
          { type: 'divider', text: '====================================================================' },
          { type: 'output', text: '                RESUMO DA SIMULAÇÃO FINANCEIRA                     ' },
          { type: 'divider', text: '====================================================================' },
          { type: 'output', text: '  Parâmetros da Aplicação:' },
          {
            type: 'output',
            text: `    - Rentabilidade Efetiva:     ${res.taxaCdbAnual.toFixed(2)}% a.a. (${res.percentualCdb.toFixed(1)}% do CDI)`,
          },
          {
            type: 'output',
            text: `    - Taxa Mensal Equivalente:   ${res.taxaMensalEquivalente.toFixed(4)}% a.m.`,
          },
          {
            type: 'output',
            text: `    - Prazo:                     ${res.prazoMeses} meses (~${res.diasCorridosEst} dias corridos)`,
          },
          { type: 'divider', text: '--------------------------------------------------------------------' },
          { type: 'output', text: '  Demonstrativo de Rendimentos e Tributação:' },
          {
            type: 'output',
            text: `    • Valor Investido:           ${formatCurrencyBRL(res.valorInvestido).padStart(20)}`,
          },
          {
            type: 'output',
            text: `    • Rendimento Bruto:          ${('+' + formatCurrencyBRL(res.rendimentoBruto)).padStart(20)}`,
          },
          {
            type: 'output',
            text: `    • Alíquota de IR:            ${(res.aliquotaIr.toFixed(1) + '%').padStart(20)}`,
          },
          {
            type: 'output',
            text: `    • Desconto de IR:           ${('-' + formatCurrencyBRL(res.descontoIr)).padStart(20)}`,
          },
          { type: 'divider', text: '--------------------------------------------------------------------' },
          { type: 'output', text: '  Resultado Líquido Final:' },
          {
            type: 'output',
            text: `    • Lucro Líquido:             ${('+' + formatCurrencyBRL(res.lucroLiquido)).padStart(20)}`,
          },
          {
            type: 'output',
            text: `    • Valor Final a Resgatar:    ${formatCurrencyBRL(res.valorLiquido).padStart(20)}`,
          },
          { type: 'divider', text: '====================================================================' },
          {
            type: 'output',
            text: '  Nota: Cálculo baseado na Tabela Regressiva da Receita Federal (RFB).',
          },
          {
            type: 'output',
            text: '  Garantia do FGC (Fundo Garantidor de Créditos) de até R$ 250.000,00.',
          },
          { type: 'divider', text: '====================================================================\n' },
          { type: 'output', text: 'Programa finalizado com sucesso. (código de saída 0)' },
        ];

        setHistory((prev) => [...prev, ...outLines]);
        setCurrentInput('');
        setStep(5);
      } catch {
        setHistory((prev) => [
          ...prev,
          { type: 'input', text: `• Prazo da aplicação em meses (ex: 6, 12, 24): ${raw}` },
          { type: 'error', text: '  [X] Entrada inválida! Digite um número inteiro de meses.' },
        ]);
        setCurrentInput('');
      }
    }
  };

  const runWithDefaults = () => {
    setHistory([
      { type: 'header', text: '$ python calculadora_cdb.py' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: '      SIMULADOR FINANCEIRO DE CDB PÓS-FIXADO (INDEXADO AO CDI)      ' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: 'Insira os parâmetros solicitados abaixo:\n' },
      { type: 'input', text: '• Valor inicial investido (R$): 15.000,00' },
      { type: 'input', text: '• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): 10,75' },
      { type: 'input', text: '• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): 110%' },
      { type: 'input', text: '• Prazo da aplicação em meses (ex: 6, 12, 24): 24' },
      { type: 'output', text: '\n' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: '                RESUMO DA SIMULAÇÃO FINANCEIRA                     ' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: '  Parâmetros da Aplicação:' },
      { type: 'output', text: '    - Rentabilidade Efetiva:     11.83% a.a. (110.0% do CDI)' },
      { type: 'output', text: '    - Taxa Mensal Equivalente:   0.9348% a.m.' },
      { type: 'output', text: '    - Prazo:                     24 meses (~720 dias corridos)' },
      { type: 'divider', text: '--------------------------------------------------------------------' },
      { type: 'output', text: '  Demonstrativo de Rendimentos e Tributação:' },
      { type: 'output', text: '    • Valor Investido:                   R$ 15.000,00' },
      { type: 'output', text: '    • Rendimento Bruto:                  +R$ 3.762,66' },
      { type: 'output', text: '    • Alíquota de IR:                           17.5%' },
      { type: 'output', text: '    • Desconto de IR:                     -R$ 658,47' },
      { type: 'divider', text: '--------------------------------------------------------------------' },
      { type: 'output', text: '  Resultado Líquido Final:' },
      { type: 'output', text: '    • Lucro Líquido:                     +R$ 3.104,19' },
      { type: 'output', text: '    • Valor Final a Resgatar:            R$ 18.104,19' },
      { type: 'divider', text: '====================================================================' },
      { type: 'output', text: '  Nota: Cálculo baseado na Tabela Regressiva da Receita Federal (RFB).' },
      { type: 'output', text: '  Garantia do FGC (Fundo Garantidor de Créditos) de até R$ 250.000,00.' },
      { type: 'divider', text: '====================================================================\n' },
      { type: 'output', text: 'Programa finalizado com sucesso. (código de saída 0)' },
    ]);
    setStep(5);
  };

  const copyTerminalText = () => {
    const textToCopy = history.map((line) => line.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepPrompt = () => {
    switch (step) {
      case 1:
        return '• Valor inicial investido (R$): ';
      case 2:
        return '• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): ';
      case 3:
        return '• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): ';
      case 4:
        return '• Prazo da aplicação em meses (ex: 6, 12, 24): ';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 bg-slate-900/60 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <TerminalIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Terminal Python Interativo</h2>
            <p className="text-xs text-slate-400">
              Ambiente de execução direta do script solicitado com suporte a vírgula/ponto
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runWithDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exemplo Automático</span>
          </button>
          <button
            onClick={resetTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reiniciar</span>
          </button>
          <button
            onClick={copyTerminalText}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copiado!' : 'Copiar Saída'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-400 ml-2">bash - 80x24</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Python 3.12 · calculadora_cdb.py</span>
        </div>

        {/* Terminal Content Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 min-h-[420px] max-h-[580px] overflow-y-auto cursor-text select-text"
        >
          {history.map((line, idx) => {
            if (line.type === 'header') {
              return (
                <div key={idx} className="text-emerald-400 font-semibold mb-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={idx} className="text-rose-400 font-medium">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'divider') {
              return (
                <div key={idx} className="text-slate-600">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={idx} className="text-slate-100 font-medium">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={idx} className="whitespace-pre-wrap text-slate-300">
                {line.text}
              </div>
            );
          })}

          {/* Active Input Line */}
          {step >= 1 && step <= 4 && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="text-slate-200 font-medium">{getStepPrompt()}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none text-emerald-300 font-mono focus:outline-none flex-1 p-0 caret-emerald-400"
                  placeholder={
                    step === 1 ? 'ex: 10000 ou 10.000,50' : step === 2 ? 'ex: 10.75 ou 10,75' : step === 3 ? 'ex: 110' : 'ex: 24'
                  }
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 font-sans">
                <span className="text-slate-400">Inserir rápido:</span>
                {step === 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('10.000,00'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      10.000,00
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('25000.50'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      25000.50
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('R$ 50.000,00'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      R$ 50.000,00
                    </button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('10,75'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      10,75
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('11.25%'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      11.25%
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('12,00'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      12,00
                    </button>
                  </>
                )}
                {step === 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('100'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('110%'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      110%
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('120'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      120%
                    </button>
                  </>
                )}
                {step === 4 && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('6'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      6 meses
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('12'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      12 meses
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrentInput('24'); inputRef.current?.focus(); }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700/80 cursor-pointer"
                    >
                      24 meses
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
              <span>Pressione "Nova execução" para simular outros valores.</span>
              <button
                onClick={resetTerminal}
                className="text-emerald-400 hover:text-emerald-300 underline font-mono cursor-pointer"
              >
                Nova execução
              </button>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Helper guidance for test inputs & Local Prompt instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-800 bg-slate-900/30 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Validação Inteligente de Números</span>
          </div>
          <p className="leading-relaxed">
            O script aceita vírgula ou ponto decimal, além de caracteres de moeda e porcentagem (ex:{' '}
            <code className="text-emerald-300 font-mono bg-slate-800 px-1 py-0.5 rounded">
              10.000,50
            </code>
            ,{' '}
            <code className="text-emerald-300 font-mono bg-slate-800 px-1 py-0.5 rounded">
              10000.50
            </code>
            , ou{' '}
            <code className="text-emerald-300 font-mono bg-slate-800 px-1 py-0.5 rounded">
              R$ 25.000,00
            </code>
            ).
          </p>
        </div>

        <div className="border border-slate-800 bg-slate-900/30 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <TerminalIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Como rodar no prompt do seu computador:</span>
          </div>
          <p className="leading-relaxed">
            Salve o arquivo <code className="text-emerald-300 font-mono">calculadora_cdb.py</code> e no seu terminal execute:
          </p>
          <div className="p-2 rounded bg-slate-950 font-mono text-emerald-400 text-[11px] border border-slate-800">
            python3 calculadora_cdb.py
          </div>
        </div>
      </div>
    </div>
  );
};
