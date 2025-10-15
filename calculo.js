// Objeto global para armazenar os dados de cada tipo de adesivo
let adesivos = {};

// ----------------------------------------------------
// 1. FUNÇÃO DE ADICIONAR ADESIVO
// ----------------------------------------------------
function adicionarAdesivo() {
	const container = document.getElementById('adesivosContainer');
	const index = document.querySelectorAll('.adesivo').length;

	const div = document.createElement('div');
	div.className = 'adesivo';
	div.dataset.index = index;

	div.innerHTML = `
    <h3>Adesivo ${index + 1}</h3>
    <button type="button" onclick="removerAdesivo(this)" class="btn-remover">Remover Adesivo</button>
    <label>Nome do adesivo:</label>
    <input type="text" class="nome-adesivo" name="nome" value="" required />
    <label>Adesivos por veículo:</label>
    <input type="number" class="por-veiculo" name="porVeiculo" value="1" min="1" required />
    <label>Largura do adesivo (cm):</label>
    <input type="number" class="largura-adesivo" name="largura" value="10" min="1" required />
    <label>Altura do adesivo (cm):</label>
    <input type="number" class="altura-adesivo" name="altura" value="10" min="1" required />
    <hr>
  `;

	container.appendChild(div);

	// HABILITA O BOTÃO DESFAZER
	const btnDesfazer = document.getElementById('btnDesfazer');
	if (btnDesfazer) {
		btnDesfazer.disabled = false;
	}
}

function desfazerAdicao() {
	const container = document.getElementById('adesivosContainer');
	const adesivosAtuais = container.querySelectorAll('.adesivo');

	// 1. Verifica se há adesivos para remover
	if (adesivosAtuais.length > 0) {
		// Seleciona o ÚLTIMO adesivo na lista (o mais recente)
		const ultimoAdesivo = adesivosAtuais[adesivosAtuais.length - 1];

		// Remove o último adesivo do DOM
		ultimoAdesivo.remove();

		// 2. Atualiza o estado do botão Desfazer
		// Desabilita se não houver mais adesivos
		if (adesivosAtuais.length - 1 === 0) {
			document.getElementById('btnDesfazer').disabled = true;
		}

		// 3. Opcional: Recalcula a área se for relevante
		if (adesivosAtuais.length - 1 > 0) {
			calcular();
		} else {
			document.getElementById('resultado').innerHTML = ''; // Limpa o resultado
		}
	} else {
		// Se já não houver adesivos, desabilita o botão por segurança
		document.getElementById('btnDesfazer').disabled = true;
	}
}

// A função removerAdesivo(this) ainda é útil para remoção individual
function removerAdesivo(buttonElement) {
	const adesivoDiv = buttonElement.closest('.adesivo');

	if (adesivoDiv) {
		adesivoDiv.remove();

		// Atualiza o estado do botão Desfazer (se o último foi removido manualmente)
		const adesivosRestantes = document
			.getElementById('adesivosContainer')
			.querySelectorAll('.adesivo').length;
		if (adesivosRestantes === 0) {
			document.getElementById('btnDesfazer').disabled = true;
			document.getElementById('resultado').innerHTML = '';
		} else {
			// Recalcula o resultado, pois o layout mudou
			calcular();
		}
	}
}

const salvaObjAdesivo = () => {
	const adesivoDivs = document.querySelectorAll('.adesivo');
	const resultadoObj = {};

	adesivoDivs.forEach((div) => {
		// Acessa os campos do adesivo
		const nomeInput = div.querySelector('input[name="nome"]');
		const larguraInput = div.querySelector('input[name="largura"]');
		const alturaInput = div.querySelector('input[name="altura"]');
		const porVeiculoInput = div.querySelector('input[name="porVeiculo"]');

		if (!nomeInput || !larguraInput || !alturaInput || !porVeiculoInput) {
			console.error('Erro: um ou mais campos não foram encontrados.');
			return;
		}

		const nome = nomeInput.value.trim();
		const largura = parseFloat(larguraInput.value);
		const altura = parseFloat(alturaInput.value);
		const porVeiculo = parseInt(porVeiculoInput.value);

		// Validação
		if (
			!nome ||
			isNaN(largura) ||
			largura <= 0 ||
			isNaN(altura) ||
			altura <= 0 ||
			isNaN(porVeiculo) ||
			porVeiculo <= 0
		) {
			console.warn('Adesivo ignorado devido a dados inválidos:', nome);
			return;
		}

		// Se a largura for maior que 130, divide em partes
		if (largura > 130) {
			const partes = Math.ceil(largura / 130);
			const larguraDividida = largura / partes;

			for (let i = 1; i <= partes; i++) {
				const nomeParte = `${nome} ${i}`;
				resultadoObj[nomeParte] = {
					nome: nomeParte,
					largura: larguraDividida.toFixed(2),
					altura,
					porVeiculo,
				};
			}
		} else {
			// Caso não precise dividir
			resultadoObj[nome] = { nome, largura, altura, porVeiculo };
		}
	});

	return resultadoObj;
};

