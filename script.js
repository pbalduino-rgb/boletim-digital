// ======================================================
// DADOS FICTÍCIOS DO 8º ANO
// Array de objetos: cada objeto é uma disciplina.
// ======================================================
const disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Média mínima para "Bom desempenho"
const MEDIA_MINIMA = 6.0;

// Frequência FICTÍCIA apenas para demonstração.
// No futuro isso será calculado de outra forma.
const FREQUENCIA_DEMONSTRATIVA = 92;

// ======================================================
// FUNÇÃO: normalizarNota(valor)
// Converte qualquer valor recebido para a escala 0–10.
// Retorna null quando a nota ainda não foi lançada.
// ======================================================
function normalizarNota(valor) {
  // Vazio, null ou undefined = ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  // Se não for número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // 0 a 10: permanece
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Maior que 10 e até 100: divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras: inválido
  return null;
}

// ======================================================
// FUNÇÃO: formatarNota(nota)
// Mostra a nota com 1 casa decimal ou "—" se for null.
// ======================================================
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// ======================================================
// FUNÇÃO: calcularMedia(notas)
// Média apenas das notas válidas (ignora null).
// Se não houver nenhuma válida, retorna null.
// ======================================================
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

// ======================================================
// FUNÇÃO: somarFaltas(lista)
// Soma os valores de um array de faltas.
// ======================================================
function somarFaltas(lista) {
  return lista.reduce((acc, n) => acc + n, 0);
}

// ======================================================
// FUNÇÃO: definirSituacao(media)
// Regras:
//   media >= 6  → "Bom desempenho"
//   media < 6   → "Atenção"
//   media null  → "Nota ainda não disponível"
// ======================================================
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

// ======================================================
// FUNÇÃO: criarLinhaTabela(item)
// Monta o HTML de uma linha <tr> para a tabela.
// ======================================================
function criarLinhaTabela(item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Classe CSS para colorir a situação
  let classe = "situacao-neutra";
  if (situacao === "Bom desempenho") classe = "situacao-bom";
  if (situacao === "Atenção") classe = "situacao-atencao";

  // Texto de notas ausentes
  const textoN1 = n1 === null ? "Ainda não lançada" : formatarNota(n1);
  const textoN2 = n2 === null ? "Ainda não lançada" : formatarNota(n2);
  const textoN3 = n3 === null ? "Ainda não lançada" : formatarNota(n3);
  const textoMedia = media === null ? "Ainda não lançada" : formatarNota(media);

  return `
    <tr>
      <td>${item.disciplina}</td>
      <td>${textoN1}</td>
      <td>${textoN2}</td>
      <td>${textoN3}</td>
      <td>${textoMedia}</td>
      <td>${faltas}</td>
      <td class="${classe}">${situacao}</td>
    </tr>
  `;
}

// ======================================================
// FUNÇÃO: preencherTabela()
// Usa forEach para percorrer todas as disciplinas
// e injetar as linhas no <tbody id="corpo-tabela">.
// ======================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  let html = "";

  // forEach = para cada item do array, faz algo
  disciplinas.forEach((item) => {
    html += criarLinhaTabela(item);
  });

  // DOM: altera o conteúdo da página
  corpo.innerHTML = html;
}

// ======================================================
// FUNÇÃO: criarCard(icone, titulo, valor)
// Gera o HTML de um card de resumo.
// ======================================================
function criarCard(icone, titulo, valor) {
  return `
    <div class="card">
      <span class="icone">${icone}</span>
      <div class="titulo-card">${titulo}</div>
      <div class="valor-card">${valor}</div>
    </div>
  `;
}

// ======================================================
// FUNÇÃO: preencherCards()
// Calcula os resumos e monta os cards.
// ======================================================
function preencherCards() {
  const area = document.getElementById("cards");

  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltas = 0;
  let bons = 0;
  let atencao = 0;

  disciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    totalFaltas += somarFaltas(item.faltas);

    // if: só entra na conta se houver média válida
    if (media !== null) {
      somaMedias += media;
      qtdMedias++;

      if (media >= MEDIA_MINIMA) {
        bons++;
      } else {
        atencao++;
      }
    }
  });

  const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;

  let html = "";
  html += criarCard("📊", "Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral));
  html += criarCard("📌", "Total de faltas", totalFaltas);
  html += criarCard("✅", "Bom desempenho", bons + " disciplinas");
  html += criarCard("⚠️", "Precisam de atenção", atencao + " disciplinas");
  html += criarCard("📅", "Frequência", FREQUENCIA_DEMONSTRATIVA + "% — Frequência adequada");

  area.innerHTML = html;
}

// ======================================================
// INICIALIZAÇÃO
// Roda quando a página terminar de carregar.
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  preencherCards();
  preencherTabela();
});