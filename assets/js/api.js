const form = document.getElementById('form-clima');
const resultado = document.getElementById('resultado');



form.addEventListener('submit', async (e) => {
e.preventDefault();

    const cidade = document.getElementById('cidade').value.trim();

    if (!cidade) return alert('Digite o nome de uma cidade.');

    try {
        const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
        const respostaGeo = await fetch(urlGeo);
        const dadosGeo = await respostaGeo.json();
    

    if (!dadosGeo.results || dadosGeo.results.length === 0) {
    alert('Cidade não encontrada!');
    return;
    }



    const cidadeInfo = dadosGeo.results[0];
    const latitude = cidadeInfo.latitude;
    const longitude = cidadeInfo.longitude;
    const nomeFormatado = `${cidadeInfo.name}, ${cidadeInfo.country}`;

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const respostaClima = await fetch(urlClima);
    const dadosClima = await respostaClima.json();
    const clima = dadosClima.current_weather;
    const descricaoClima = descreverClima(clima.weathercode);

    document.getElementById('nomeCidade').textContent = nomeFormatado;
    document.getElementById('temperatura').textContent = `🌡️ Temperatura: ${clima.temperature}°C`;
    document.getElementById('descricao').textContent = `🌥️ Clima: ${descricaoClima}`;


    resultado.style.display = 'block';

    //filtrar apenas por cidades no Brasil
    const cidadeBrasil = dadosGeo.results.find((item)=> item.country_code === "BR");
    if(!cidadeBrasil){
        nomeCidade.textContent="";
        temperatura.textContent="";
        descricao.textContent="";
        document.getElementById('validacao').textContent = `❌ Por Enquanto, o sistema só funciona para cidades do Brasil`;
    }
        // 👉 chama aqui, passando o weathercode certo
    atualizarFundo(clima.weathercode);

        // icones
    const iconeClasse = obterIconeClima(clima.weathercode);
    const iconeElemento = document.getElementById('iconeClima');
    iconeElemento.className = `wi ${iconeClasse}`;



} catch (url) {
    fetchComErro(url);
    console.error('Erro ao consultar API:', url);
    document.alert('Erro ao buscar os dados climáticos.');
}
});

async function fetchComErro(url) {
    try{
        const resposta = await fetch(url);
        if(!resposta.ok){
            throw new Error (`Erro na API (${resposta.status}): $(resposta.statusText)`);
        }
        return resposta;
    }catch (e){
        if (e.name === "TypeError"){
            throw new Error("Erro na rede. Verifique a sua conexão com a internet");
        }
        throw e;
    }
}

function atualizarFundo(weatherCode) {
const body = document.body;

    let background;

    if (weatherCode === 0) {
        background = "linear-gradient(to bottom, #87CEFA, #fefefe)"; // céu limpo
    } else if (weatherCode >= 1 && weatherCode <= 3) {
        background = "linear-gradient(to bottom, #a4b0be, #dfe4ea)"; // nublado
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        background = "linear-gradient(to bottom, #636e72, #b2bec3)"; // neblina
    } else if (weatherCode >= 51 && weatherCode <= 67) {
        background = "linear-gradient(to bottom, #74b9ff, #a29bfe)"; // garoa
    } else if (weatherCode >= 80 && weatherCode <= 82) {
        background = "linear-gradient(to bottom, #2c3e50, #4ca1af)"; // chuva
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        background = "linear-gradient(to bottom, #000000, #434343)"; // tempestade
    } else {
        background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)"; // padrão
    }

    body.style.background = background;
    body.style.transition = "background 1s ease";
}


//Traduz o código do tempo do Open-Meteo para uma descrição em português.

function descreverClima(codigo) {
    const mapa = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com gelo",
    51: "Garoa fraca",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Aguaceiros fracos",
    81: "Aguaceiros moderados",
    82: "Aguaceiros fortes",
    95: "Tempestade",
    96: "Tempestade com granizo leve",
    99: "Tempestade com granizo forte"
    };

    return mapa[codigo] || "Condição desconhecida";
}

//tratamento de erro na rede e HTTP

async function fetchComErro(url) {
    try{
        const resposta = await fetch(url);
        if(!resposta.ok){
            throw new Error (`Erro na API (${resposta.status}): $(resposta.statusText)`);
        }
        return resposta;
    }catch (e){
        if (e.name === "TypeError"){
            throw new Error("Erro na rede. Verifique a sua conexão com a internet");
        }
        throw e;
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
