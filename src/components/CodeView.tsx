import React, { useState } from 'react';
import { PYTHON_SCRIPT_CONTENT } from '../utils/finance';
import { Copy, Check, Download, Code2, BookOpen, CheckCircle2 } from 'lucide-react';

export const CodeView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SCRIPT_CONTENT], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora_cdb.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = PYTHON_SCRIPT_CONTENT.split('\n');

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 bg-slate-900/60 p-4 sm:p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-sm">
            py
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">calculadora_cdb.py</h2>
            <p className="text-xs text-slate-400">
              Script Python 3 completo, fortemente tipado e documentado com docstrings PEP 257
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Código Copiado!' : 'Copiar Código'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo .py</span>
          </button>
        </div>
      </div>

      {/* Code Display Container with Line Numbers */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Python 3.10+ · Sem dependências externas adicionais (módulos padrão re e sys)</span>
          </div>
          <span className="text-slate-500">{lines.length} linhas</span>
        </div>

        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-slate-300">
          <pre className="table w-full">
            <code>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                // Syntax coloring cues
                let isComment = line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith('==') || line.trim().startsWith('•') || line.trim().startsWith('-');
                let isDef = line.includes('def ') || line.includes('class ');
                let isImport = line.startsWith('import ') || line.startsWith('from ');
                let isReturn = line.includes('return ') || line.includes('yield ');

                return (
                  <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
                    <span className="table-cell select-none pr-4 text-right text-slate-600 font-mono text-[11px] w-10">
                      {lineNum}
                    </span>
                    <span
                      className={`table-cell whitespace-pre ${
                        isComment
                          ? 'text-slate-500 italic'
                          : isDef
                          ? 'text-emerald-300 font-semibold'
                          : isImport
                          ? 'text-indigo-300'
                          : isReturn
                          ? 'text-amber-300'
                          : 'text-slate-200'
                      }`}
                    >
                      {line || ' '}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Mathematical & Architectural Breakdown */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Estrutura da Matemática Financeira Aplicada
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Como cada regra especificada no prompt foi arquitetada no script Python
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Tratamento de Vírgula e Ponto</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              A função <code className="text-emerald-300 font-mono">limpar_e_converter_numero()</code> higieniza
              símbolos como <code className="text-slate-400 font-mono">R$</code>, <code className="text-slate-400 font-mono">%</code> e espaços. Identifica a posição relativa de ponto e vírgula para tolerar notação brasileira (ex: <code className="text-emerald-300 font-mono">10.000,50</code>) ou americana (<code className="text-emerald-300 font-mono">10000.50</code>).
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Rentabilidade Anual Efetiva</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Calculada multiplicando a taxa do CDI pelo percentual contratado:
              <br />
              <code className="block mt-1.5 p-2 rounded bg-slate-900 text-emerald-300 font-mono text-xs">
                taxa_cdb_anual = taxa_cdi * (percentual_cdb / 100)
              </code>
              Exemplo: CDI de 10,75% a.a. a 110% do CDI resulta em 11,825% a.a.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Juros Compostos & Equivalência</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              No regime de juros compostos, a taxa mensal equivalente não é dividida por 12, mas sim descapitalizada:
              <code className="block mt-1.5 p-2 rounded bg-slate-900 text-emerald-300 font-mono text-xs">
                i_mes = (1 + i_ano)**(1/12) - 1
                <br />
                valor_bruto = valor_inicial * (1 + i_mes)**prazo_meses
              </code>
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Tabela Regressiva de IR (Lei 11.033/04)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              O imposto incide exclusivamente sobre o rendimento (lucro) e é retido na fonte:
              <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-slate-400">
                <li>Até 180 dias: 22,5%</li>
                <li>181 a 360 dias: 20,0%</li>
                <li>361 a 720 dias: 17,5%</li>
                <li>Acima de 720 dias: 15,0%</li>
              </ul>
            </p>
          </div>
        </div>

        {/* How to run in terminal */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80">
          <span className="font-semibold text-white block mb-1 text-xs">
            Como executar no seu terminal local:
          </span>
          <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-emerald-400">
            $ python3 calculadora_cdb.py
          </div>
        </div>
      </div>
    </div>
  );
};
