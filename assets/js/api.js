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
    if (!cidade){
      alert('Digite uma cidade.');
      return
    } 
    if (/^\d+$/.test(cidade)) {
    alert('⚠️ O nome da cidade não pode conter apenas números.');
    window.location.href = "index.html"
    return;
  }


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

    // /**filtrar apenas por cidades no Brasil
    //  * * @type {Object|null}
    //  * @property {string} country_code Código do país (ex: "BR" para Brasil)
    //  * @property {string} name Nome da cidade
    //  * @property {number} latitude Latitude da cidade
    //  * @property {number} longitude Longitude da cidade
    //  * @property {string} timezone Fuso horário da cidade
    //  * @property {string} admin1 Admin1 (estado/província) da cidade    
    //  * 
    // */

        // Mensagem de validação mais destacada
        const validacao = document.getElementById('validacao');
        const btnVoltar = document.getElementById('btnVoltar');
        validacao.textContent = `❌ Oops! Por enquanto, o sistema só funciona para cidades do Brasil.`;
        validacao.style.position = "absolute";
        validacao.style.top = "50%";
        validacao.style.left = "50%";
        validacao.style.transform = "translate(-50%, -50%)";
        validacao.style.color = "red";
        validacao.style.fontWeight = "bold";
        validacao.style.padding = "20px";
        validacao.style.backgroundColor = "#ffe6e6";
        validacao.style.border = "2px solid #b30000";
        validacao.style.borderRadius = "12px";
        validacao.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        validacao.style.textAlign = "center";
        validacao.style.zIndex = "1000";  

          // Botão de voltar
        btnVoltar.textContent = "Voltar";
        btnVoltar.style.position = "absolute";
        btnVoltar.style.top = "calc(50% + 100px)";
        btnVoltar.style.left = "50%";
        btnVoltar.style.transform = "translateX(-50%)";
        btnVoltar.style.padding = "12px 24px";
        btnVoltar.style.fontSize = "16px";
        btnVoltar.style.fontWeight = "bold";
        btnVoltar.style.borderRadius = "8px";
        btnVoltar.style.border = "none";
        btnVoltar.style.backgroundColor = "#007BFF";
        btnVoltar.style.color = "#fff";
        btnVoltar.style.cursor = "pointer";
        btnVoltar.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        btnVoltar.style.transition = "background 0.3s ease";
        btnVoltar.style.display = "block";

        // Efeito hover
        btnVoltar.onmouseover = () => {
          btnVoltar.style.backgroundColor = "#0056b3";
        };
        btnVoltar.onmouseout = () => {
          btnVoltar.style.backgroundColor = "#007BFF";
        };

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
    const iconeClasse = obterIconeClima(clima.weathercode);
    const iconeElemento = document.getElementById('iconeClima');
    iconeElemento.className = `wi ${iconeClasse}`;


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

        const diasAbreviados = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const diaSemana = diasAbreviados[data.getDay()];

        const dataFormatada = data.toLocaleDateString('pt-BR');
        const descricao = descreverClima(codigos[i]);


        
        const bloco = document.createElement('div');
        bloco.className = 'dia-previsao';
        // Estilo direto via JavaScript
        bloco.style.justifyContent = 'center'
        bloco.style.padding = '20px';
        bloco.style.marginBottom = '10px';
        bloco.style.borderRadius = '12px';
        bloco.style.backgroundColor = '#ffffff';

        bloco.innerHTML = `         
            <strong>${diaSemana}</strong><br>
            ${dataFormatada}<br>
            ${descricao}<br>
            🔺 ${maximas[i]}°<br>
            🔻 ${minimas[i]}°
        `;
        container.appendChild(bloco);
    }
}


function obterIconeClima(codigo) {
  const mapaIcones = {
    0: "wi-day-sunny",
    1: "wi-day-sunny-overcast",
    2: "wi-day-cloudy",
    3: "wi-cloudy",
    45: "wi-fog",
    48: "wi-fog",
    51: "wi-sprinkle",
    53: "wi-showers",
    55: "wi-rain",
    61: "wi-rain",
    63: "wi-rain",
    65: "wi-rain",
    71: "wi-snow",
    73: "wi-snow",
    75: "wi-snow",
    80: "wi-showers",
    81: "wi-showers",
    82: "wi-showers",
    95: "wi-thunderstorm",
    96: "wi-storm-showers",
    99: "wi-storm-showers"
  };
  return mapaIcones[codigo] || "wi-na";
}

// function
function buscarCidade(){
  document.getElementById("tempo").style.display="none";
  document.getElementById("clima").style.display = "block";
}




