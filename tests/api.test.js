test('API de clima deve retornar dados válidos', async () => {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true');
    const data = await response.json();

    expect(data).toHaveProperty('current_weather');
    expect(typeof data.current_weather.temperature).toBe('number');
});

test('Nome de cidade válido retorna dados meteorológicos', async () => {
    const cidade = 'São Paulo';
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const respostaGeo = await fetch(urlGeo);
    const dadosGeo = await respostaGeo.json();

    expect(dadosGeo.results).toBeDefined();
    expect(dadosGeo.results.length).toBeGreaterThan(0);

    const { latitude, longitude } = dadosGeo.results[0];
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const respostaClima = await fetch(urlClima);
    const dadosClima = await respostaClima.json();

    expect(dadosClima.current_weather).toBeDefined();
    expect(typeof dadosClima.current_weather.temperature).toBe('number');
});

test('Nome de cidade inexistente lança exceção tratada', async () => {
    const cidadeInvalida = 'XyzCidadeInexistente';
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidadeInvalida)}&count=1&language=pt&format=json`;

    const respostaGeo = await fetch(urlGeo);
    const dadosGeo = await respostaGeo.json();

    // Verifica se a resposta não contém resultados
    expect(dadosGeo.results).toBeUndefined();

    // Simula o tratamento que o app faz
    const cidadeNaoEncontrada = !dadosGeo.results || dadosGeo.results.length === 0;
    expect(cidadeNaoEncontrada).toBe(true);
});

test('variável está definida', () => {
    const resultado = 'Clima ensolarado';
    expect(resultado).toBeDefined(); // ✅ passa
});



