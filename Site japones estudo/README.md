# Kise Japan — Plataforma de Estudo de Japonês

Plataforma estática em HTML, CSS e JavaScript, sem etapa de build, backend ou autenticação. Os exercícios, voz, caligrafia, caderno, configurações e progresso usam os controladores existentes e `localStorage`.

## Executar

Na raiz do repositório:

```sh
python3 'Site japones estudo/tools/serve.py'
```

Abra `http://127.0.0.1:4173`. Para outra porta, adicione `--port 4174`. O diretório da aplicação é resolvido pelo próprio script; ele também pode ser executado dentro desta pasta com `python3 tools/serve.py`.

O servidor local usa apenas a biblioteca padrão do Python e suporta HTTP Range. Esse suporte importa para o vídeo: no Chromium testado, `python3 -m http.server` serviu o MP4 sem intervalos de bytes e o navegador reportou `seekable=[0,0]`, mantendo o primeiro quadro durante seeks. Use o servidor acima para conferir a hero. A aplicação continua podendo ser hospedada estaticamente; a hospedagem do MP4 deve responder a Range com `206 Partial Content`, `Content-Range` e `Accept-Ranges: bytes`.

## Organização

- `index.html`: navegação, busca, capítulos da hero e telas de estudo. Identificadores e destinos dos controladores foram preservados.
- `css/home.css`: composição editorial, temas claro/escuro, camada nativa do vídeo, sticky e breakpoints. As telas de exercícios mantêm seus estilos.
- `js/scroll-hero.js`: controlador independente do vídeo e da narrativa, inicializado mesmo que um recurso auxiliar da home falhe.
- `js/home.js`: menus, busca, histórico, listening, caligrafia, prévias e efeitos das demais seções.
- `js/app.js`: navegação, progresso, configurações e integração dos exercícios.
- `assets/images/`, `imageSources.md`: fotografias locais, autoria e créditos.

A identidade usa `assets/images/logos/Kise_Japan_Rosa_Com_Texto.png` no cabeçalho e `Kise_Japan_Rosa_Simbolo.png` no favicon e no rodapé. O CSS enquadra as margens transparentes da logo completa e mantém seu texto legível no tema escuro. As logos originais foram preservadas.

## Hero inicial com vídeo

A camada visual principal usa `<video id="heroScrollVideo">` nativo, pausado, sem autoplay, loop ou chamadas a `play()`. `muted`, `playsinline`, `preload="auto"` e `disablepictureinpicture` mantêm a mídia decorativa adequada ao navegador. O vídeo ocupa toda a área sticky com `object-fit: cover`, sem transform de ponteiro.

A seção ocupa **500svh no desktop e 360svh no mobile**, com uma área sticky de **100svh**. Seu progresso normalizado é limitado a 0–1 pelo percurso útil da seção. O tempo desejado é `min(progress * duration, duration - 0.01)`: zero no início e o último quadro estável no final. A duração só é utilizada depois de carregar metadados válidos, e o seek aguarda mídia disponível.

O listener passivo de scroll atualiza o alvo usando geometria armazenada; as escritas de `currentTime` acontecem dentro de `requestAnimationFrame`. A suavização usa uma constante temporal curta de 12 ms no desktop e 8 ms no mobile, com acomodação limitada a 48 ms. Pequenos deltas, reversões, saltos grandes e extremos são diretos. Diferenças menores que 15 ms não geram novos seeks, exceto nos extremos, que usam precisão de 1 ms. Há **um único seek em andamento**: durante a decodificação, novos movimentos substituem o alvo pendente; `seeked` agenda somente a posição mais recente. Não há fila de posições antigas.

Os seis capítulos, indicador, transição para os módulos, CTAs e parallax leve dos textos continuam ligados ao mesmo progresso normalizado, sem depender do tempo realmente apresentado pelo decodificador. Referências DOM e medidas ficam armazenadas; resize, fontes e mudança de tela invalidam a geometria. A captura de scroll também observa contêineres ancestrais roláveis. O RAF para em repouso, fora da hero, fora da home ou com a aba oculta, retomando ao voltar.

