// ======================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// Turma e número de chamada não podem ser alterados pela página.
// ======================================================
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 22,
  apiUrl: "https://boletim-api.profbt.com.br"
};

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
const FREQUENCIA_DEMONSTRATIVA = 92;

// ======================================================
// ESTADO DA SESSÃO (somente em memória)
// ======================================================
let pinSessao = null;
let dadosAtuais = null;
let modoEdicao = false;

// ======================================================
// FUNÇÃO: normalizarNota(valor)
// ======================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// ======================================================
// FUNÇÃO: formatarNota(nota)
// ======================================================
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// ======================================================
// FUNÇÃO: calcularMedia(notas)
// ======================================================
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

// ======================================================
// FUNÇÃO: somarFaltas(lista)
// ======================================================
function somarFaltas(lista) {
  return lista.reduce((acc, n) => acc + n, 0);
}

// ======================================================
// FUNÇÃO: definirSituacao(media)
// ======================================================
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

// ======================================================
// FUNÇÃO: criarLinhaTabela(item)
// ======================================================
function criarLinhaTabela(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  let classe = "situacao-neutra";
  if (situacao === "Bom desempenho") classe = "situacao-bom";
  if (situacao === "Atenção") classe = "situacao-atencao";

  const textoN1 = n1 === null ? "Ainda não lançada" : formatarNota(n1);
  const textoN2 = n2 === null ? "Ainda não lançada" : formatarNota(n2);
  const textoN3 = n3 === null ? "Ainda não lançada" : formatarNota(n3);
  const textoMedia = media === null ? "Ainda não lançada" : formatarNota(media);

  const tr = document.createElement("tr");

  const tdDisciplina = document.createElement("td");
  tdDisciplina.textContent = item.disciplina;
  tr.appendChild(tdDisciplina);

  const tdN1 = document.createElement("td");
  tdN1.textContent = textoN1;
  tr.appendChild(tdN1);

  const tdN2 = document.createElement("td");
  tdN2.textContent = textoN2;
  tr.appendChild(tdN2);

  const tdN3 = document.createElement("td");
  tdN3.textContent = textoN3;
  tr.appendChild(tdN3);

  const tdMedia = document.createElement("td");
  tdMedia.textContent = textoMedia;
  tr.appendChild(tdMedia);

  const tdFaltas = document.createElement("td");
  tdFaltas.textContent = faltas;
  tr.appendChild(tdFaltas);

  const tdSituacao = document.createElement("td");
  tdSituacao.textContent = situacao;
  tdSituacao.className = classe;
  tr.appendChild(tdSituacao);

  return tr;
}

// ======================================================
// FUNÇÃO: preencherTabela()
// ======================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  if (!corpo) return;

  corpo.innerHTML = "";

  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) {
    return;
  }

  dadosAtuais.disciplinas.forEach((item) => {
    corpo.appendChild(criarLinhaTabela(item));
  });
}

// ======================================================
// FUNÇÃO: criarCard(icone, titulo, valor)
// ======================================================
function criarCard(icone, titulo, valor) {
  const card = document.createElement("div");
  card.className = "card";

  const spanIcone = document.createElement("span");
  spanIcone.className = "icone";
  spanIcone.textContent = icone;
  card.appendChild(spanIcone);

  const divTitulo = document.createElement("div");
  divTitulo.className = "titulo-card";
  divTitulo.textContent = titulo;
  card.appendChild(divTitulo);

  const divValor = document.createElement("div");
  divValor.className = "valor-card";
  divValor.textContent = valor;
  card.appendChild(divValor);

  return card;
}

