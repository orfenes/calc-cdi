import React from 'react';
import { ShieldCheck, BookOpen, Clock, AlertTriangle, Building2, HelpCircle } from 'lucide-react';

export const TaxGuideView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
          Guia Técnico e Tributário
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Como Funciona o CDB Pós-Fixado e sua Tributação
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          O Certificado de Depósito Bancário (CDB) é um dos instrumentos de renda fixa mais populares e seguros do Brasil. Entenda como operam os indexadores, a capitalização diária e as regras de tributação da Receita Federal.
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. O que é o CDB */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">O que é um CDB Pós-Fixado?</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Ao investir em um CDB, você empresta dinheiro a uma instituição bancária para financiar suas atividades de crédito. Em troca, o banco remunera o investidor com juros atrelados a um indexador econômico, tipicamente uma porcentagem da <strong>taxa CDI</strong> (ex: 100%, 110%, 120%).
          </p>
        </div>

        {/* 2. O que é o CDI vs Selic */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">CDI vs. Taxa Selic</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            O <strong>CDI (Certificado de Depósito Interbancário)</strong> é a taxa média dos empréstimos de curtíssimo prazo (1 dia útil) realizados entre bancos. Historicamente, o CDI caminha de mãos dadas com a taxa Selic Over, ficando cerca de <strong>0,10 ponto percentual ao ano</strong> abaixo da Meta Selic fixada pelo COPOM.
          </p>
        </div>

        {/* 3. Garantia do FGC */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">Garantia do FGC (Fundo Garantidor)</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Os CDBs contam com a proteção do Fundo Garantidor de Créditos (FGC). Em caso de intervenção ou liquidação da instituição emissora, o FGC cobre até <strong>R$ 250.000,00</strong> por CPF e por conglomerado financeiro (limitado a R$ 1.000.000 a cada período de 4 anos).
          </p>
        </div>

        {/* 4. IOF nos Primeiros 30 Dias */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">IOF nos Primeiros 29 Dias</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Caso o resgate seja efetuado antes de 30 dias de aplicação, incide a tabela regressiva do <strong>IOF (Imposto sobre Operações Financeiras)</strong>, que varia de 96% no 1º dia útil até 0% a partir do 30º dia corrido. Após 30 dias, o investimento fica completamente isento de IOF.
          </p>
        </div>
      </div>

      {/* Detailed Tax Brackets Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Tabela Regressiva da Receita Federal (Lei nº 11.033/2004)
        </h3>
        <p className="text-xs text-slate-400">
          O Imposto de Renda é retido na fonte pela instituição financeira no momento do resgate ou vencimento do título. O imposto incide <strong>exclusivamente sobre os rendimentos auferidos</strong> (lucro), nunca sobre o principal investido.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 font-mono text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Prazo em Dias Corridos</th>
                <th className="py-3 px-4">Equivalência em Meses</th>
                <th className="py-3 px-4 text-center">Alíquota de IR</th>
                <th className="py-3 px-4">Impacto no Lucro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/20">
                <td className="py-3 px-4 font-semibold text-white">Até 180 dias</td>
                <td className="py-3 px-4 text-slate-400">Até 6 meses</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                    22,5%
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Maior tributação para resgates no curto prazo</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="py-3 px-4 font-semibold text-white">De 181 a 360 dias</td>
                <td className="py-3 px-4 text-slate-400">De 6 a 12 meses</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    20,0%
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Redução de 2,5 p.p. no imposto após 6 meses</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="py-3 px-4 font-semibold text-white">De 361 a 720 dias</td>
                <td className="py-3 px-4 text-slate-400">De 12 a 24 meses</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    17,5%
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Redução de mais 2,5 p.p. após 1 ano</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="py-3 px-4 font-semibold text-white">Acima de 720 dias</td>
                <td className="py-3 px-4 text-slate-400">Mais de 24 meses (2+ anos)</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                    15,0%
                  </span>
                </td>
                <td className="py-3 px-4 text-emerald-400">Alíquota mínima permitida em renda fixa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ANBIMA Days Convention Note */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <h4 className="text-white font-semibold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Nota sobre Dias Úteis (ANBIMA) vs Dias Corridos (Receita Federal)
        </h4>
        <p className="leading-relaxed">
          No mercado financeiro brasileiro (B3/ANBIMA), a capitalização oficial da taxa DI ocorre em base de <strong>252 dias úteis por ano</strong>:
          <code className="inline-block mx-1 p-1 rounded bg-slate-950 font-mono text-emerald-300">
            Fator_DI = (1 + Taxa_DI_anual)^(1/252)
          </code>
          Para simulações em meses ou períodos padrão, a fórmula de descapitalização mensal equivalente
          <code className="inline-block mx-1 p-1 rounded bg-slate-950 font-mono text-emerald-300">
            i_mes = (1 + i_ano)^(1/12) - 1
          </code>
          fornece uma aproximação extremamente precisa e universal. Já a contagem para a Tabela Regressiva de IR é sempre realizada em <strong>dias corridos</strong> contados entre a data da aplicação e a data da liquidação financeira.
        </p>
      </div>
    </div>
  );
};