`prefers-reduced-motion: reduce` mantém o poster estático, desativa seeks e movimentos do ponteiro e usa `preload="none"`; os capítulos e a navegação seguem disponíveis. Se o vídeo falhar ou o servidor não fornecer uma timeline navegável, a imagem permanece visível e a narrativa continua funcionando. Sem JavaScript, a abertura tem composição compacta, poster e links operáveis.

O poster `telainicial/video-poster.webp` foi extraído do primeiro quadro real do MP4 (1920×1080, aproximadamente 37 KB). Ele é pré-carregado e permanece atrás do vídeo, evitando tela vazia durante a carga. **A hero não solicita os antigos PNGs/WebPs da sequência e não usa canvas, `HeroFrameStore`, `createImageBitmap`, cache ou decode manual de frames.** A pasta de frames e `tools/optimize-hero-frames.py` foram preservados para uso futuro.

## Arquivo de vídeo e fluidez

O arquivo fornecido é `telainicial/videocapainicial.mp4` (este é o nome existente no projeto). Ele foi preservado integralmente: H.264, 1920×1080, 24 fps, 10 segundos e aproximadamente 6,76 MB. Seus 240 quadros têm **somente um keyframe, em t=0**, e o índice `moov` está no final. Isso força o decodificador a percorrer muitos quadros para alcançar tempos arbitrários.

Depois de implementar e testar a hero com o original, foi preparada a variante **`telainicial/videocapainicial-scrub.mp4`**, usada como padrão. Ela mantém a resolução, duração, ordem e taxa de quadros, tem um keyframe por quadro e `moov` no início (`faststart`), remove o áudio desnecessário e ocupa aproximadamente **13,81 MB**. O arquivo original e todos os frames continuam no projeto. Para comparar diretamente com o original, altere somente o `src` do `<source>` no HTML e recarregue sem cache.

Em ensaio local com Chromium headless e HTTP Range, 17 seeks para frente e para trás produziram:

| Mídia | Seek concluído p50 / p95 | Quadro apresentado p50 / p95 |
| --- | --- | --- |
| Original | 525 / 1747 ms | 501 / 1729 ms |
| Variante para scrub | 43 / 107 ms | 20 / 70 ms |

A apresentação foi observada por `requestVideoFrameCallback` e pixels reais, além de `seeked`. Na hero integrada, o original levou cerca de 677 ms para alcançar 25% e 1461 ms para 75%, sempre pausado. São medições locais sujeitas a CPU, decodificador, cache e rede; não demonstram 60 fps em dispositivos reais. A mídia tem 24 quadros por segundo. Keyframes frequentes corrigem o gargalo do arquivo; mais smoothing em JavaScript apenas esconderia o atraso.

O benchmark da hero completa, com wheel e deltas finos, também comparou os dois arquivos sequencialmente: o p95 dos seeks caiu de **1759 para 100,5 ms em 1366×768** e de **1391 para 86,4 ms em 1920×1080**. Os estados de pixels observados aumentaram de 10 para 49 e de 17 para 44, respectivamente; não houve chamadas a `play()` nem regressão de direção do tempo solicitado. Os relatórios registram separadamente o tempo solicitado, o tempo apresentado e os pixels, sem usar somente o getter `currentTime` como prova de renderização.

Para regenerar a variante, com FFmpeg instalado, execute dentro desta pasta:

```sh
ffmpeg -i telainicial/videocapainicial.mp4 \
  -map 0:v:0 -an -c:v libx264 -preset medium -crf 22 \
  -pix_fmt yuv420p -g 1 -keyint_min 1 -sc_threshold 0 \
  -movflags +faststart telainicial/videocapainicial-scrub.mp4

ffmpeg -i telainicial/videocapainicial.mp4 \
  -frames:v 1 -c:v libwebp -quality 88 telainicial/video-poster.webp
```

