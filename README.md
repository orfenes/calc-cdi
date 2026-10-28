# 💰 Calculadora de Rendimento de CDB Pós-Fixado (Indexado ao CDI)

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

Script em Python e Simulador Web para cálculo de rentabilidade bruta e líquida de investimentos em **CDB (Certificado de Depósito Bancário) pós-fixado**, aplicando capitalização composta e a **Tabela Regressiva de Imposto de Renda** da Receita Federal ([Lei nº 11.033/2004](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l11033.htm)).

---

## 📌 O que é este projeto?

O **CDB pós-fixado** é um dos instrumentos de renda fixa mais tradicionais do mercado financeiro brasileiro. Sua rentabilidade é expressa como um percentual da **taxa CDI** (Certificado de Depósito Interbancário), como 100%, 110% ou 120% do CDI.

Este projeto disponibiliza:
1. **Script CLI Python (`calculadora_cdb.py`)**: Executável diretamente em qualquer terminal ou prompt de comando, sem necessidade de bibliotecas externas (usa apenas a biblioteca padrão do Python).
2. **Interface Web Interativa**: Calculadora visual completa com gráficos, tabela mês a mês, comparativos com Poupança e console terminal emulado no navegador.

---

## ⚙️ Regras Financeiras e Tributárias Implementadas

- **Tratamento de Entradas Numéricas**: Aceita notação brasileira (vírgula como decimal: `10.000,50`) e americana (ponto como decimal: `10000.50`), tolerando símbolos como `R$`, `%` e espaços.
- **Rentabilidade Anual Efetiva**:
  $$\text{Taxa Efetiva Anual} = \text{Taxa CDI (\% a.a.)} \times \left(\frac{\text{Percentual do CDB}}{100}\right)$$
- **Juros Compostos e Equivalência de Taxas**:
  $$i_{\text{mês}} = (1 + i_{\text{ano}})^{\frac{1}{12}} - 1$$
  $$\text{Valor Bruto Final} = \text{Valor Investido} \times (1 + i_{\text{mês}})^{\text{prazo em meses}}$$
- **Tabela Regressiva de Imposto de Renda (incidente unicamente sobre o lucro)**:
  | Prazo em Dias Corridos | Equivalência em Meses | Alíquota de IR |
  | :--- | :--- | :---: |
  | Até 180 dias | Até 6 meses | **22,5%** |
  | De 181 a 360 dias | De 6 a 12 meses | **20,0%** |
  | De 361 a 720 dias | De 12 a 24 meses | **17,5%** |
  | Acima de 720 dias | Mais de 24 meses | **15,0%** |
- **Formatação Monetária Brasileira**: Exibição dos resultados no formato `R$ 1.234,56`.

---

## 🚀 Como Executar o Script Python no Terminal / Prompt

### Pré-requisitos
- Ter o **Python 3.8** ou superior instalado no computador.
- Não é necessário instalar nenhuma biblioteca adicional via `pip`.

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/calculadora-cdb-python.git
cd calculadora-cdb-python
```

### 2. Executar o Programa

- **No Windows (Prompt de Comando ou PowerShell):**
  ```cmd
  python calculadora_cdb.py
  ```

- **No Linux ou macOS (Terminal):**
  ```bash
  python3 calculadora_cdb.py
  ```

---

## 💻 Exemplo Real de Execução no Terminal

```text
====================================================================
      SIMULADOR FINANCEIRO DE CDB PÓS-FIXADO (INDEXADO AO CDI)      
====================================================================
Insira os parâmetros solicitados abaixo:

• Valor inicial investido (R$): 10.000,00
• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): 10,75
• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): 110
• Prazo da aplicação em meses (ex: 6, 12, 24): 24

====================================================================
                RESUMO DA SIMULAÇÃO FINANCEIRA                     
====================================================================
  Parâmetros da Aplicação:
    - Rentabilidade Efetiva:     11.83% a.a. (110.0% do CDI)
    - Taxa Mensal Equivalente:   0.9357% a.m.
    - Prazo:                     24 meses (~720 dias corridos)
--------------------------------------------------------------------
  Demonstrativo de Rendimentos e Tributação:
    • Valor Investido:                   R$ 10.000,00
    • Rendimento Bruto:                  +R$ 2.504,83
    • Alíquota de IR:                           17.5%
    • Desconto de IR:                      -R$ 438,35
--------------------------------------------------------------------
  Resultado Líquido Final:
    • Lucro Líquido:                     +R$ 2.066,49
    • Valor Final a Resgatar:            R$ 12.066,49
====================================================================
  Nota: Cálculo baseado na Tabela Regressiva da Receita Federal (RFB).
  Garantia do FGC (Fundo Garantidor de Créditos) de até R$ 250.000,00.
====================================================================
```

---

## 🌐 Como Rodar a Aplicação Web Localmente

Caso queira utilizar o simulador visual e o terminal web interativo:

1. **Instale as dependências Node.js:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. Abra `http://localhost:3000` no seu navegador.

---

## 📁 Estrutura de Arquivos

```
├── calculadora_cdb.py      # Script Python autônomo para execução via terminal/prompt
├── README.md               # Documentação completa do projeto
├── src/
│   ├── App.tsx             # Componente raiz da aplicação React
│   ├── components/
│   │   ├── Header.tsx      # Barra de navegação superior
│   │   ├── SimulatorView.tsx # Calculadora visual com KPIs e gráficos
│   │   ├── TerminalView.tsx  # Terminal Python interativo no navegador
│   │   ├── CodeView.tsx    # Visualizador do script com cópia e download
│   │   └── TaxGuideView.tsx  # Guia explicativo de IR, CDI, Selic e FGC
│   └── utils/
│       └── finance.ts      # Funções de matemática financeira e formatação
└── package.json            # Dependências e scripts da aplicação web
```

---

## 🛡️ Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE` para mais informações.