function calcular() {
	// 1. Obter CAMPOS GLOBAIS
	const quantVeiculos = parseInt(
		document.getElementById('quantidadeVeiculos').value
	);
	const larguraMaterial = 130;

	if (isNaN(quantVeiculos) || quantVeiculos <= 0) {
		alert(
			'Por favor, insira a Quantidade de Veículos e a Largura do Material de Impressão corretamente.'
		);
		return;
	}

	// 2. Obter os dados dos adesivos (salvaObj() não está inclusa aqui, mas assumimos que funciona)
	// Certifique-se de que a variável global 'adesivos' está definida.
	adesivos = salvaObjAdesivo();
	console.log(adesivos);

	if (Object.keys(adesivos).length === 0) {
		window.alert('Nenhum adesivo válido encontrado para calculo');
		document.getElementById('resultado').innerHTML =
			"<p class='warning'>Nenhum adesivo válido encontrado para cálculo.</p>";
		return;
	}

	let alturaTotalImpressao = 0;
	let resumoHTML = '';

	// 3. Iterar sobre cada tipo de adesivo para calcular sua altura otimizada
	for (const nomeAdesivo in adesivos) {
		const adesivo = adesivos[nomeAdesivo];

		const totalAdesivos = adesivo.porVeiculo * quantVeiculos;
		const larguraComMargem = adesivo.largura + 1;
		const alturaComMargem = adesivo.altura + 1;
		const conjuntosPorLinha = Math.floor(larguraMaterial / larguraComMargem);

		let resultadoAdesivo;

		if (conjuntosPorLinha === 0) {
			resultadoAdesivo = `<li class='error'><strong>${adesivo.nome} (${adesivo.largura}x${adesivo.altura}cm):</strong> ERRO! Largura excede o material. Não calculado.</li>`;
		} else {
			const quantidadeLinhas = Math.ceil(totalAdesivos / conjuntosPorLinha);
			const alturaOcupada = quantidadeLinhas * alturaComMargem;
			alturaTotalImpressao += alturaOcupada;

			resultadoAdesivo = `
          <li>
              <strong>${adesivo.nome}</strong> (${adesivo.largura}x${
				adesivo.altura
			} cm):
              <ul>
                  <li>Total de Adesivos: <strong>${totalAdesivos}</strong></li>
                  <li>Linhas Necessárias: <strong>${quantidadeLinhas}</strong></li>
                  <li>Altura Ocupada (por tipo): <span class='height-detail'>${alturaOcupada.toFixed(
										2
									)} cm</span></li>
              </ul>
          </li>
      `;
		}
		// ACUMULAMOS O HTML DE CADA ADESIVO
		resumoHTML += resultadoAdesivo;
	}

	// 4. Calcular a área total de impressão (m²)
	const areaTotal = (
		(alturaTotalImpressao / 100) *
		(larguraMaterial / 100)
	).toFixed(2);

	// 5. Exibir o resultado usando innerHTML (CORRIGIDO AQUI!)
	document.getElementById('resultado').innerHTML = `
    <div class="result-box">
        <h2>📊 Resumo do Cálculo</h2>

        <div class="section">
            <h3>Dados Gerais do Projeto</h3>
            <p><strong>Total de Veículos:</strong> ${quantVeiculos}</p>
            <p>
                <strong>Largura do Material:</strong> ${larguraMaterial.toFixed(
									2
								)} cm
            </p>
            <p>
                <strong>Altura Total Necessária:</strong> 
                <span class='height-detail' style='font-size:1.1em;'>${alturaTotalImpressao.toFixed(
									2
								)} cm</span>
            </p>
        </div>
        
        <div class="final-result">
            <h3>Resultado Final da Impressão</h3>
            <p>Área Total de Impressão:</p>
            <div class="value-box area-value"><strong>${areaTotal}</strong> m²</div>
        </div>
        
        <p class="nota">
            <em>Nota: Os cálculos consideram uma margem de segurança de 1cm em altura e largura para cortes.</em>
        </p>
        
        <div class="section">
            <h3>Otimização por Tipo de Adesivo</h3>
            <ul class="adesivo-list">${resumoHTML}</ul> 
        </div>
    </div>
  `;
}

// ----------------------------------------------------
// 6. BLOCO DE INICIALIZAÇÃO (EXECUTA APENAS UMA VEZ NA CARGA DA PÁGINA)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
	// Esta chamada ocorre APENAS na carga da página, adicionando o primeiro adesivo.
	adicionarAdesivo();

	// Desabilita o botão 'Desfazer Adição' inicialmente, pois não há o que desfazer.
	const btnDesfazer = document.getElementById('btnDesfazer');
	if (btnDesfazer) {
		btnDesfazer.disabled = true;
	}
});
/*let areaTotal = 0;
  let resumo = "";

  // O salvaObj AGORA retorna o OBJETO de adesivos
  adesivos = salvaObj();

  // Verifica se o objeto está vazio
  if (Object.keys(adesivos).length === 0) {
    document.getElementById("resultado").innerText =
      "Nenhum adesivo válido encontrado para cálculo.";
    return;
  }

  // Itera sobre as propriedades do objeto usando `for...in` ou `Object.values`
  for (const nomeAdesivo in adesivos) {
    const adesivo = adesivos[nomeAdesivo];
    const totalAdesivos = adesivo.porVeiculo * adesivo.veiculos;
    const areaUnitaria = (adesivo.largura / 100) * (adesivo.altura / 100);
    const areaAdesivo = areaUnitaria * totalAdesivos;
    areaTotal += areaAdesivo;

    resumo += `• ${adesivo.nome}: ${totalAdesivos} adesivos (${
      adesivo.largura
    }x${adesivo.altura}cm) → ${areaAdesivo.toFixed(2)} m²\n`;
  }

  document.getElementById(
    "resultado"
  ).innerText = `Resumo por tipo:\n${resumo}\n---
Área total de impressão (sem otimização de corte): ${areaTotal.toFixed(2)} m²`;*/

/*function calcular() {
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
}*/