Confira tamanho, qualidade, keyframes e seek na hospedagem antes de substituir a mídia. FFmpeg é necessário apenas para preparar os assets, sem dependência de runtime.

## Verificação reproduzível

Com o servidor aberto, em outro terminal na raiz:

```sh
npm ci --prefix tests
cd tests
npx playwright install --with-deps chromium
npm test
npm run test:hero
npm run test:video
npm run bench:hero
```

`test:video` cobre mídia nativa pausada, pixels inicial/intermediários/final, seis capítulos, reversão, resize, desktop/mobile, wheel lento/rápido, pequenos deltas simulando trackpad, teclado, salto/arraste de scrollbar e toque por CDP, ciclos de visibilidade, ausência de trabalho em repouso, metadados atrasados, falha de mídia, movimento reduzido e inicialização independente de `home.js`. Verifica também que a antiga sequência não é solicitada e que os seeks ocorrem em RAF, após metadata, sem sobrepor outro seek. Os aliases `test:sequence`, `test:hero-input` e `test:hero-recovery` executam os respectivos grupos da nova suíte.

As capturas ficam em `/tmp/kise-scroll-video-validation`; use `SCROLL_HERO_SCREENSHOTS` para outro destino. `bench:hero` registra latência de seeks, frames apresentados, atraso, estados de pixels e custo de RAF em `/tmp/kise-video-performance/after`; `HERO_RUN` identifica outra execução. O benchmark é diagnóstico e não transforma a latência medida em garantia de desempenho.

Para comparar com o MP4 original sem editar o HTML, execute `VIDEO_SOURCE_OVERRIDE=telainicial/videocapainicial.mp4 HERO_RUN=original npm run bench:hero`. O harness substitui a fonte apenas na resposta de teste, e o relatório confirma a URL realmente carregada. O modo `node scroll-video.cjs scrollbar` isola o arraste da barra; ele também faz parte de `test:video`.

Para outra URL, use `TEST_BASE_URL=http://127.0.0.1:4174`. A suíte usa Chromium por padrão. Em máquinas com os navegadores instalados, `TEST_BROWSER_CHANNEL=chrome` ou `TEST_BROWSER_CHANNEL=msedge` permite repetir a suíte nos respectivos canais; `TEST_BROWSER_EXECUTABLE_PATH` aceita um executável explícito. Pequenos deltas e toque por CDP são simulações; não substituem trackpad ou celular físicos.

A camada nativa foi verificada nos executáveis oficiais **Chrome 154.0.8037.97 e Edge 154.0.4258.53**, em headless, com desktop, resize para 1920×1080 e mobile 360×800/DPR 2. Os dois passaram os seis capítulos em ida/volta, pixels inicial/final, CTAs e agendamento dos seeks. No Chromium, o teste de arraste usa a barra nativa visível e mouse para mover seu thumb, confirmando mudança real de pixels e retorno ao início. A recuperação também cobre erro de `<source>` anterior à inicialização e servidor sem uma timeline navegável, mantendo poster, capítulos e links.

`npm test` preserva a cobertura de navegação, JLPT, anime, busca e Escape, histórico/links diretos, caderno/persistência, configurações, temas, materiais de estudo, menu móvel, quiz e caligrafia. Também verifica oito larguras e acessibilidade automática da home/cabeçalho nos temas claro/escuro e mobile. `test:hero` cobre a seção tipográfica escura, que permanece separada da mídia inicial.

Não há build, TypeScript ou lint de produção. Verifique sintaxe com `node --check js/home.js` e `node --check js/scroll-hero.js` dentro da pasta da aplicação. Para inspecionar o controlador, abra `?heroDebug=1`: a overlay mostra alvo, duração, número de seeks, latência e custo de RAF. O diagnóstico fica desligado por padrão.

O listening usa a síntese de voz do dispositivo. Quando não há voz japonesa disponível, a interface informa a limitação e oferece a leitura em romaji.