// ======================================================
// FUNÇÃO: preencherCards()
// ======================================================
function preencherCards() {
  const area = document.getElementById("cards");
  if (!area) return;

  area.innerHTML = "";

  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) {
    return;
  }

  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltas = 0;
  let bons = 0;
  let atencao = 0;

  dadosAtuais.disciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const faltasItem = Array.isArray(item.faltas) ? item.faltas : [];
    totalFaltas += somarFaltas(faltasItem);

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

  area.appendChild(criarCard("📊", "Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral)));
  area.appendChild(criarCard("📌", "Total de faltas", String(totalFaltas)));
  area.appendChild(criarCard("✅", "Bom desempenho", bons + " disciplinas"));
  area.appendChild(criarCard("⚠️", "Precisam de atenção", atencao + " disciplinas"));
  area.appendChild(criarCard("📅", "Frequência", FREQUENCIA_DEMONSTRATIVA + "% — Frequência adequada"));
}

// ======================================================
// FUNÇÃO: clonarDados(dados)
// ======================================================
function clonarDados(dados) {
  return JSON.parse(JSON.stringify(dados));
}

// ======================================================
// FUNÇÃO: renderizarBoletim()
// ======================================================
function renderizarBoletim() {
  preencherCards();
  preencherTabela();
}

// ======================================================
// FUNÇÃO: mostrarMensagemAcesso
// ======================================================
function mostrarMensagemAcesso(texto, tipo) {
  const el = document.getElementById("mensagem-acesso");
  if (!el) return;
  el.textContent = texto;
  el.className = "mensagem-acesso" + (tipo ? " " + tipo : "");
}

// ======================================================
// FUNÇÃO: mostrarMensagemEdicao
// ======================================================
function mostrarMensagemEdicao(texto, tipo) {
  const el = document.getElementById("mensagem-edicao");
  if (!el) return;
  el.textContent = texto;
  el.className = "mensagem-edicao" + (tipo ? " " + tipo : "");
}

// ======================================================
// FUNÇÃO: entrar()
// ======================================================
async function entrar() {
  const campoPin = document.getElementById("campo-pin");
  const botaoEntrar = document.getElementById("botao-entrar");
  if (!campoPin || !botaoEntrar) return;

  const pinDigitado = campoPin.value.trim();

  if (pinDigitado === "") {
    mostrarMensagemAcesso("Digite o PIN para entrar.", "erro");
    return;
  }

  botaoEntrar.disabled = true;
  mostrarMensagemAcesso("Conectando...", "");

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      mostrarMensagemAcesso("Turma, chamada ou PIN inválidos.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      mostrarMensagemAcesso("Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    const json = await resposta.json();

    pinSessao = pinDigitado;

    if (json && json.dados !== null && json.dados !== undefined) {
      dadosAtuais = json.dados;
    } else {
      dadosAtuais = { disciplinas: clonarDados(disciplinas) };
    }

    campoPin.value = "";

    const acesso = document.getElementById("acesso");
    const areaBoletim = document.getElementById("area-boletim");
    if (acesso) acesso.classList.add("escondido");
    if (areaBoletim) areaBoletim.classList.remove("escondido");

    renderizarBoletim();
    atualizarGraficos();
  } catch (erro) {
    mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
  } finally {
    botaoEntrar.disabled = false;
  }
}

// ======================================================
// FUNÇÃO: abrirEdicao()
// ======================================================
function abrirEdicao() {
  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) return;

  const areaEdicao = document.getElementById("area-edicao");
  const campos = document.getElementById("campos-edicao");
  if (!areaEdicao || !campos) return;

  campos.innerHTML = "";

  dadosAtuais.disciplinas.forEach((item, indice) => {
    const bloco = document.createElement("div");
    bloco.className = "disciplina-edicao";

    const nome = document.createElement("span");
    nome.className = "nome-disciplina";
    nome.textContent = item.disciplina;
    bloco.appendChild(nome);

    const linhaNotas = document.createElement("div");
    linhaNotas.className = "linha-edicao";

    ["tri1", "tri2", "tri3"].forEach((chave, i) => {
      const campo = document.createElement("div");
      campo.className = "campo-edicao";

      const label = document.createElement("label");
      label.textContent = (i + 1) + "º Tri";
      campo.appendChild(label);

      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "decimal";
      input.dataset.indice = String(indice);
      input.dataset.campo = chave;
      input.dataset.tipo = "nota";

      const valorOriginal = normalizarNota(item[chave]);
      input.value = valorOriginal === null ? "" : formatarNota(valorOriginal);

      campo.appendChild(input);
      linhaNotas.appendChild(campo);
    });

    bloco.appendChild(linhaNotas);

    const linhaFaltas = document.createElement("div");
    linhaFaltas.className = "linha-edicao";
    linhaFaltas.style.marginTop = "10px";

    ["0", "1", "2"].forEach((pos, i) => {
      const campo = document.createElement("div");
      campo.className = "campo-edicao";

      const label = document.createElement("label");
      label.textContent = "Faltas " + (i + 1) + "º Tri";
      campo.appendChild(label);

      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.dataset.indice = String(indice);
      input.dataset.campo = "faltas";
      input.dataset.pos = pos;
      input.dataset.tipo = "falta";

      const faltasItem = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
      const valorFalta = faltasItem[Number(pos)];
      input.value = (valorFalta === undefined || valorFalta === null) ? "0" : String(valorFalta);

      campo.appendChild(input);
      linhaFaltas.appendChild(campo);
    });

    bloco.appendChild(linhaFaltas);
    campos.appendChild(bloco);
  });

  areaEdicao.classList.remove("escondido");
  modoEdicao = true;
  mostrarMensagemEdicao("", "");
}

