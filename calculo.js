/*function calcular() {
  const quantVeiculos = parseInt(
    document.getElementById("quantidadeVeiculos").value
  );
  const quantAdesivos = parseInt(
    document.getElementById("adesivosPorVeiculo").value
  );
  const alturaAdesivo = parseInt(
    document.getElementById("alturaAdesivo").value
  );
  const larguraAdesivo = parseFloat(
    document.getElementById("larguraAdesivo").value
  );
  const larguraMaterial = parseFloat(
    document.getElementById("larguraImpressora").value
  );

  if (
    isNaN(quantVeiculos) ||
    isNaN(quantAdesivos) ||
    isNaN(alturaAdesivo) ||
    isNaN(larguraAdesivo) ||
    isNaN(larguraMaterial)
  ) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const conjuntosPorLinha = Math.floor(larguraMaterial / (larguraAdesivo + 1));
  const alturaLinha = alturaAdesivo + 1;
  const totalAdesivos = quantVeiculos * quantAdesivos;
  const quantidadeLinhas = Math.ceil(totalAdesivos / conjuntosPorLinha);
  const alturaTotal = quantidadeLinhas * alturaLinha;
  const areaTotal = ((alturaTotal / 100) * (larguraMaterial / 100)).toFixed(2);

  document.getElementById(
    "resultado"
  ).innerText = `Linhas necessárias: ${quantidadeLinhas}
    Altura total: ${alturaTotal.toFixed(2)} cm
    Área total de impressão: ${areaTotal} m²`;
}*/
let adesivos = [];

function adicionarAdesivo() {
  const container = document.getElementById("adesivosContainer");
  const index = document.querySelectorAll(".adesivo").length;

  const div = document.createElement("div");
  div.className = "adesivo";

  div.innerHTML = `
    <h3>Adesivo ${index + 1}</h3>
    <label>Local:</label>
    <input type="text" id="nome${index}" />
    <label>Adesivos por veículo:</label>
    <input type="number" id="porVeiculo${index}" />
    <label>Largura do adesivo (cm):</label>
    <input type="number" id="largura${index}" />
    <label>Altura do adesivo (cm):</label>
    <input type="number" id="altura${index}" />
    <hr>
  `;

  container.appendChild(div);
  // Habilita o botão Desfazer após adicionar um adesivo
  document.getElementById("btnDesfazer").disabled = false;
}

function desfazerAdicao() {
  const container = document.getElementById("adesivosContainer");
  const adesivosAtuais = container.querySelectorAll(".adesivo");

  // 1. Verifica se há adesivos para remover
  if (adesivosAtuais.length > 0) {
    // Seleciona o ÚLTIMO adesivo na lista (o mais recente)
    const ultimoAdesivo = adesivosAtuais[adesivosAtuais.length - 1];

    // Remove o último adesivo do DOM
    ultimoAdesivo.remove();

    // 2. Atualiza o estado do botão Desfazer
    // Desabilita se não houver mais adesivos
    if (adesivosAtuais.length - 1 === 0) {
      document.getElementById("btnDesfazer").disabled = true;
    }

    // 3. Opcional: Recalcula a área se for relevante
    if (adesivosAtuais.length - 1 > 0) {
      calcular();
    } else {
      document.getElementById("resultado").innerHTML = ""; // Limpa o resultado
    }
  } else {
    // Se já não houver adesivos, desabilita o botão por segurança
    document.getElementById("btnDesfazer").disabled = true;
  }
}

// A função removerAdesivo(this) ainda é útil para remoção individual
function removerAdesivo(buttonElement) {
  const adesivoDiv = buttonElement.closest(".adesivo");

  if (adesivoDiv) {
    adesivoDiv.remove();

    // Atualiza o estado do botão Desfazer (se o último foi removido manualmente)
    const adesivosRestantes = document
      .getElementById("adesivosContainer")
      .querySelectorAll(".adesivo").length;
    if (adesivosRestantes === 0) {
      document.getElementById("btnDesfazer").disabled = true;
      document.getElementById("resultado").innerHTML = "";
    } else {
      // Recalcula o resultado, pois o layout mudou
      calcular();
    }
  }
}

const salvaObj = () => {
  const adesivoDivs = document.querySelectorAll(".adesivo");
  const resultadoObj = { adesivos: [] };

  adesivoDivs.forEach((div, index) => {
    const nome = div.querySelector('input[name="nome"]').value;
    const largura = parseFloat(
      div.querySelector('input[name="largura"]').value
    );
    const altura = parseFloat(div.querySelector('input[name="altura"]').value);
    const porVeiculo = parseInt(
      div.querySelector('input[name="porVeiculo"]').value
    );
    const veiculos = parseInt(
      div.querySelector('input[name="veiculos"]').value
    );

    if (
      !nome ||
      isNaN(largura) ||
      isNaN(altura) ||
      isNaN(porVeiculo) ||
      isNaN(veiculos)
    )
      return;

    resultadoObj.adesivos.push({ nome, largura, altura, porVeiculo, veiculos });
  });

  console.log(resultadoObj);

  return resultadoObj;
};
function calcular() {
  let areaTotal = 0;
  let resumo = "";
  let adesivos = salvaObj();

  adesivos.forEach((adesivo) => {
    const totalAdesivos = adesivo.porVeiculo * adesivo.veiculos;
    const areaUnitaria = (adesivo.largura / 100) * (adesivo.altura / 100);
    const areaAdesivo = areaUnitaria * totalAdesivos;
    areaTotal += areaAdesivo;

    resumo += `• ${
      adesivo.nome
    }: ${totalAdesivos} adesivos → ${areaAdesivo.toFixed(2)} m²\n`;
  });

  document.getElementById(
    "resultado"
  ).innerText = `Resumo por tipo:\n${resumo}\nÁrea total de impressão: ${areaTotal.toFixed(
    2
  )} m²`;
}
