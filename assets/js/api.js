const form = document.getElementById('form-clima');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (e) => {
e.preventDefault();

const cidade = document.getElementById('cidade').value.trim();
if (!cidade) return alert('Digite o nome de uma cidade.');

const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
try {
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

    document.getElementById('nomeCidade').textContent = nomeFormatado;
    document.getElementById('temperatura').textContent = `🌡️ Temperatura: ${clima.temperature}°C`;

    resultado.style.display = 'block';

    // 👉 chama aqui, passando o weathercode certo
    atualizarFundo(clima.weathercode);

} catch (erro) {
    console.error('Erro ao consultar API:', erro);
    alert('Erro ao buscar os dados climáticos.');
}
});

function atualizarFundo(weatherCode) {
const body = document.body;

    if (weatherCode === 0) {
        body.style.background = "linear-gradient(to bottom, #87CEFA, #fefefe)"; // céu limpo
    } else if (weatherCode >= 1 && weatherCode <= 3) {
        body.style.background = "linear-gradient(to bottom, #a4b0be, #dfe4ea)"; // nublado
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        body.style.background = "linear-gradient(to bottom, #636e72, #b2bec3)"; // neblina
    } else if (weatherCode >= 51 && weatherCode <= 67) {
        body.style.background = "linear-gradient(to bottom, #74b9ff, #a29bfe)"; // garoa
    } else if (weatherCode >= 80 && weatherCode <= 82) {
        body.style.background = "linear-gradient(to bottom, #2c3e50, #4ca1af)"; // chuva
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        body.style.background = "linear-gradient(to bottom, #000000, #434343)"; // tempestade
    } else {
        body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)"; // padrão
    }

  body.style.transition = "background 1s ease"; // suaviza a transição
}
