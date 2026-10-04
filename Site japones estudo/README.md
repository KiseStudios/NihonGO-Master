# NihonGO Master — 日本への旅

Plataforma estática em HTML, CSS e JavaScript, sem etapa de build. Exercícios, voz, caligrafia, caderno, configurações e progresso continuam usando os controladores existentes e `localStorage`. Não há backend nem fluxo de autenticação neste repositório.

## Executar

Na raiz do repositório:

```sh
python3 -m http.server 4173 --directory 'Site japones estudo'
```

Abra `http://localhost:4173`. Também é possível servir a pasta em qualquer hospedagem estática.

## Organização do redesign

- `index.html`: cabeçalho com menus nativos, diálogo de busca e seções semânticas da home. As telas de estudo e os identificadores usados pelos controladores foram preservados. Os materiais antigos da home estão em “Meus guias, vocabulário e frases essenciais”.
- `css/home.css`: composição editorial, tipografia, temas claro/escuro e breakpoints. As regras da home são isoladas dos exercícios; as exceções globais são navegação, redução de movimento e visibilidade dos painéis fechados.
- `js/scroll-hero.js`: inicialização independente da abertura, controle direto dos frames pela posição do scroll e cache limitado de imagens. Erros nos recursos auxiliares da home não impedem a sequência de iniciar.
- `js/home.js`: busca local, integração com histórico, botões de listening e caligrafia, prévia fotográfica dos módulos e classes `HomeScrollEffects` e `TypographicHero`. Os efeitos de scroll das demais seções são separados da interação da seção escura.
- `js/app.js`: evento de troca de tela, foco no título, validação do destino e prevenção da navegação padrão dos links. Removido o evento duplicado que fazia o caderno abrir e fechar no mesmo clique.
- `assets/images/` e `imageSources.md`: WebP locais em duas resoluções por fotografia, com autoria, origem e licença.

A primeira seção usa Canvas 2D e **120 frames selecionados uniformemente dos 240 originais**, preservando a ordem temporal, o primeiro (`frame_001`) e o último (`frame_240`). Os 240 PNGs originais e as 480 cópias WebP existentes em `telainicial/optimized/1280/` e `telainicial/optimized/1920/` foram preservados; o runtime solicita somente a amostra de 120. Essa amostra pesa aproximadamente **5,05 MiB em 1280px** ou **8,72 MiB em 1920px**. Cada cópia corresponde a um frame original; não há vídeo. São seis capítulos ligados ao scroll, em **500svh no desktop e 360svh no mobile**, com reprodução reversível e transição para os módulos. `HERO_SOURCE_COUNT`, `HERO_FRAME_COUNT` e `HERO_SOURCES` em `js/scroll-hero.js` definem o inventário original, a quantidade usada e o mapeamento entre eles.

O primeiro WebP é pré-carregado e permanece como poster antes do canvas. O preload prioriza os **16 frames iniciais**, o frame solicitado e seus vizinhos, e carrega progressivamente **todos os 120 arquivos comprimidos em background**, inclusive durante a rolagem e depois de sair do hero, enquanto a home e a aba permanecem visíveis. Downloads e decodificações usam filas separadas; um download lento não ocupa um slot de decode. Há um slot adicional de rede para o frame exato após um salto ou reversão. Celulares e computadores com até quatro núcleos, até 4 GiB de memória reportada ou economia de dados usam a variante de 1280px; os demais usam 1920px. O limite de pixels do canvas é de 2,1 milhões no perfil leve e 4,2 milhões no perfil maior. **DPR 2 no mobile e 1,5 no desktop são limites máximos**, também sujeitos ao orçamento de pixels e à densidade útil do WebP no enquadramento cover. O backing store não amplia a imagem além dos pixels disponíveis na variante; o compositor ajusta o canvas ao tamanho visual do viewport, enquanto os textos permanecem em HTML. Isso evita rasterizar pixels extras que não acrescentam detalhe à mídia. O backing store só é redimensionado quando suas dimensões mudam, dentro do RAF, junto com o redesenho.

Falhas transitórias de download têm tentativas limitadas: requests urgentes usam até três tentativas, com esperas de **150 ms e 400 ms**; o preload em background usa até duas tentativas. Um frame indisponível mantém a última imagem válida e não desativa os demais frames. O renderer aguarda o frame exato, sem substituir por um vizinho distante ou limpar o canvas. `test:hero-recovery` simula a falha temporária do primeiro frame, e `test:hero-input` também exercita a indisponibilidade e recuperação de um frame intermediário.

