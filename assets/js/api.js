const form = document.getElementById('form-clima');
const resultado = document.getElementById('resultado');


/**
 * @async 
 *
 * @param {Event} e Evento de submissão do formulário
 * /
 * / Adiciona um listener para o evento de submissão do formulário
 * /
 *  
 * / @return {Promise<void>}
 */

form.addEventListener('submit', async (e) => {
e.preventDefault();

    const cidade = document.getElementById('cidade').value.trim();
    if (!cidade) return alert('Digite uma cidade.');

    try {
    // 1. Buscar coordenadas da cidade
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const respostaGeo = await fetch(urlGeo);
    const dadosGeo = await respostaGeo.json();

    const cidadeBrasil = dadosGeo.results.find(item => item.country_code === "BR");

    if (!cidadeBrasil) {
      // Limpa os campos visuais
        nomeCidade.textContent = "";
        temperatura.textContent = "";
        descricao.textContent = "";
        document.getElementById('previsao5dias').innerHTML = "";

    /**filtrar apenas por cidades no Brasil
     * * @type {Object|null}
     * @property {string} country_code Código do país (ex: "BR" para Brasil)
     * @property {string} name Nome da cidade
     * @property {number} latitude Latitude da cidade
     * @property {number} longitude Longitude da cidade
     * @property {string} timezone Fuso horário da cidade
     * @property {string} admin1 Admin1 (estado/província) da cidade    
     * 
    */

        // Mensagem de validação mais destacada
        const validacao = document.getElementById('validacao');
        validacao.textContent = `❌ Oops! Por enquanto, o sistema só funciona para cidades do Brasil.`;
        validacao.style.color = "red";
        validacao.style.fontWeight = "bold";
        validacao.style.marginTop = "1rem";

      // Oculta o resultado, se estiver visível
        resultado.style.display = "none";

      return; // Interrompe o fluxo
    }


    if (!dadosGeo.results || dadosGeo.results.length === 0) {
        alert('Cidade não encontrada!');
        return;
    }

    const cidadeInfo = dadosGeo.results[0];
    const latitude = cidadeInfo.latitude;
    const longitude = cidadeInfo.longitude;
    const nomeFormatado = `${cidadeInfo.name}, ${cidadeInfo.country}`;

    // 2. Buscar clima atual
    const urlAtual = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const respostaAtual = await fetch(urlAtual);
    const dadosAtual = await respostaAtual.json();
    const clima = dadosAtual.current_weather;

    // 3. Buscar previsão de 5 dias
    const urlPrevisao = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max,weathercode&forecast_days=5&timezone=auto`;
    const respostaPrevisao = await fetch(urlPrevisao);
    const dadosPrevisao = await respostaPrevisao.json();

    // 4. Exibir dados
    document.getElementById('nomeCidade').textContent = nomeFormatado;
    document.getElementById('temperatura').textContent = `🌡️ Temperatura atual: ${clima.temperature}°C`;
    document.getElementById('descricao').textContent = `🌥️ Condição: ${descreverClima(clima.weathercode)}`;
    resultado.style.display = 'block';

    exibirPrevisao5Dias(dadosPrevisao.daily);


    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
        alert('Erro ao buscar dados do clima.');
    }
    });

    function descreverClima(codigo) {
    const mapa = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    95: "Tempestade"
    };
    return mapa[codigo] || "Clima desconhecido";
    }

function exibirPrevisao5Dias(dados) {
    const dias = dados.time;
    const minimas = dados.temperature_2m_min;
    const maximas = dados.temperature_2m_max;
    const codigos = dados.weathercode;

    const container = document.getElementById('previsao5dias');
    container.innerHTML = '';

    for (let i = 0; i < dias.length; i++) {
        const data = new Date(dias[i]);
        const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
        const dia = data.getDate();
        const mes = data.toLocaleDateString('pt-BR', { month: 'long' });
        const descricao = descreverClima(codigos[i]);

    const bloco = document.createElement('div');
    bloco.className = 'dia-previsao';
    bloco.innerHTML = `
        <strong>${diaSemana}</strong><br>
        ${dia} de ${mes}<br>
        ${descricao}<br>
        🔺 ${maximas[i]}°<br>
        🔻 ${minimas[i]}°
    `;
    container.appendChild(bloco);
    }
}