// ======================================================
// FUNÇÃO: fecharEdicao()
// ======================================================
function fecharEdicao() {
  const areaEdicao = document.getElementById("area-edicao");
  if (areaEdicao) areaEdicao.classList.add("escondido");
  modoEdicao = false;
}

// ======================================================
// FUNÇÃO: validarNotaEdicao(valor)
// ======================================================
function validarNotaEdicao(valor) {
  const texto = String(valor).trim();

  if (texto === "") {
    return { valido: true, valor: null };
  }

  const normalizado = texto.replace(",", ".");
  const numero = Number(normalizado);

  if (isNaN(numero)) {
    return { valido: false };
  }

  if (numero < 0 || numero > 10) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

// ======================================================
// FUNÇÃO: validarFaltaEdicao(valor)
// ======================================================
function validarFaltaEdicao(valor) {
  const texto = String(valor).trim();

  if (texto === "") {
    return { valido: false };
  }

  if (!/^\d+$/.test(texto)) {
    return { valido: false };
  }

  const numero = Number(texto);

  if (numero < 0) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

// ======================================================
// FUNÇÃO: salvar()
// ======================================================
async function salvar() {
  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) return;
  if (!pinSessao) {
    mostrarMensagemEdicao("Sessão expirada. Faça login novamente.", "erro");
    return;
  }

  const inputs = document.querySelectorAll("#campos-edicao input");
  let temErro = false;

  inputs.forEach((input) => input.classList.remove("invalido"));

  const novosDados = clonarDados(dadosAtuais);

  inputs.forEach((input) => {
    const indice = Number(input.dataset.indice);
    const campo = input.dataset.campo;
    const tipo = input.dataset.tipo;

    if (tipo === "nota") {
      const resultado = validarNotaEdicao(input.value);
      if (!resultado.valido) {
        input.classList.add("invalido");
        temErro = true;
        return;
      }
      novosDados.disciplinas[indice][campo] = resultado.valor;
    } else if (tipo === "falta") {
      const pos = Number(input.dataset.pos);
      const resultado = validarFaltaEdicao(input.value);
      if (!resultado.valido) {
        input.classList.add("invalido");
        temErro = true;
        return;
      }
      if (!Array.isArray(novosDados.disciplinas[indice].faltas)) {
        novosDados.disciplinas[indice].faltas = [0, 0, 0];
      }
      novosDados.disciplinas[indice].faltas[pos] = resultado.valor;
    }
  });

  if (temErro) {
    mostrarMensagemEdicao("Há campos inválidos. Corrija os destaques em vermelho.", "erro");
    return;
  }

  const botaoSalvar = document.getElementById("botao-salvar");
  if (botaoSalvar) botaoSalvar.disabled = true;
  mostrarMensagemEdicao("Salvando...", "");

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados.disciplinas
        }
      })
    });

    if (resposta.status === 401) {
      mostrarMensagemEdicao("Sessão inválida. Faça login novamente.", "erro");
      return;
    }

    if (resposta.status === 429) {
      mostrarMensagemEdicao("Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
      return;
    }

    if (!resposta.ok) {
      mostrarMensagemEdicao("Não foi possível salvar. Tente novamente.", "erro");
      return;
    }

    dadosAtuais = novosDados;
    renderizarBoletim();
    atualizarGraficos();

    mostrarMensagemEdicao("Dados salvos com sucesso.", "ok");

    fecharEdicao();
  } catch (erro) {
    mostrarMensagemEdicao("Não foi possível salvar. Tente novamente.", "erro");
  } finally {
    if (botaoSalvar) botaoSalvar.disabled = false;
  }
}

