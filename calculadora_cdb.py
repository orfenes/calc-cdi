#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Calculadora de Rendimento de CDB Pós-Fixado (Indexado ao CDI)
Autor: Desenvolvedor Python Especialista em Matemática Financeira
=============================================================================
Este script calcula a rentabilidade bruta e líquida de um Certificado de
Depósito Bancário (CDB) pós-fixado, seguindo as regras da legislação tributária
brasileira (Lei nº 11.033/2004) e os princípios da matemática financeira:
  - Capitalização de juros compostos com equivalência anual/mensal;
  - Tabela regressiva de Imposto de Renda (IR) incidente exclusivamente sobre o lucro;
  - Tratamento resiliente de entradas numéricas com vírgula ou ponto decimal;
  - Formatação precisa dos valores monetários no padrão brasileiro (R$).
=============================================================================
"""

import re
import sys


def limpar_e_converter_numero(entrada: str) -> float:
    """
    Higieniza e converte uma string numérica para float.
    
    Aceita:
      - Separador decimal por vírgula (ex: 10000,50 ou 10.000,50)
      - Separador decimal por ponto (ex: 10000.50 ou 10,000.50)
      - Símbolos de moeda ('R$'), percentual ('%') e espaços extras.
    """
    if not entrada:
        raise ValueError("A entrada não pode estar vazia.")

    # Remove símbolos, caracteres de moeda e espaços em branco
    texto_limpo = re.sub(r"[R$\s%]", "", entrada.strip())

    # Trata caso contenha ambos ponto e vírgula (ex: '10.000,50' ou '10,000.50')
    if "." in texto_limpo and "," in texto_limpo:
        if texto_limpo.rfind(",") > texto_limpo.rfind("."):
            # Notação brasileira: ponto é milhar, vírgula é decimal
            texto_limpo = texto_limpo.replace(".", "").replace(",", ".")
        else:
            # Notação anglo-saxã: vírgula é milhar, ponto é decimal
            texto_limpo = texto_limpo.replace(",", "")
    elif "," in texto_limpo:
        # Apenas vírgula como separador decimal
        texto_limpo = texto_limpo.replace(",", ".")

    return float(texto_limpo)


def solicitar_entrada(prompt: str, tipo_dado: type = float, min_val: float = 0.0) -> float:
    """
    Solicita uma entrada no terminal com loop de validação contínuo.
    Garante que o usuário informe um número válido e não-negativo.
    """
    while True:
        try:
            valor_bruto = input(prompt)
            valor_numerico = limpar_e_converter_numero(valor_bruto)
            
            if valor_numerico < min_val:
                print(f"  [!] O valor deve ser maior ou igual a {min_val}. Tente novamente.")
                continue

            if tipo_dado is int:
                return int(round(valor_numerico))
            
            return valor_numerico
        except (ValueError, TypeError):
            print("  [X] Entrada inválida! Digite um número válido (ex: 10000 ou 10.000,50).")


def obter_aliquota_ir(dias_corridos: int) -> float:
    """
    Retorna a alíquota da Tabela Regressiva de IR de Renda Fixa (Lei 11.033/04):
      - Até 180 dias: 22,5%
      - De 181 a 360 dias: 20,0%
      - De 361 a 720 dias: 17,5%
      - Acima de 720 dias: 15,0%
    """
    if dias_corridos <= 180:
        return 22.5
    elif dias_corridos <= 360:
        return 20.0
    elif dias_corridos <= 720:
        return 17.5
    else:
        return 15.0


def formatar_moeda_brl(valor: float) -> str:
    """
    Formata um número em ponto flutuante para a moeda padrão brasileira (R$).
    Exemplo: 12500.5 -> 'R$ 12.500,50'
    """
    formatado = f"{valor:,.2f}"
    return "R$ " + formatado.replace(",", "X").replace(".", ",").replace("X", ".")


def calcular_rendimento_cdb(
    valor_inicial: float,
    taxa_cdi_anual: float,
    percentual_cdb: float,
    prazo_meses: int
) -> dict:
    """
    Realiza o cálculo completo do investimento em CDB pós-fixado:
      1. Rentabilidade anual efetiva: CDI_anual * (Percentual_CDB / 100)
      2. Taxa mensal equivalente por juros compostos: (1 + i_ano)^(1/12) - 1
      3. Montante Bruto: VP * (1 + i_mes)^prazo_meses
      4. Rendimento Bruto: Montante Bruto - Valor Inicial
      5. Enquadramento na tabela regressiva de IR sobre o lucro
      6. Lucro Líquido e Valor Final a Resgatar
    """
    # 1. Rentabilidade anual efetiva do CDB
    rentabilidade_anual_efetiva = taxa_cdi_anual * (percentual_cdb / 100.0)

    # 2. Conversão da taxa anual para mensal equivalente (capitalização composta)
    # Fórmula: (1 + i_ano) = (1 + i_mes)^12  =>  i_mes = (1 + i_ano)^(1/12) - 1
    i_ano_decimal = rentabilidade_anual_efetiva / 100.0
    i_mes_decimal = ((1.0 + i_ano_decimal) ** (1.0 / 12.0)) - 1.0

    # 3. Montante Bruto acumulado
    valor_bruto = valor_inicial * ((1.0 + i_mes_decimal) ** prazo_meses)
    rendimento_bruto = valor_bruto - valor_inicial

    # 4. Estimativa de dias corridos (30 dias por mês civil de aplicação)
    dias_corridos = prazo_meses * 30
    aliquota_ir = obter_aliquota_ir(dias_corridos)

    # 5. Desconto de Imposto de Renda e Lucro Líquido
    desconto_ir = rendimento_bruto * (aliquota_ir / 100.0)
    lucro_liquido = rendimento_bruto - desconto_ir
    valor_final_resgatar = valor_inicial + lucro_liquido

    return {
        "valor_investido": valor_inicial,
        "taxa_cdi_anual": taxa_cdi_anual,
        "percentual_cdb": percentual_cdb,
        "rentabilidade_anual_efetiva": rentabilidade_anual_efetiva,
        "taxa_mensal_equivalente": i_mes_decimal * 100.0,
        "prazo_meses": prazo_meses,
        "dias_corridos": dias_corridos,
        "rendimento_bruto": rendimento_bruto,
        "aliquota_ir": aliquota_ir,
        "desconto_ir": desconto_ir,
        "lucro_liquido": lucro_liquido,
        "valor_final_resgatar": valor_final_resgatar,
    }


def main():
    print("=" * 68)
    print("      SIMULADOR FINANCEIRO DE CDB PÓS-FIXADO (INDEXADO AO CDI)      ")
    print("=" * 68)
    print("Insira os parâmetros solicitados abaixo:\n")

    # Solicitação das entradas via terminal com suporte a vírgula/ponto
    valor_inicial = solicitar_entrada(
        "• Valor inicial investido (R$): ",
        tipo_dado=float,
        min_val=0.01
    )
    taxa_cdi = solicitar_entrada(
        "• Taxa atual do CDI (% ao ano, ex: 10.75 ou 10,75): ",
        tipo_dado=float,
        min_val=0.0
    )
    percentual_cdb = solicitar_entrada(
        "• Percentual do CDI pago pelo CDB (ex: 100, 110, 120): ",
        tipo_dado=float,
        min_val=0.0
    )
    prazo_meses = solicitar_entrada(
        "• Prazo da aplicação em meses (ex: 6, 12, 24): ",
        tipo_dado=int,
        min_val=1
    )

    # Execução dos cálculos
    res = calcular_rendimento_cdb(valor_inicial, taxa_cdi, percentual_cdb, prazo_meses)

    # Exibição do resumo formatado
    print("\n" + "=" * 68)
    print("                RESUMO DA SIMULAÇÃO FINANCEIRA                     ")
    print("=" * 68)
    print(f"  Parâmetros da Aplicação:")
    print(f"    - Rentabilidade Efetiva:     {res['rentabilidade_anual_efetiva']:.2f}% a.a. ({res['percentual_cdb']:.1f}% do CDI)")
    print(f"    - Taxa Mensal Equivalente:   {res['taxa_mensal_equivalente']:.4f}% a.m.")
    print(f"    - Prazo:                     {res['prazo_meses']} meses (~{res['dias_corridos']} dias corridos)")
    print("-" * 68)
    aliquota_str = f"{res['aliquota_ir']:.1f}%"
    rendimento_bruto_str = "+" + formatar_moeda_brl(res['rendimento_bruto'])
    desconto_ir_str = "-" + formatar_moeda_brl(res['desconto_ir'])
    lucro_liquido_str = "+" + formatar_moeda_brl(res['lucro_liquido'])

    print(f"  Demonstrativo de Rendimentos e Tributação:")
    print(f"    • Valor Investido:           {formatar_moeda_brl(res['valor_investido']):>20}")
    print(f"    • Rendimento Bruto:          {rendimento_bruto_str:>20}")
    print(f"    • Alíquota de IR:            {aliquota_str:>20}")
    print(f"    • Desconto de IR:            {desconto_ir_str:>20}")
    print("-" * 68)
    print(f"  Resultado Líquido Final:")
    print(f"    • Lucro Líquido:             {lucro_liquido_str:>20}")
    print(f"    • Valor Final a Resgatar:    {formatar_moeda_brl(res['valor_final_resgatar']):>20}")
    print("=" * 68)
    print("  Nota: Cálculo baseado na Tabela Regressiva da Receita Federal (RFB).")
    print("  Garantia do FGC (Fundo Garantidor de Créditos) de até R$ 250.000,00.")
    print("=" * 68 + "\n")


if __name__ == "__main__":
    main()
