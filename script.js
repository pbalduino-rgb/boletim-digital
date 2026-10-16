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
// No futuro isso será calculado de outra forma.
const FREQUENCIA_DEMONSTRATIVA = 92;

// ======================================================
// ESTADO DA SESSÃO (somente em memória)
// ======================================================
let pinSessao = null;
let dadosAtuais = null;
let modoEdicao = false;

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

  // Cria a linha usando DOM seguro (textContent)
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
// Limpa o <tbody> e insere as linhas atualizadas.
// ======================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  if (!corpo) return;

  // Limpa antes de reconstruir (evita duplicação)
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
// Gera o HTML de um card de resumo.
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
// Calcula os resumos e monta os cards.
// ======================================================
function preencherCards() {
  const area = document.getElementById("cards");
  if (!area) return;

  // Limpa antes de reconstruir (evita duplicação)
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
// Cópia profunda simples para não alterar os dados originais.
// ======================================================
function clonarDados(dados) {
  return JSON.parse(JSON.stringify(dados));
}

// ======================================================
// FUNÇÃO: renderizarBoletim()
// Renderiza tabela e cards com os dados atuais.
// ======================================================
function renderizarBoletim() {
  preencherCards();
  preencherTabela();
}

// ======================================================
// FUNÇÃO: mostrarMensagemAcesso(texto, tipo)
// tipo: "erro" | "ok" | ""
// ======================================================
function mostrarMensagemAcesso(texto, tipo) {
  const el = document.getElementById("mensagem-acesso");
  if (!el) return;
  el.textContent = texto;
  el.className = "mensagem-acesso" + (tipo ? " " + tipo : "");
}

// ======================================================
// FUNÇÃO: mostrarMensagemEdicao(texto, tipo)
// ======================================================
function mostrarMensagemEdicao(texto, tipo) {
  const el = document.getElementById("mensagem-edicao");
  if (!el) return;
  el.textContent = texto;
  el.className = "mensagem-edicao" + (tipo ? " " + tipo : "");
}

// ======================================================
// FUNÇÃO: entrar()
// Faz POST /abrir e carrega os dados.
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

    // Guarda o PIN apenas em memória durante a sessão
    pinSessao = pinDigitado;

    // Decide de onde vêm os dados
    if (json && json.dados !== null && json.dados !== undefined) {
      // Dados da API têm prioridade absoluta
      dadosAtuais = json.dados;
    } else {
      // Sem dados salvos: usa os dados fictícios do projeto
      dadosAtuais = { disciplinas: clonarDados(disciplinas) };
    }

    // Limpa o campo do PIN após login bem-sucedido
    campoPin.value = "";

    // Mostra a área do boletim e esconde a tela de acesso
    const acesso = document.getElementById("acesso");
    const areaBoletim = document.getElementById("area-boletim");
    if (acesso) acesso.classList.add("escondido");
    if (areaBoletim) areaBoletim.classList.remove("escondido");

    // Renderiza
    renderizarBoletim();
  } catch (erro) {
    mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
  } finally {
    botaoEntrar.disabled = false;
  }
}

// ======================================================
// FUNÇÃO: abrirEdicao()
// Monta os campos de edição a partir dos dados atuais.
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

    // Notas
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

    // Faltas
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
// Retorna { valido, valor } ou { valido: false }
// Aceita: vazio, número 0–10 (com ponto ou vírgula)
// ======================================================
function validarNotaEdicao(valor) {
  const texto = String(valor).trim();

  if (texto === "") {
    return { valido: true, valor: null };
  }

  // Substitui vírgula por ponto
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
// Aceita: número inteiro >= 0
// ======================================================
function validarFaltaEdicao(valor) {
  const texto = String(valor).trim();

  if (texto === "") {
    return { valido: false };
  }

  // Só dígitos (inteiro não negativo)
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
// Valida todos os campos, monta o payload e envia para a API.
// ======================================================
async function salvar() {
  if (!dadosAtuais || !Array.isArray(dadosAtuais.disciplinas)) return;
  if (!pinSessao) {
    mostrarMensagemEdicao("Sessão expirada. Faça login novamente.", "erro");
    return;
  }

  const inputs = document.querySelectorAll("#campos-edicao input");
  let temErro = false;

  // Limpa marcações antigas
  inputs.forEach((input) => input.classList.remove("invalido"));

  // Cópia para montar o novo conjunto de dados
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

    // Sucesso: adota os novos dados e renderiza novamente
    dadosAtuais = novosDados;
    renderizarBoletim();

    mostrarMensagemEdicao("Dados salvos com sucesso.", "ok");

    // Fecha a edição apenas após sucesso
    fecharEdicao();
  } catch (erro) {
    mostrarMensagemEdicao("Não foi possível salvar. Tente novamente.", "erro");
  } finally {
    if (botaoSalvar) botaoSalvar.disabled = false;
  }
}

// ======================================================
// INICIALIZAÇÃO
// Roda quando a página terminar de carregar.
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Botão entrar
  const botaoEntrar = document.getElementById("botao-entrar");
  if (botaoEntrar) botaoEntrar.addEventListener("click", entrar);

  // Enter no campo PIN
  const campoPin = document.getElementById("campo-pin");
  if (campoPin) {
    campoPin.addEventListener("keydown", (e) => {
      if (e.key === "Enter") entrar();
    });
  }

  // Botão alterar dados
  const botaoAlterar = document.getElementById("botao-alterar");
  if (botaoAlterar) {
    botaoAlterar.addEventListener("click", () => {
      if (modoEdicao) {
        fecharEdicao();
      } else {
        abrirEdicao();
      }
    });
  }

  // Botão salvar
  const botaoSalvar = document.getElementById("botao-salvar");
  if (botaoSalvar) botaoSalvar.addEventListener("click", salvar);

  // Botão cancelar
  const botaoCancelar = document.getElementById("botao-cancelar");
  if (botaoCancelar) {
    botaoCancelar.addEventListener("click", () => {
      mostrarMensagemEdicao("", "");
      fecharEdicao();
    });
  }
});