// ======================================================
// CAMADA DE GRÁFICOS — PREMIUM (somente leitura)
// ======================================================
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Referência interna (NUNCA exibida na interface)
const REFERENCIA_INTERNA_FALTAS = 350;

// Paleta premium
const CORES_GRAFICOS = {
  azul: "#1e3a8a",
  azulMedio: "#2563eb",
  azulClaro: "#60a5fa",
  azulMuitoClaro: "#93c5fd",
  azulGradienteInicio: "#1e3a8a",
  azulGradienteFim: "#3b82f6",
  verdeGradienteInicio: "#15803d",
  verdeGradienteFim: "#22c55e",
  vermelhoGradienteInicio: "#dc2626",
  vermelhoGradienteFim: "#f97316",
  grade: "rgba(30, 58, 138, 0.08)",
  texto: "#374151",
  textoSuave: "#6b7280"
};

// ------------------------------------------------------
// Gera um gradiente vertical para barras
// ------------------------------------------------------
function criarGradienteVertical(ctx, area, corInicio, corFim) {
  const g = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  g.addColorStop(0, corInicio);
  g.addColorStop(1, corFim);
  return g;
}

// ------------------------------------------------------
// Plugin customizado: desenha o valor ao lado de cada barra
// ------------------------------------------------------
const pluginValorBarra = {
  id: "pluginValorBarra",
  afterDatasetsDraw(chart, args, opts) {
    const { ctx, data } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;

    ctx.save();
    ctx.font = "600 11px Arial, Helvetica, sans-serif";
    ctx.textBaseline = "middle";

    meta.data.forEach((elemento, i) => {
      const valor = data.datasets[0].data[i];
      if (valor === null || valor === undefined) return;

      const texto = Number(valor).toFixed(1).replace(".", ",");
      const isHorizontal = chart.options.indexAxis === "y";

      ctx.fillStyle = opts.cor || CORES_GRAFICOS.azul;

      if (isHorizontal) {
        ctx.textAlign = "left";
        ctx.fillText(texto, elemento.x + 8, elemento.y);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(texto, elemento.x, elemento.y - 10);
      }
    });

    ctx.restore();
  }
};

// ------------------------------------------------------
// Tooltip padrão premium
// ------------------------------------------------------
function tooltipPremium() {
  return {
    backgroundColor: "rgba(15, 23, 42, 0.94)",
    titleColor: "#ffffff",
    bodyColor: "#e5e7eb",
    titleFont: { size: 12, weight: "700" },
    bodyFont: { size: 12 },
    padding: 10,
    cornerRadius: 8,
    borderColor: "rgba(96, 165, 250, 0.4)",
    borderWidth: 1,
    displayColors: false
  };
}

// ------------------------------------------------------
// Escalas base premium
// ------------------------------------------------------
function escalasBase() {
  return {
    x: {
      ticks: { color: CORES_GRAFICOS.texto, font: { size: 11 } },
      grid: { color: CORES_GRAFICOS.grade, drawBorder: false },
      border: { display: false }
    },
    y: {
      ticks: { color: CORES_GRAFICOS.texto, font: { size: 11 } },
      grid: { color: CORES_GRAFICOS.grade, drawBorder: false },
      border: { display: false }
    }
  };
}

// ------------------------------------------------------
// Cálculos (somente leitura)
// ------------------------------------------------------
function calcularDadosMediasPorDisciplina() {
  const labels = [];
  const valores = [];

  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) {
    return { labels, valores };
  }

  dadosAtuais.disciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);

    labels.push(item.disciplina);
    valores.push(media === null ? null : Number(media.toFixed(2)));
  });

  return { labels, valores };
}

