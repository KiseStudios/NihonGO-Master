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
- `js/home.js`: busca local, integração com histórico, botões de listening e caligrafia, prévia fotográfica dos módulos e classes `HomeScrollEffects` e `TypographicHero`. Os efeitos de scroll das demais seções são separados da interação da seção escura.
- `js/app.js`: evento de troca de tela, foco no título, validação do destino e prevenção da navegação padrão dos links. Removido o evento duplicado que fazia o caderno abrir e fechar no mesmo clique.
- `assets/images/` e `imageSources.md`: WebP locais em duas resoluções por fotografia, com autoria, origem e licença.

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
```

Os testes usam contextos novos do navegador, sem acessar os dados pessoais do usuário. Para outro endereço, defina `TEST_BASE_URL`.

`test:hero` verifica 1920×1080, 1440×900, 1366×768, 1024×768 e 390×844: altura, limites dos kanjis, ausência de sobreposição com o título, transição preto/claro, interpolação, estabilidade em repouso, retorno ao centro, intensidade em tablet, independência do scroll, touch e redução de movimento. Salva capturas da seção e da divisão na pasta temporária `nihongo-hero-validation`; defina `HERO_SCREENSHOTS` para outro destino.

Não há scripts de lint, TypeScript ou build: a aplicação é estática. A sintaxe do arquivo alterado pode ser verificada com `node --check 'Site japones estudo/js/home.js'` na raiz, além dos testes de navegador acima.

Cobertura: navegação dos módulos, JLPT por nível, Anime, busca e Escape, histórico e links diretos, criação/persistência de anotações, configurações, tema, materiais de estudo, menu móvel, quiz, desenho e limpeza no canvas, kanji diário e movimento reduzido. Verifica ausência de overflow nas larguras 375, 390, 430, 768, 1024, 1440, 1920 e 2560 px e executa axe na nova home e no cabeçalho, em desktop, mobile e tema escuro.

Verificação visual realizada em Chromium a 1440, 768 e 390 px. Auditoria automática sem violações nas regras WCAG A/AA verificadas para a nova home/cabeçalho; não representa certificação de acessibilidade de todos os exercícios legados. Fontes, fotografias e destinos foram inspecionados no navegador.

Medição de uma carga local sem cache, Chromium a 1440 × 900, em 30/09/2026: LCP ≈ 1,01 s e CLS ≈ 0,004. O hero é a única imagem pré-carregada; as imagens abaixo da dobra usam lazy loading e as fontes usam `display=swap`. Estes valores são uma observação do ambiente local, não uma garantia de desempenho em produção. Validar novamente na hospedagem com rede e dispositivo representativos.

O listening usa a síntese de voz do dispositivo. Quando não há uma voz japonesa disponível, a interface informa a limitação e oferece a leitura em romaji.