O cache de arquivos comprimidos fica limitado a **16 MiB no mobile ou 32 MiB no desktop**, suficiente para a amostra completa; o cache HTTP também permite reutilizar as respostas. Imagens decodificadas têm orçamento de **40 MiB no mobile, 48 MiB no perfil leve e 96 MiB no perfil maior**. Só uma janela próxima fica decodificada, priorizando vizinhos à frente da direção atual e preservando o último frame desenhado. `createImageBitmap` decodifica as variantes WebP já otimizadas, sem resize adicional; o fallback usa `Image` e aguarda `Image.decode()`. Trabalho obsoleto é descartado antes e depois do decode. Downloads e decodificações são agendados fora do callback de renderização, e o carregador não lê layout depois de alterar estilos. As transições usam opacity e transform, sem filtro de blur contínuo; etapas invisíveis não recebem atualizações repetidas.

O evento de scroll apenas registra o estado e agenda uma atualização. O RAF calcula o progresso, seleciona e desenha o frame, e então atualiza textos e indicadores. A suavização atua sobre o progresso com filtro temporal de **18 ms**, independente da taxa de atualização; a cauda após o último alvo fica limitada a **70 ms**. Deltas finos, saltos grandes, extremos e reversões têm resposta direta. Não há interpolação lenta de `currentFrame`, e o loop para quando scroll e ponteiro estabilizam. Mídia e narrativa usam o mesmo progresso; referências DOM e geometria são armazenadas, e os textos só recebem escritas quando seus valores mudam.

Para diagnóstico, abra `http://localhost:4173/?heroDebug=1`. A overlay mostra intervalo RAF, frame desenhado, alvo, quantidade decodificada, arquivos carregados e espera por frames; datasets também expõem contagens e custo máximo do RAF. O debug fica **desligado por padrão**.

Para regenerar as cópias depois de alterar os PNGs, execute dentro desta pasta:

```sh
python3 -m pip install Pillow
python3 tools/optimize-hero-frames.py
```

Pillow é usado somente na preparação dos arquivos; a página não ganha uma dependência de runtime. O gerador verifica o inventário real e escreve `telainicial/optimized/manifest.json`. Os testes conferem os 240 PNGs, as duas cópias de cada frame, dimensões, tamanhos e carregamento inicial sem PNG. Recarregue a página sem cache depois de regenerar os arquivos.

A sequência inicia automaticamente e acompanha diretamente o scroll, sem botão de ativação nem reprodução com atraso depois de parar a rolagem. O listener em captura também observa a rolagem de contêineres ancestrais. A animação pausa fora da home e com a aba oculta. `prefers-reduced-motion` desativa o movimento extra do ponteiro e o parallax dos textos, mantendo a troca de frames comandada pelo usuário. “Pular apresentação” leva diretamente aos módulos. Sem JavaScript ou Canvas 2D, o poster e a navegação continuam disponíveis. O teste `hero-frame-recovery.cjs` verifica scroll real pela roda do mouse, mudança dos pixels, retorno à imagem inicial, recarga e inicialização independente, em desktop/mobile e nas duas preferências de movimento.

A seção escura permanece depois dos módulos e imediatamente antes do JLPT. Usa `min-height: 100svh`, sem `sticky` nem etapas vinculadas ao scroll. Os três kanjis ficam em posições absolutas dentro de uma área reservada, separados do título e da seção seguinte.

A entrada acontece automaticamente em 1,3 s. `pointermove` normaliza as coordenadas locais entre −1 e 1; `requestAnimationFrame` interpola o movimento das cinco camadas, com intensidade 40% menor entre 701 e 1100 px. `pointerleave` retorna suavemente ao centro e o loop para quando estabiliza. As dimensões são armazenadas e invalidadas no scroll/resize, sem medir layout em cada frame. Trocar de tela, ocultar a aba ou ativar redução de movimento cancela o frame pendente e limpa os transforms. Touch, telas de até 700 px e `prefers-reduced-motion` usam composição estática; a última preferência também remove a entrada. Nenhuma dependência de produção foi adicionada.

## Verificação reproduzível

Com o servidor aberto, em outro terminal na raiz:

```sh
npm ci --prefix tests
cd tests
npx playwright install --with-deps chromium
npm test
npm run test:hero
npm run test:sequence
npm run test:hero-input
npm run test:hero-recovery
npm run bench:hero
```

Os testes usam contextos novos do navegador, sem acessar os dados pessoais do usuário. Para outro endereço, defina `TEST_BASE_URL`.

`test:hero` verifica 1920×1080, 1440×900, 1366×768, 1024×768 e 390×844: altura, limites dos kanjis, ausência de sobreposição com o título, transição preto/claro, interpolação, estabilidade em repouso, retorno ao centro, intensidade em tablet, independência do scroll, touch e redução de movimento. Salva capturas da seção e da divisão na pasta temporária `nihongo-hero-validation`; defina `HERO_SCREENSHOTS` para outro destino.

`test:sequence` verifica os seis capítulos em ida/volta no desktop e mobile, o inventário de 480 WebPs, orçamento de memória, crop sem distorção, frame final estável, resize de 1366×768 para 1920×1080, mobile 360px com DPR 2, navegação/foco, liberação do sticky, redução de movimento, fallback de Canvas e erros de console/HTTP. As capturas ficam em `nihongo-scroll-hero-validation` na pasta temporária; use `SCROLL_HERO_SCREENSHOTS` para mudar o destino.

