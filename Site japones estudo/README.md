# Kise Japan — Plataforma de Estudo de Japonês

Plataforma estática em HTML, CSS e JavaScript, sem build, backend ou autenticação próprios. Exercícios, voz, caligrafia, caderno, configurações e progresso continuam nos controladores existentes e em `localStorage`.

## Executar

Na raiz do repositório:

```sh
python3 'Site japones estudo/tools/serve.py' --bind 0.0.0.0 --port 4173
```

Abra `http://127.0.0.1:4173`. Dentro desta pasta, o comando equivalente é `python3 tools/serve.py --bind 0.0.0.0 --port 4173`. O servidor usa a biblioteca padrão do Python; a aplicação também pode ser hospedada por um servidor estático comum.

## Organização

- `index.html`: palco da abertura com duas imagens, navegação, busca e telas de estudo.
- `css/home.css`: composição editorial, temas, máscara diagonal e enquadramentos responsivos. As telas de exercícios preservam seus estilos.
- `js/scroll-hero.js`: controlador independente da abertura, com timeline GSAP e ScrollTrigger.
- `js/vendor/gsap/`: GSAP e ScrollTrigger 3.15.0 vendorizados; dependências locais da abertura.
- `js/home.js`: menus, histórico, listening, busca e efeitos das demais seções.
- `js/app.js`: navegação, progresso, configurações e integração dos exercícios.
- `telainicial2/`: PNGs originais preservados; `optimized/` contém as versões WebP usadas pela abertura.
- `assets/images/`, `imageSources.md`: fotografias locais, autoria e créditos.

A identidade continua usando `assets/images/logos/Kise_Japan_Rosa_Com_Texto.png` no cabeçalho e `Kise_Japan_Rosa_Simbolo.png` no favicon e no rodapé.

## Abertura com duas imagens e GSAP

A `.hero-experience` usa um único palco fullscreen com duas imagens em camadas:

1. `telainicial2/optimized/kiseinitialjapan.webp`: casa tradicional, sakuras e Monte Fuji ao entardecer.
2. `telainicial2/optimized/kisejapansequence.webp`: mural com círculo vermelho, MADE IN JAPAN e KISE STUDIOS.

As versões WebP derivam dos PNGs de 1672×941, preservados em `telainicial2/`. Não há vídeo, canvas nem sequência de frames na abertura. Os assets antigos de `telainicial/`, as ferramentas de preparação e os testes antigos de frames/vídeo permanecem apenas como histórico, fora da implementação e dos comandos de teste atuais.

GSAP e ScrollTrigger 3.15.0 são carregados de `js/vendor/gsap/gsap.min.js` e `js/vendor/gsap/ScrollTrigger.min.js`, sem CDN em produção nem build npm. Os cabeçalhos originais são preservados; a biblioteca segue a [Standard No Charge GSAP License](https://gsap.com/community/standard-license/). O npm é usado somente para as ferramentas de teste.

A seção ocupa 350svh no desktop e 260svh no mobile. ScrollTrigger prende o palco de 100svh durante os 250/160svh restantes. Uma timeline de 100 unidades dirige imagens, textos e ações; `scrub` usa 0,25 s no desktop e 0,18 s no mobile. A segunda imagem entra por um recorte diagonal que sobe, mantendo a composição fullscreen.

| Timeline | Composição |
| --- | --- |
| 0–15 | Entrada da primeira cena e do texto. |
| 15–30 | Aproximação da imagem e CTA inicial. |
| 30–42 | Saída do texto inicial. |
| 42–52 | Preparação da transição. |
| 52–78 | Recorte diagonal sobe e revela a segunda imagem. |
| 78–90 | Segunda imagem retorna ao enquadramento de origem. |
| 90–100 | Repouso, CTA final e saída do palco em −7svh. |

MADE IN JAPAN e KISE STUDIOS pertencem à fotografia e não são duplicados em HTML. No desktop, a segunda foto ocupa o palco inteiro. Em celulares e tablets na vertical, o palco continua fullscreen, com o mural enquadrado na parte superior e o texto abaixo para preservar as inscrições. A foto sobe junto com a máscara durante a revelação. O CTA final leva aos módulos em `#journey`.

Parallax de ponteiro fica limitado ao desktop com mouse e hover. Seu RAF usa interpolação ajustada pelo tempo entre frames e interrompe o trabalho em repouso, fora da abertura ou em aba oculta. A rolagem reversa reverte a timeline. A inicialização continua independente de `home.js`.

Sem JavaScript, com movimento reduzido, falha das bibliotecas ou falha dos assets, as duas cenas ficam no fluxo normal, com textos e links disponíveis, sem pin nem parallax ou cursor de mouse da experiência.

O controlador expõe `data-engine="gsap-layered-v1"`, `data-state`, `data-phase` e `data-progress` para inspeção. `?heroDebug=1` acrescenta `data-raf-count` para verificar que o RAF próprio para em repouso.

## Verificação

Com o servidor aberto, em outro terminal na raiz do repositório:

```sh
npm ci --prefix tests
cd tests
npx playwright install --with-deps chromium
npm test
npm run test:intro
npm run test:hero
```

Dentro da pasta da aplicação, os testes estão em `../tests`; execute `npm --prefix ../tests run test:intro`.

`test:intro` cobre as duas imagens, recorte intermediário, zoom, reversão, wheel lento e rápido, ponteiro, mobile e alternativas sem movimento, JavaScript ou assets disponíveis. As capturas permitem inspecionar a composição renderizada. O teste também verifica o enquadramento das inscrições do mural, o retorno à home com foco no título e a ausência de pedidos de mídia ou frames de `telainicial/`.

`npm test` cobre navegação, JLPT, anime, busca, histórico, caderno, configurações, temas, menu móvel, quiz, caligrafia e acessibilidade automática da home. `test:hero` preserva a cobertura da seção tipográfica escura, que permanece independente da abertura.

Para outra URL, configure `TEST_BASE_URL=http://127.0.0.1:4174`. Não há build, TypeScript ou lint de produção. Dentro da aplicação, confira sintaxe com `node --check js/scroll-hero.js` e `node --check js/home.js`.

O listening usa a síntese de voz do dispositivo. Quando não há voz japonesa disponível, a interface informa a limitação e oferece a leitura em romaji.
