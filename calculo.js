function calcular() {
  const quantVeiculos = parseInt(document.getElementById('quantidadeVeiculos').value);
  const quantAdesivos = parseInt(document.getElementById('adesivosPorVeiculo').value);
  const alturaAdesivo = parseInt(document.getElementById('alturaAdesivo').value);
  const larguraAdesivo = parseFloat(document.getElementById('larguraAdesivo').value);
  const larguraMaterial = parseFloat(document.getElementById('larguraImpressora').value);

  if (isNaN(quantVeiculos) || isNaN(quantAdesivos) || isNaN(alturaAdesivo) || isNaN(larguraAdesivo) || isNaN(larguraMaterial)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const conjuntosPorLinha = Math.floor(larguraMaterial / (larguraAdesivo + 1));
  const alturaLinha = alturaAdesivo + 1;
  const totalAdesivos = quantVeiculos * quantAdesivos;
  const quantidadeLinhas = Math.ceil(totalAdesivos / conjuntosPorLinha);
  const alturaTotal = quantidadeLinhas * alturaLinha;
  const areaTotal = ((alturaTotal / 100) * (larguraMaterial / 100)).toFixed(2);

  document.getElementById('resultado').innerText =
    `Linhas necessárias: ${quantidadeLinhas}
    Altura total: ${alturaTotal.toFixed(2)} cm
    Área total de impressão: ${areaTotal} m²`;
}


function adicionarCampo(labelTexto, inputId) {
  const container = document.querySelector('#adesivosContainer');

  // Cria o label
  const label = document.createElement('label');
  label.textContent = labelTexto;
  label.setAttribute('for', inputId);

  // Cria o input
  const input = document.createElement('input');
  input.type = 'number';
  input.id = inputId;

  // Adiciona ao container
  container.appendChild(label);
  container.appendChild(input);
}