`test:hero-input` verifica 1366×768, 1920×1080 e 390×844 com roda lenta/rápida, pequenos deltas simulando trackpad, PageDown, saltos de posição e reversão rápida. Observa pixels para detectar mudanças de imagem, inversões inesperadas e canvas vazio; também confere preload completo sem percorrer o hero e depois de sair dele, recuperação de frame intermediário, resize, fallback com `Image.decode()`, frame final estável, desenho somente dentro de RAF e parada em repouso. `test:hero-recovery` verifica recuperação inicial, recarga, independência de falhas em `home.js` e scroll em desktop/mobile com ambas as preferências de movimento.

`bench:hero` registra custo do RAF, intervalo p95, distância entre alvo e frame desenhado, imagens mantidas e orçamentos de memória durante um percurso de roda e deltas finos em 1366×768 e 1920×1080. Os resultados e amostras ficam em `/tmp/nihongo-hero-performance/after/`; use `HERO_RUN` para nomear outra execução. São observações do Chromium no ambiente local, sem garantia de FPS em dispositivos reais. Monitor físico de 60/144 Hz, mouse/trackpad físicos e Microsoft Edge não estão disponíveis neste ambiente; pequenos deltas automatizados não substituem teste com trackpad real.

Em 03/10/2026, no Chromium headless da máquina virtual com dois vCPUs, o mesmo percurso de roda/deltas finos apresentou custo JavaScript do callback do hero de **0,3 ms no p95**. Na última execução (`HERO_RUN=final`), o intervalo entre frames do navegador no p95 mudou de **66,7 para 50,1 ms em 1366×768** e de **133,3 para 83,2 ms em 1920×1080**; outra execução do perfil FHD após a refatoração registrou 66,7 ms, evidenciando a variação do ambiente. As execuções usaram a variante leve de 1280px, carregaram todos os 120 arquivos e não observaram regressão de direção; o teste funcional separado também exercita 1920px com perfil de oito núcleos/8 GiB. O callback não mede rasterização/composição assíncrona, e os intervalos totais ainda excedem 16,7 ms neste ambiente: esses resultados demonstram redução de custo, não comprovam 60 FPS. Os efeitos auxiliares da home também armazenam a geometria e só a invalidam em mudanças de layout, fontes, navegação ou viewport, evitando leituras de layout a cada scroll.

Não há scripts de lint, TypeScript ou build: a aplicação é estática. A sintaxe pode ser verificada com `node --check 'Site japones estudo/js/home.js'` e `node --check 'Site japones estudo/js/scroll-hero.js'` na raiz, além dos testes de navegador acima.

Cobertura: navegação dos módulos, JLPT por nível, Anime, busca e Escape, histórico e links diretos, criação/persistência de anotações, configurações, tema, materiais de estudo, menu móvel, quiz, desenho e limpeza no canvas, kanji diário e movimento reduzido. Verifica ausência de overflow nas larguras 375, 390, 430, 768, 1024, 1440, 1920 e 2560 px e executa axe na nova home e no cabeçalho, em desktop, mobile e tema escuro.

Verificação visual realizada em Chromium a 1440, 768 e 390 px. Auditoria automática sem violações nas regras WCAG A/AA verificadas para a nova home/cabeçalho; não representa certificação de acessibilidade de todos os exercícios legados. Fontes, fotografias e destinos foram inspecionados no navegador.

Medição de uma carga local sem cache, Chromium a 1440 × 900, em 30/09/2026: LCP ≈ 1,01 s e CLS ≈ 0,004. Na versão anterior, o hero era a única imagem pré-carregada; as imagens abaixo da dobra usam lazy loading e as fontes usam `display=swap`. Estes valores são uma observação do ambiente local, não uma garantia de desempenho em produção. A sequência de frames altera esse perfil de carregamento; validar novamente na hospedagem com rede e dispositivo representativos.

Em uma otimização anterior, um teste comparativo em Chromium, viewport 1366×768, cache frio, CPU limitada a 4× e rede de 16 Mbps/40 ms, reduziu a espera pelo frame solicitado de 4,35 s para 0,92 s. A transferência durante o mesmo percurso caiu de 21,95 MB para 3,35 MB, e a decodificação média de 145,5 ms para 44,9 ms. O intervalo RAF p95 caiu de 66,7 ms para 16,8 ms. São medições históricas desse cenário controlado, e não resultados da refatoração atual; o teste de navegação, o teste da sequência e as verificações automáticas de acessibilidade também passaram naquela etapa.

O listening usa a síntese de voz do dispositivo. Quando não há uma voz japonesa disponível, a interface informa a limitação e oferece a leitura em romaji.
