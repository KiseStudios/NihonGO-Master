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
- `js/home.js`: busca local, integração com histórico, botões de listening e caligrafia, prévia fotográfica dos módulos e classes `ScrollSequenceHero`, `HeroFrameStore`, `HomeScrollEffects` e `TypographicHero`. Os efeitos de scroll das demais seções são separados da interação da seção escura.
- `js/app.js`: evento de troca de tela, foco no título, validação do destino e prevenção da navegação padrão dos links. Removido o evento duplicado que fazia o caderno abrir e fechar no mesmo clique.
- `assets/images/` e `imageSources.md`: WebP locais em duas resoluções por fotografia, com autoria, origem e licença.

A primeira seção usa Canvas 2D e os **240 frames** provenientes de `telainicial/frame_001.png` a `frame_240.png`. Os PNGs originais foram preservados. A página serve cópias WebP em `telainicial/optimized/1280/` e `telainicial/optimized/1920/`: a sequência completa pesa **10,06 MiB** ou **17,34 MiB**, em vez de 425,29 MiB. Cada cópia corresponde a um frame original; não há vídeo. São seis capítulos ligados ao scroll, em 600svh no desktop e 400svh no mobile, com reprodução reversível e transição para os módulos. `HERO_FRAME_COUNT` em `js/home.js` documenta o inventário e deve acompanhar alterações na pasta.

O primeiro WebP é pré-carregado e permanece como poster antes do canvas. Os primeiros 20 frames têm prioridade; os demais são carregados progressivamente quando a rolagem pausa. O frame solicitado e os vizinhos têm prioridade sobre downloads antecipados. Celulares e computadores com até quatro núcleos, até 4 GiB de memória reportada ou economia de dados usam a variante de 1280px; os demais usam 1920px. O limite de pixels do canvas é de 2,1 milhões no perfil leve e 4,2 milhões no perfil maior, com DPR máximo 2 no mobile e 1,5 no desktop.

O cache de arquivos comprimidos fica limitado a 16 MiB no mobile ou 32 MiB no desktop; o cache HTTP mantém as respostas disponíveis entre cargas. Imagens decodificadas têm orçamento de 40 MiB no mobile, 48 MiB no perfil leve e 96 MiB no perfil maior. `createImageBitmap` decodifica as imagens já redimensionadas, sem redimensionamento de alta qualidade durante o scroll; o fallback usa `Image`. Downloads e decodificações são agendados fora do callback de renderização, e o carregador não lê layout depois de alterar estilos. As transições usam opacity e transform, sem filtro de blur contínuo; etapas invisíveis não recebem atualizações repetidas.

Para regenerar as cópias depois de alterar os PNGs, execute dentro desta pasta:

```sh
python3 -m pip install Pillow
python3 tools/optimize-hero-frames.py
```

Pillow é usado somente na preparação dos arquivos; a página não ganha uma dependência de runtime. O gerador verifica o inventário real e escreve `telainicial/optimized/manifest.json`. Os testes conferem os 240 PNGs, as duas cópias de cada frame, dimensões, tamanhos e carregamento inicial sem PNG. Recarregue a página sem cache depois de regenerar os arquivos.

A animação pausa fora da home e com a aba oculta. `prefers-reduced-motion` mostra um frame estático e mantém os CTAs em uma apresentação compacta. Sem JavaScript ou Canvas 2D, o poster e a navegação continuam disponíveis. O botão final entra na seção de módulos; não há login novo.

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
```

Os testes usam contextos novos do navegador, sem acessar os dados pessoais do usuário. Para outro endereço, defina `TEST_BASE_URL`.

`test:hero` verifica 1920×1080, 1440×900, 1366×768, 1024×768 e 390×844: altura, limites dos kanjis, ausência de sobreposição com o título, transição preto/claro, interpolação, estabilidade em repouso, retorno ao centro, intensidade em tablet, independência do scroll, touch e redução de movimento. Salva capturas da seção e da divisão na pasta temporária `nihongo-hero-validation`; defina `HERO_SCREENSHOTS` para outro destino.

`test:sequence` verifica os seis capítulos em ida/volta no desktop e mobile, o inventário de 480 WebPs, orçamento de memória, crop sem distorção, frame final estável, resize de 1366×768 para 1920×1080, mobile 360px com DPR 2, navegação/foco, liberação do sticky, redução de movimento, fallback de Canvas e erros de console/HTTP. As capturas ficam em `nihongo-scroll-hero-validation` na pasta temporária; use `SCROLL_HERO_SCREENSHOTS` para mudar o destino.

Não há scripts de lint, TypeScript ou build: a aplicação é estática. A sintaxe do arquivo alterado pode ser verificada com `node --check 'Site japones estudo/js/home.js'` na raiz, além dos testes de navegador acima.

Cobertura: navegação dos módulos, JLPT por nível, Anime, busca e Escape, histórico e links diretos, criação/persistência de anotações, configurações, tema, materiais de estudo, menu móvel, quiz, desenho e limpeza no canvas, kanji diário e movimento reduzido. Verifica ausência de overflow nas larguras 375, 390, 430, 768, 1024, 1440, 1920 e 2560 px e executa axe na nova home e no cabeçalho, em desktop, mobile e tema escuro.

Verificação visual realizada em Chromium a 1440, 768 e 390 px. Auditoria automática sem violações nas regras WCAG A/AA verificadas para a nova home/cabeçalho; não representa certificação de acessibilidade de todos os exercícios legados. Fontes, fotografias e destinos foram inspecionados no navegador.

Medição de uma carga local sem cache, Chromium a 1440 × 900, em 30/09/2026: LCP ≈ 1,01 s e CLS ≈ 0,004. Na versão anterior, o hero era a única imagem pré-carregada; as imagens abaixo da dobra usam lazy loading e as fontes usam `display=swap`. Estes valores são uma observação do ambiente local, não uma garantia de desempenho em produção. A sequência de frames altera esse perfil de carregamento; validar novamente na hospedagem com rede e dispositivo representativos.

Após a otimização, um teste comparativo em Chromium, viewport 1366×768, cache frio, CPU limitada a 4× e rede de 16 Mbps/40 ms, reduziu a espera pelo frame solicitado de 4,35 s para 0,92 s. A transferência durante o mesmo percurso caiu de 21,95 MB para 3,35 MB, e a decodificação média de 145,5 ms para 44,9 ms. O intervalo RAF p95 caiu de 66,7 ms para 16,8 ms. São medições desse cenário controlado; o teste de navegação, o teste da sequência e as verificações automáticas de acessibilidade também passaram.

O listening usa a síntese de voz do dispositivo. Quando não há uma voz japonesa disponível, a interface informa a limitação e oferece a leitura em romaji.