function calcularDadosEvolucaoGeral() {
  const labels = ["1º Tri", "2º Tri", "3º Tri"];
  const valores = [null, null, null];

  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) {
    return { labels, valores };
  }

  const chaves = ["tri1", "tri2", "tri3"];

  chaves.forEach((chave, i) => {
    const notasValidas = [];
    dadosAtuais.disciplinas.forEach((item) => {
      const nota = normalizarNota(item[chave]);
      if (nota !== null) notasValidas.push(nota);
    });

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, n) => acc + n, 0);
      valores[i] = Number((soma / notasValidas.length).toFixed(2));
    }
  });

  return { labels, valores };
}

function calcularDadosFaltasPorTrimestre() {
  const labels = ["1º Tri", "2º Tri", "3º Tri"];
  const valores = [0, 0, 0];
  let totalFaltas = 0;

  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) {
    return { labels, valores, totalFaltas };
  }

  dadosAtuais.disciplinas.forEach((item) => {
    const faltasItem = Array.isArray(item.faltas) ? item.faltas : [];
    for (let i = 0; i < 3; i++) {
      const v = Number(faltasItem[i]);
      if (!isNaN(v)) {
        valores[i] += v;
        totalFaltas += v;
      }
    }
  });

  return { labels, valores, totalFaltas };
}

// ------------------------------------------------------
// GRÁFICO 1 — Média por disciplina
// ------------------------------------------------------
function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas || typeof Chart === "undefined") return;

  if (graficoMedias) {
    graficoMedias.destroy();
    graficoMedias = null;
  }

  const { labels, valores } = calcularDadosMediasPorDisciplina();
  const ctx = canvas.getContext("2d");

  graficoMedias = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Média",
        data: valores,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return CORES_GRAFICOS.azulMedio;
          return criarGradienteVertical(
            c,
            chartArea,
            CORES_GRAFICOS.azulGradienteInicio,
            CORES_GRAFICOS.azulGradienteFim
          );
        },
        borderColor: "rgba(30, 58, 138, 0.35)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.78,
        categoryPercentage: 0.86
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      animation: { duration: 400, easing: "easeOutQuart" },
      layout: { padding: { right: 36, left: 4, top: 4, bottom: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipPremium(),
          callbacks: {
            title: (items) => items[0].label,
            label: (context) => {
              const v = context.parsed.x;
              if (v === null || v === undefined) return "Ainda não lançada";
              return "Média: " + v.toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: CORES_GRAFICOS.texto, font: { size: 11 }, stepSize: 2 },
          grid: { color: CORES_GRAFICOS.grade, drawBorder: false },
          border: { display: false }
        },
        y: {
          ticks: { color: CORES_GRAFICOS.texto, font: { size: 11 }, autoSkip: false },
          grid: { display: false },
          border: { display: false }
        }
      }
    },
    plugins: [pluginValorBarra]
  });
}

// ------------------------------------------------------
// GRÁFICO 2 — Evolução da média geral
// ------------------------------------------------------
function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas || typeof Chart === "undefined") return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
    graficoEvolucao = null;
  }

  const { labels, valores } = calcularDadosEvolucaoGeral();

  graficoEvolucao = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Média geral",
        data: valores,
        borderColor: CORES_GRAFICOS.azulMedio,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: CORES_GRAFICOS.azulMedio,
        pointBorderWidth: 3,
        pointHoverBackgroundColor: CORES_GRAFICOS.azulMedio,
        pointHoverBorderColor: "#ffffff",
        tension: 0.35,
        spanGaps: false,
        fill: true,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(37, 99, 235, 0.12)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(37, 99, 235, 0.28)");
          g.addColorStop(1, "rgba(37, 99, 235, 0.02)");
          return g;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450, easing: "easeOutQuart" },
      layout: { padding: { top: 8, bottom: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipPremium(),
          callbacks: {
            title: (items) => items[0].label,
            label: (context) => {
              const v = context.parsed.y;
              if (v === null || v === undefined) return "Ainda não lançada";
              return "Média: " + v.toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: CORES_GRAFICOS.texto, font: { size: 12, weight: "600" } },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          min: 0,
          max: 10,
          ticks: { color: CORES_GRAFICOS.texto, font