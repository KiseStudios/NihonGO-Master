/**
 * ==========================================================================
 * MÓDULO AVANÇADO: JLPT N5 AO N1 & ANIME IMMERSION STUDIO (EXPANDIDO)
 * ==========================================================================
 * Conteúdo de alta densidade para estudantes intermediários e avançados:
 * - 40 Gramáticas Oficiais JLPT (8 por nível: N5, N4, N3, N2, N1) com áudios e fórmulas
 * - 40 Kanjis Notáveis estruturados com leituras On'yomi, Kun'yomi e Jukugo
 * - 40 Vocabulários essenciais com áudio instantâneo
 * - Exercícios originais de listening baseados em personagens e temas de anime,
 *   com áudio sintetizado, modo shadowing e explicações de vocabulário
 * - Provérbios de 4 Kanjis (Yojijukugo - 四字熟語) com pronúncia e significado
 * - Guia comparativo de Gírias de Anime vs. Japonês Real
 */

const ADVANCED_DATA = {
  // 1. Conteúdo estruturado por nível JLPT (N5 ao N1)
  jlpt: {
    n5: {
      name: "JLPT N5 (Iniciante Consolidado)",
      badge: "Nível N5",
      color: "#10b981",
      stats: {
        kanjiCount: "aprox. 100",
        vocabCount: "aprox. 800",
        studyHours: "150 - 300 horas",
        summary: "Capacidade de compreender expressões básicas do dia a dia, frases típicas escritas em Hiragana, Katakana e Kanjis simples de convivência e sala de aula."
      },
      grammar: [
        {
          pattern: "〜てから (te kara)",
          meaning: "Depois de fazer [A], faz [B]",
          explanation: "Indica ordem cronológica estrita entre duas ações. O verbo A deve estar na forma -te.",
          exampleJp: "手を洗ってから、ご飯を食べます。",
          exampleRomaji: "Te o aratte kara, gohan o tabemasu.",
          examplePt: "Depois de lavar as mãos, eu como a refeição."
        },
        {
          pattern: "〜てもいいです (te mo ii desu)",
          meaning: "Pode fazer... / Tem permissão para...",
          explanation: "Usado para conceder ou pedir permissão de forma educada e cortês.",
          exampleJp: "ここで写真を撮ってもいいですか。",
          exampleRomaji: "Koko de shashin o totte mo ii desu ka.",
          examplePt: "Posso tirar foto aqui?"
        },
        {
          pattern: "〜てはいけません (te wa ikemasen)",
          meaning: "Não pode fazer... / É proibido...",
          explanation: "Usado para expressar proibições formais, regras públicas e instruções de segurança.",
          exampleJp: "ここでタバコを吸ってはいけません。",
          exampleRomaji: "Koko de tabako o sutte wa ikemasen.",
          examplePt: "Não é permitido fumar aqui."
        },
        {
          pattern: "〜たことがある (ta koto ga aru)",
          meaning: "Já fiz... / Ter a experiência de...",
          explanation: "Verbo no passado informal (forma -ta) + ことがある expressa histórico de vivência pessoal.",
          exampleJp: "富士山に登ったことがあります。",
          exampleRomaji: "Fujisan ni nobotta koto ga arimasu.",
          examplePt: "Eu já subi o Monte Fuji."
        },
        {
          pattern: "〜ほうがいいです (hō ga ii desu)",
          meaning: "É melhor fazer / É melhor não fazer (Conselho)",
          explanation: "Conselho afirmativo usa forma -ta (passado informal); conselho negativo usa forma -nai.",
          exampleJp: "早く寝たほうがいいですよ。",
          exampleRomaji: "Hayaku neta hō ga ii desu yo.",
          examplePt: "É melhor você ir dormir cedo."
        },
        {
          pattern: "〜たいです (tai desu)",
          meaning: "Quero fazer [ação] (Desejo próprio)",
          explanation: "Substitui o 〜ます da raiz do verbo por 〜たい. Usado apenas para desejos em primeira pessoa.",
          exampleJp: "日本へ旅行に行きたいです。",
          exampleRomaji: "Nihon e ryokō ni ikitai desu.",
          examplePt: "Quero viajar para o Japão."
        },
        {
          pattern: "〜まえに (mae ni)",
          meaning: "Antes de fazer [A], faz [B]",
          explanation: "O verbo A fica na forma de dicionário (neutro presente) antes de まえに.",
          exampleJp: "寝る前に、本を読みます。",
          exampleRomaji: "Neru mae ni, hon o yomimasu.",
          examplePt: "Antes de dormir, eu leio um livro."
        },
        {
          pattern: "〜たり〜たりする (tari... tari suru)",
          meaning: "Fazer coisas como A e B (Lista não exaustiva)",
          explanation: "Conecta ações na forma -ta + ri, indicando exemplos de atividades sem ordem fixa.",
          exampleJp: "日曜日は買い物をしたり、映画を見たりします。",
          exampleRomaji: "Nichiyōbi wa kaimono o shitari, eiga o mitari shimasu.",
          examplePt: "Aos domingos eu faço compras, assisto a filmes, entre outras coisas."
        },
        {
          pattern: "〜なければなりません (nakereba narimasen)",
          meaning: "É necessário fazer... / Tenho que...",
          explanation: "Expressa obrigação. Forma negativa informal do verbo + なければなりません.",
          exampleJp: "明日までに宿題を出さなければなりません。",
          exampleRomaji: "Ashita made ni shukudai o dasanakereba narimasen.",
          examplePt: "Preciso entregar a tarefa até amanhã."
        },
        {
          pattern: "〜から〜まで (kara... made)",
          meaning: "De... até...",
          explanation: "Marca os pontos inicial e final de um intervalo de tempo ou espaço.",
          exampleJp: "駅から学校まで歩きます。",
          exampleRomaji: "Eki kara gakkō made arukimasu.",
          examplePt: "Vou a pé da estação até a escola."
        }
      ],
      kanji: [
        { char: "日", onyomi: "NICHI, JITSU", kunyomi: "hi, -ka", meaning: "Dia, Sol", example: "日本 (Nihon - Japão)" },
        { char: "月", onyomi: "GETSU, GATSU", kunyomi: "tsuki", meaning: "Mês, Lua", example: "今月 (kongetsu - este mês)" },
        { char: "火", onyomi: "KA", kunyomi: "hi", meaning: "Fogo", example: "火曜日 (kayōbi - terça-feira)" },
        { char: "水", onyomi: "SUI", kunyomi: "mizu", meaning: "Água", example: "水曜日 (suiyōbi - quarta-feira)" },
        { char: "木", onyomi: "MOKU, BOKU", kunyomi: "ki", meaning: "Árvore, Madeira", example: "木曜日 (mokuyōbi - quinta-feira)" },
        { char: "金", onyomi: "KIN, KON", kunyomi: "kane", meaning: "Ouro, Dinheiro", example: "お金 (okane - dinheiro)" },
        { char: "土", onyomi: "DO, TO", kunyomi: "tsuchi", meaning: "Terra, Solo", example: "土曜日 (doyōbi - sábado)" },
        { char: "人", onyomi: "JIN, NIN", kunyomi: "hito", meaning: "Pessoa", example: "日本人 (nihonjin - japonês)" },
        { char: "年", onyomi: "NEN", kunyomi: "toshi", meaning: "Ano", example: "今年 (kotoshi - este ano)" }
      ],
      vocab: [
        { jp: "毎日", romaji: "mainichi", pt: "todos os dias" },
        { jp: "友達", romaji: "tomodachi", pt: "amigo(a)" },
        { jp: "勉強", romaji: "benkyō", pt: "estudo" },
        { jp: "大丈夫", romaji: "daijōbu", pt: "tudo bem / sem problemas" },
        { jp: "時間", romaji: "jikan", pt: "tempo / hora" },
        { jp: "家族", romaji: "kazoku", pt: "família" },
        { jp: "学校", romaji: "gakkō", pt: "escola" },
        { jp: "天気", romaji: "tenki", pt: "clima / tempo meteorológico" },
        { jp: "電車", romaji: "densha", pt: "trem" },
        { jp: "旅行", romaji: "ryokō", pt: "viagem / viajar" }
      ]
    },

    n4: {
      name: "JLPT N4 (Básico Superior / Conversação Diária)",
      badge: "Nível N4",
      color: "#0284c7",
      stats: {
        kanjiCount: "aprox. 300",
        vocabCount: "aprox. 1.500",
        studyHours: "300 - 600 horas",
        summary: "Capacidade de compreender passagens sobre tópicos cotidianos comuns e conversações faladas em velocidade ligeiramente lenta com orações subordinadas."
      },
      grammar: [
        {
          pattern: "〜ば / 〜たら (Condicionais: Se / Quando)",
          meaning: "Se... / Caso aconteça...",
          explanation: "〜たら é o condicional mais versátil no dia a dia; 〜ば foca na condição necessária para um resultado lógico.",
          exampleJp: "雨が降ったら、家にいます。",
          exampleRomaji: "Ame ga futtara, ie ni imasu.",
          examplePt: "Se chover, ficarei em casa."
        },
        {
          pattern: "〜ために (tame ni)",
          meaning: "A fim de... / Para o propósito de...",
          explanation: "Expressa objetivo consciente com verbo na forma de dicionário.",
          exampleJp: "日本へ留学するために、日本語を勉強しています。",
          exampleRomaji: "Nihon e ryūgaku suru tame ni, nihongo o benkyō shite imasu.",
          examplePt: "Estou estudando japonês para fazer intercâmbio no Japão."
        },
        {
          pattern: "〜すぎる (sugiru)",
          meaning: "Fazer em excesso / Demais",
          explanation: "Liga-se à raiz do verbo ou do adjetivo para expressar que ultrapassou o limite saudável.",
          exampleJp: "昨日ラーメンを食べすぎました。",
          exampleRomaji: "Kinō rāmen o tabesugimashita.",
          examplePt: "Ontem comi lámen em excesso."
        },
        {
          pattern: "Forma Passiva: 〜られる (rareru)",
          meaning: "Ser feito por alguém (Voz Passiva)",
          explanation: "Usada com muita frequência no japonês para indicar que alguém foi afetado por uma ação de outra pessoa.",
          exampleJp: "先生に褒められました。",
          exampleRomaji: "Sensei ni homeraremashita.",
          examplePt: "Fui elogiado pelo professor."
        },
        {
          pattern: "Forma Causativa: 〜させる (saseru)",
          meaning: "Fazer ou deixar alguém realizar uma ação",
          explanation: "Indica autorização ou ordem para que outra pessoa execute a ação.",
          exampleJp: "母は子供に野菜を食べさせました。",
          exampleRomaji: "Haha wa kodomo ni yasai o tabesasemashita.",
          examplePt: "A mãe fez a criança comer vegetais."
        },
        {
          pattern: "〜ようにする (yō ni suru)",
          meaning: "Esforçar-se para... / Fazer o hábito de...",
          explanation: "Indica um esforço contínuo e consciente para desenvolver ou abandonar um hábito.",
          exampleJp: "毎日野菜を食べるようにしています。",
          exampleRomaji: "Mainichi yasai o taberu yō ni shite imasu.",
          examplePt: "Procuro me esforçar para comer vegetais todos os dias."
        },
        {
          pattern: "〜てみる (te miru)",
          meaning: "Experimentar fazer algo para ver como é",
          explanation: "Expressa uma tentativa ou teste prático (verbo na forma -te + miru).",
          exampleJp: "日本の納豆を食べてみたいです。",
          exampleRomaji: "Nihon no nattō o tabete mitai desu.",
          examplePt: "Quero experimentar comer o nattō do Japão."
        },
        {
          pattern: "〜かもしれない (kamoshirenai)",
          meaning: "Talvez... / Pode ser que...",
          explanation: "Expressa possibilidade ou conjectura incerta (cerca de 50% de chance).",
          exampleJp: "明日は雪が降るかもしれません。",
          exampleRomaji: "Ashita wa yuki ga furu kamoshiremasen.",
          examplePt: "Pode ser que neve amanhã."
        },
        {
          pattern: "〜ながら (nagara)",
          meaning: "Enquanto faz...",
          explanation: "Conecta duas ações simultâneas; o verbo principal aparece depois de ながら.",
          exampleJp: "音楽を聞きながら、レポートを書きます。",
          exampleRomaji: "Ongaku o kikinagara, repōto o kakimasu.",
          examplePt: "Escrevo o relatório enquanto escuto música."
        },
        {
          pattern: "〜ておく (te oku)",
          meaning: "Fazer algo com antecedência / deixar preparado",
          explanation: "A forma ておく indica uma ação feita agora para facilitar uma situação futura.",
          exampleJp: "旅行の前に、切符を買っておきます。",
          exampleRomaji: "Ryokō no mae ni, kippu o katte okimasu.",
          examplePt: "Vou comprar a passagem antes da viagem."
        }
      ],
      kanji: [
        { char: "思", onyomi: "SHI", kunyomi: "omo-u", meaning: "Pensar, Achar", example: "思い出 (omoide - lembrança)" },
        { char: "強", onyomi: "KYŌ, GŌ", kunyomi: "tsuyo-i", meaning: "Forte", example: "勉強 (benkyō - estudo)" },
        { char: "道", onyomi: "DŌ, TŌ", kunyomi: "michi", meaning: "Caminho, Via", example: "武道 (budō - artes marciais)" },
        { char: "心", onyomi: "SHIN", kunyomi: "kokoro", meaning: "Coração, Espírito", example: "安心 (anshin - tranquilidade)" },
        { char: "話", onyomi: "WA", kunyomi: "hana-su", meaning: "Falar, Conversa", example: "会話 (kaiwa - conversa)" },
        { char: "買", onyomi: "BAI", kunyomi: "ka-u", meaning: "Comprar", example: "買い物 (kaimono - compras)" },
        { char: "聞", onyomi: "BUN, MON", kunyomi: "ki-ku", meaning: "Ouvir, Perguntar", example: "新聞 (shinbun - jornal)" },
        { char: "言", onyomi: "GEN, GON", kunyomi: "i-u, koto", meaning: "Dizer, Palavra", example: "言葉 (kotoba - palavra/idioma)" },
        { char: "送", onyomi: "SŌ", kunyomi: "oku-ru", meaning: "Enviar, Levar", example: "送る (okuru - enviar)" }
      ],
      vocab: [
        { jp: "約束", romaji: "yakusoku", pt: "promessa / compromisso" },
        { jp: "準備", romaji: "junbi", pt: "preparação" },
        { jp: "経験", romaji: "keiken", pt: "experiência" },
        { jp: "複雑", romaji: "fukuzatsu", pt: "complexo" },
        { jp: "都合", romaji: "tsugō", pt: "conveniência / disponibilidade de horário" },
        { jp: "連絡", romaji: "renraku", pt: "contato / comunicação" },
        { jp: "案内", romaji: "annai", pt: "guia / orientação" },
        { jp: "遠慮", romaji: "enryo", pt: "hesitação / reserva social" },
        { jp: "片付ける", romaji: "katazukeru", pt: "arrumar / organizar" },
        { jp: "乗り換え", romaji: "norikae", pt: "baldeação / troca de linha" }
      ]
    },

    n3: {
      name: "JLPT N3 (Intermediário - A Ponte para a Fluência)",
      badge: "Nível N3",
      color: "#f59e0b",
      stats: {
        kanjiCount: "aprox. 650",
        vocabCount: "aprox. 3.750",
        studyHours: "600 - 900 horas",
        summary: "Capacidade de compreender artigos de jornal simplificados, diálogos em velocidade quase natural e histórias completas de animes sem tradução."
      },
      grammar: [
        {
          pattern: "〜わけがない (wake ga nai)",
          meaning: "É impossível que... / Não há a menor chance de...",
          explanation: "Negação enfática convicta baseada na lógica ou evidências do falante.",
          exampleJp: "彼が嘘をつくわけがありません。",
          exampleRomaji: "Kare ga uso o tsuku wake ga arimasen.",
          examplePt: "É absolutamente impossível que ele esteja mentindo."
        },
        {
          pattern: "〜にしたがって (ni shitagatte)",
          meaning: "À medida que... / Conforme... (mudança gradual)",
          explanation: "Indica que conforme A se desenvolve ou muda, B também se transforma proporcionalmente.",
          exampleJp: "日本語が上達するにしたがって、アニメがもっと楽しくなった。",
          exampleRomaji: "Nihongo ga jōtatsu suru ni shitagatte, anime ga motto tanoshiku natta.",
          examplePt: "À medida que meu japonês melhorou, assistir animes ficou ainda mais divertido."
        },
        {
          pattern: "〜に関して / 〜について (ni kanshite / ni tsuite)",
          meaning: "A respeito de... / Em relação a...",
          explanation: "Introduz o assunto principal em pauta. 〜に関して é mais formal e analítico que 〜について.",
          exampleJp: "この事件に関して、調査が進められている。",
          exampleRomaji: "Kono jiken ni kanshite, chōsa ga susumerarete iru.",
          examplePt: "Em relação a este incidente, uma investigação está sendo conduzida."
        },
        {
          pattern: "〜っぽい (-ppoi)",
          meaning: "Tem cara de... / Parece muito com... / Tendência a...",
          explanation: "Sufixo coloquial muito comum em animes e diálogos cotidianos para expressar uma qualidade proeminente.",
          exampleJp: "子供っぽい行動はやめてください。",
          exampleRomaji: "Kodomoppoi kōdō wa yamete kudasai.",
          examplePt: "Por favor, pare com esse comportamento infantil."
        },
        {
          pattern: "〜おそれがある (osore ga aru)",
          meaning: "Há o perigo/risco de que aconteça (algo indesejado)",
          explanation: "Usado em previsões climáticas, análises estratégicas e alertas de perigo iminente.",
          exampleJp: "台風の影響で、電車が止まるおそれがあります。",
          exampleRomaji: "Taifū no eikyō de, densha ga tomaru osore ga arimasu.",
          examplePt: "Devido ao tufão, há o risco de os trens pararem."
        },
        {
          pattern: "〜たとたん (ta totan ni)",
          meaning: "No exato instante em que... / Logo após...",
          explanation: "Indica que imediatamente após o término do evento A, um evento inesperado B ocorreu.",
          exampleJp: "窓を開けたとたん、冷たい風が入ってきた。",
          exampleRomaji: "Mado o aketa totan, tsumetai kaze ga haitte kita.",
          examplePt: "No exato instante em que abri a janela, um vento gelado entrou."
        },
        {
          pattern: "〜わけにはいかない (wake ni wa ikanai)",
          meaning: "Não posso me dar ao luxo de... / Moralmente incapaz de...",
          explanation: "Expressa que por razões sociais, morais ou de responsabilidade, não se pode realizar tal ato.",
          exampleJp: "大事な試験だから、休むわけにはいかない。",
          exampleRomaji: "Daiji na shiken dakara, yasumu wake ni wa ikanai.",
          examplePt: "É um exame muito importante, então não posso me dar ao luxo de faltar."
        },
        {
          pattern: "〜わりに (wari ni)",
          meaning: "Considerando... / Em comparação com a expectativa...",
          explanation: "Indica que o resultado destoa do que normalmente seria esperado para tal padrão.",
          exampleJp: "この店は値段のわりに、とても美味しい。",
          exampleRomaji: "Kono mise wa nedan no wari ni, totemo oishii.",
          examplePt: "Este restaurante é muito gostoso considerando o preço baixo."
        },
        {
          pattern: "〜ばかり (bakari)",
          meaning: "Acabar de fazer... / Ter acabado de...",
          explanation: "Com verbo na forma た, indica uma ação concluída há pouco tempo.",
          exampleJp: "今、駅に着いたばかりです。",
          exampleRomaji: "Ima, eki ni tsuita bakari desu.",
          examplePt: "Acabei de chegar à estação."
        },
        {
          pattern: "〜ことになっている (koto ni natte iru)",
          meaning: "Estar combinado / Ser a regra que...",
          explanation: "Descreve uma decisão, agenda ou regra estabelecida, não apenas uma intenção pessoal.",
          exampleJp: "会議は九時に始まることになっています。",
          exampleRomaji: "Kaigi wa kuji ni hajimaru koto ni natte imasu.",
          examplePt: "Ficou combinado que a reunião começa às nove."
        }
      ],
      kanji: [
        { char: "勝", onyomi: "SHŌ", kunyomi: "ka-tsu", meaning: "Vencer, Ganhar", example: "勝利 (shōri - vitória)" },
        { char: "界", onyomi: "KAI", kunyomi: "-", meaning: "Mundo, Limite", example: "世界 (sekai - mundo)" },
        { char: "燃", onyomi: "NEN", kunyomi: "mo-eru", meaning: "Queimar, Incendiar", example: "燃料 (nenryō - combustível)" },
        { char: "命", onyomi: "MEI, MYŌ", kunyomi: "inochi", meaning: "Vida, Destino", example: "運命 (unmei - destino)" },
        { char: "覚", onyomi: "KAKU", kunyomi: "obo-eru, sa-meru", meaning: "Memorizar, Despertar", example: "覚悟 (kakugo - determinação)" },
        { char: "限", onyomi: "GEN", kunyomi: "kagi-ru", meaning: "Limite, Restringir", example: "限界 (genkai - limite extremo)" },
        { char: "信", onyomi: "SHIN", kunyomi: "-", meaning: "Acreditar, Confiança", example: "信じる (shinjiru - acreditar)" },
        { char: "感", onyomi: "KAN", kunyomi: "-", meaning: "Sentimento, Sensação", example: "感情 (kanjō - emoção)" },
        { char: "率", onyomi: "RITSU, SOTSU", kunyomi: "hiki-iru", meaning: "Taxa, Proporção; liderar", example: "成功率 (seikōritsu - taxa de sucesso)" }
      ],
      vocab: [
        { jp: "限界", romaji: "genkai", pt: "limite / fronteira" },
        { jp: "覚悟", romaji: "kakugo", pt: "determinação / prontidão psicológica" },
        { jp: "仲間", romaji: "nakama", pt: "companheiro de equipe / aliado" },
        { jp: "真実", romaji: "shinjitsu", pt: "verdade" },
        { jp: "絶望", romaji: "zetsubō", pt: "desespero profundo" },
        { jp: "希望", romaji: "kibō", pt: "esperança" },
        { jp: "挑戦", romaji: "chōsen", pt: "desafio" },
        { jp: "信頼", romaji: "shinrai", pt: "confiança mútua" },
        { jp: "影響", romaji: "eikyō", pt: "influência / impacto" },
        { jp: "改善", romaji: "kaizen", pt: "melhoria / aperfeiçoamento" }
      ]
    },

    n2: {
      name: "JLPT N2 (Pré-Avançado / Negócios & Mídia Japonesa)",
      badge: "Nível N2",
      color: "#8b5cf6",
      stats: {
        kanjiCount: "aprox. 1.000",
        vocabCount: "aprox. 6.000",
        studyHours: "900 - 1.300 horas",
        summary: "Capacidade de ler jornais e artigos com opiniões claras, entender transmissões de TV e acompanhar discussões corporativas e debates em velocidade natural."
      },
      grammar: [
        {
          pattern: "〜に違いない (ni chigainai)",
          meaning: "Com certeza é... / Sem sombra de dúvidas...",
          explanation: "Dedução forte e convicta baseada em evidências incontestáveis.",
          exampleJp: "あんなに努力したのだから、合格するに違いない。",
          exampleRomaji: "Anna ni doryoku shita no dakara, gōkaku suru ni chigainai.",
          examplePt: "Depois de tanto esforço, com certeza ele passará no exame."
        },
        {
          pattern: "〜ざるを得ない (zaru o enai)",
          meaning: "Não ter outra escolha senão fazer...",
          explanation: "Expressa que a situação força o falante a agir de determinada forma contra sua vontade.",
          exampleJp: "証拠が揃っている以上、事実を認めざるを得ない。",
          exampleRomaji: "Shōko ga sorotte iru ijō, jijitsu o mitomezaru o enai.",
          examplePt: "Já que todas as evidências estão reunidas, não tenho outra escolha a não ser admitir os fatos."
        },
        {
          pattern: "〜つつある (tsutsu aru)",
          meaning: "Estar em pleno processo contínuo de transformação",
          explanation: "Indica uma mudança gradual que está ocorrendo no momento presente (estilo jornalístico/reflexivo).",
          exampleJp: "日本の若者の価値観は変化しつつある。",
          exampleRomaji: "Nihon no wakamono no kachikan wa henka shitsutsu aru.",
          examplePt: "Os valores dos jovens japoneses estão em contínua transformação."
        },
        {
          pattern: "〜を契機に / 〜をきっかけに (o keiki ni / o kikkake ni)",
          meaning: "Tendo como gatilho / Ponto de partida crucial...",
          explanation: "Indica um acontecimento decisivo que desencadeou uma nova fase ou grande decisão de vida.",
          exampleJp: "アニメを見たことをきっかけに、日本語の勉強を始めた。",
          exampleRomaji: "Anime o mita koto o kikkake ni, nihongo no benkyō o hajimeta.",
          examplePt: "Tendo como ponto de partida ter assistido animes, comecei a estudar japonês."
        },
        {
          pattern: "〜にほかならない (ni hokanaranai)",
          meaning: "Nada mais é do que... / Não é outra coisa senão...",
          explanation: "Enfatiza de maneira categórica e formal a razão essencial de algo.",
          exampleJp: "今回の成功は、チーム全員の結束力にほかならない。",
          exampleRomaji: "Konkai no seikō wa, chīmu zen'in no kessokuryoku ni hokanaranai.",
          examplePt: "Este sucesso nada mais é do que a união de toda a equipe."
        },
        {
          pattern: "〜のみならず (nomi narazu)",
          meaning: "Não apenas... mas também...",
          explanation: "Equivalente formal de だけでなく, muito utilizado em artigos de jornal e debates.",
          exampleJp: "日本国内のみならず、世界中で愛されている。",
          exampleRomaji: "Nihon kokunai nomi narazu, sekaijū de aisarete iru.",
          examplePt: "É amado não apenas dentro do Japão, mas no mundo inteiro."
        },
        {
          pattern: "〜に際して (ni saishite)",
          meaning: "Por ocasião de... / No momento solene de...",
          explanation: "Indica o início ou preparativo de um grande evento marcante na vida ou carreira.",
          exampleJp: "新事業の開始に際して、ご挨拶申し上げます。",
          exampleRomaji: "Shin jigyō no kaishi ni saishite, go-aisatsu mōshiagemasu.",
          examplePt: "Por ocasião do início do novo empreendimento, presto minhas cordiais saudações."
        },
        {
          pattern: "〜一方だ (ippō da)",
          meaning: "Tende continuamente a... (mudança acelerada)",
          explanation: "Usado com verbos de transformação para expressar que a situação só faz piorar ou crescer sem parar.",
          exampleJp: "物価は上がる一方だ。",
          exampleRomaji: "Bukka wa agaru ippō da.",
          examplePt: "O custo de vida não para de subir."
        },
        {
          pattern: "〜に伴って (ni tomonatte)",
          meaning: "À medida que... / Em consequência de...",
          explanation: "Indica duas mudanças que avançam juntas; aparece com frequência em textos formais.",
          exampleJp: "人口の増加に伴って、交通量も増えている。",
          exampleRomaji: "Jinkō no zōka ni tomonatte, kōtsūryō mo fuete iru.",
          examplePt: "Com o aumento da população, o volume de tráfego também está crescendo."
        },
        {
          pattern: "〜とは限らない (to wa kagiranai)",
          meaning: "Não necessariamente... / Não se pode afirmar que...",
          explanation: "Mostra que uma ideia geralmente aceita não é verdadeira em todos os casos.",
          exampleJp: "高い商品が、必ずしも良いとは限らない。",
          exampleRomaji: "Takai shōhin ga, kanarazushimo yoi to wa kagiranai.",
          examplePt: "Produtos caros não são necessariamente bons."
        }
      ],
      kanji: [
        { char: "域", onyomi: "IKI", kunyomi: "-", meaning: "Região, Território, Domínio", example: "領域 (ryōiki - domínio/área)" },
        { char: "展", onyomi: "TEN", kunyomi: "-", meaning: "Expandir, Desdobrar", example: "展開 (tenkai - expansão)" },
        { char: "捧", onyomi: "HŌ", kunyomi: "sasa-geru", meaning: "Devotar, Oferecer", example: "捧げる (sasageru - dedicar/oferecer)" },
        { char: "闘", onyomi: "TŌ", kunyomi: "tataka-u", meaning: "Lutar, Batalhar", example: "戦闘 (sentō - combate)" },
        { char: "征", onyomi: "SEI", kunyomi: "-", meaning: "Subjugar, Conquistar", example: "征服 (seifuku - conquista)" },
        { char: "創", onyomi: "SŌ", kunyomi: "tsuku-ru", meaning: "Criar, Originar", example: "創造 (sōzō - criação)" },
        { char: "誇", onyomi: "KO", kunyomi: "hoko-ru", meaning: "Orgulho, Vangloriar-se", example: "誇り (hokori - orgulho)" },
        { char: "統", onyomi: "TŌ", kunyomi: "su-beru", meaning: "Unificar, Governar", example: "統一 (tōitsu - unificação)" },
        { char: "概", onyomi: "GAI", kunyomi: "-", meaning: "Resumo, Geral", example: "概念 (gainen - conceito)" }
      ],
      vocab: [
        { jp: "矛盾", romaji: "mujun", pt: "contradição" },
        { jp: "必然", romaji: "hitsuzen", pt: "inevitável / inevitabilidade" },
        { jp: "展開", romaji: "tenkai", pt: "desdobramento / desenvolvimento" },
        { jp: "圧倒的", romaji: "attōteki", pt: "esmagador / avassalador" },
        { jp: "主観的", romaji: "shukanteki", pt: "subjetivo" },
        { jp: "客観的", romaji: "kyakkanteki", pt: "objetivo / imparcial" },
        { jp: "潜在能力", romaji: "senzai nōryoku", pt: "potencial latente" },
        { jp: "葛藤", romaji: "kattō", pt: "conflito interno / dilema" },
        { jp: "妥当", romaji: "datō", pt: "razoável / apropriado" },
        { jp: "促進", romaji: "sokushin", pt: "promoção / aceleração" }
      ]
    },

    n1: {
      name: "JLPT N1 (Avançado / Maestria & Linguagem Literária)",
      badge: "Nível N1",
      color: "#e11d48",
      stats: {
        kanjiCount: "2.136+ (Jōyō Completo)",
        vocabCount: "10.000+ palavras",
        studyHours: "1.500 - 2.500+ horas",
        summary: "Capacidade de compreender ensaios complexos, artigos filosóficos, nuances literárias e discursos de alta eloquência com riqueza idiomática e figuras de linguagem."
      },
      grammar: [
        {
          pattern: "〜極まりない / 〜極まる (kiwamarinai / kiwamaru)",
          meaning: "Extremamente... / O cúmulo de...",
          explanation: "Expressa que uma condição atingiu o limite extremo absoluto (usado em discursos solenes e obras dramáticas).",
          exampleJp: "彼の発言は不快極まりないものであった。",
          exampleRomaji: "Kare no hatsugen wa fukai kiwamarinai mono de atta.",
          examplePt: "A declaração dele foi o cúmulo absoluto do desagradável."
        },
        {
          pattern: "〜ごとき / 〜ごとく (gotoki / gotoku)",
          meaning: "Tal como... / Como se fosse... / Alguém insignificante como...",
          explanation: "Forma literária clássica que expressa comparação poética ou humildade desdenhosa.",
          exampleJp: "私ごとき若輩者に、そのような大役は務まりません。",
          exampleRomaji: "Watashi gotoki jakuhai-sha ni, sono yō na taiyaku wa tsutomari masen.",
          examplePt: "Alguém tão inexperiente quanto eu não seria capaz de assumir um papel de tamanha grandeza."
        },
        {
          pattern: "〜を皮切りに (o kawakiri ni)",
          meaning: "Tendo como pontapé inicial... / A começar por...",
          explanation: "Indica uma primeira ação que desencadeia uma série ininterrupta de eventos similares subsequentes.",
          exampleJp: "東京公演を皮切りに、世界ツアーがスタートする。",
          exampleRomaji: "Tōkyō kōen o kawakiri ni, sekai tsuā ga sutāto suru.",
          examplePt: "A começar pela apresentação em Tóquio, a turnê mundial terá início."
        },
        {
          pattern: "〜まみれ (mamire)",
          meaning: "Completamente coberto / Empastado de (sujeira, poeira, sangue)",
          explanation: "Usado para superfícies inteiramente manchadas ou recobertas por algo físico indesejável.",
          exampleJp: "戦士たちは血まみれになりながらも前進を続けた。",
          exampleRomaji: "Senshi-tachi wa chimamire ni nari nagara mo zenshin o tsuzuketa.",
          examplePt: "Mesmo cobertos de sangue, os guerreiros continuaram avançando."
        },
        {
          pattern: "〜ならでは (naradeha)",
          meaning: "Algo exclusivo e único de... / Só possível por ser...",
          explanation: "Elogio enfático ressaltando a particularidade inigualável de um lugar, pessoa ou tradição.",
          exampleJp: "これは日本ならではの繊細な職人技です。",
          exampleRomaji: "Kore wa Nihon naradeha no sensai na shokunin-waza desu.",
          examplePt: "Esta é uma habilidade artesanal delicada e única, que só existe no Japão."
        },
        {
          pattern: "〜ずくめ (zukume)",
          meaning: "Repleto de apenas... / Cheio somente de...",
          explanation: "Indica que quase a totalidade de uma situação é preenchida por uma única cor, sorte ou infortúnio.",
          exampleJp: "今年は良いことずくめの素晴らしい一年だった。",
          exampleRomaji: "Kotoshi wa ii koto zukume no subarashii ichinen datta.",
          examplePt: "Este ano foi maravilhoso, repleto apenas de coisas boas."
        },
        {
          pattern: "〜と相まって (to aimatte)",
          meaning: "Em combinação harmônica com... / Somado a...",
          explanation: "Indica que dois ou mais fatores positivos ou negativos se uniram para produzir um efeito ainda mais potente.",
          exampleJp: "満開の桜が青空と相まって、息をのむ美しさだ。",
          exampleRomaji: "Mankai no sakura ga aozora to aimatte, iki o nomu utsukushisa da.",
          examplePt: "As cerejeiras em flor, combinadas com o céu azul, têm uma beleza de tirar o fôlego."
        },
        {
          pattern: "〜たるもの (taru mono)",
          meaning: "Alguém digno da posição de... / Uma pessoa no papel de...",
          explanation: "Estabelece o padrão moral, ético ou de honra inegociável exigido para quem ocupa determinado posto.",
          exampleJp: "武士たるもの、命を惜しんではならぬ。",
          exampleRomaji: "Bushi taru mono, inochi o oshinde wa naranu.",
          examplePt: "Aquele que é um verdadeiro samurai não deve poupar a própria vida em nome da honra."
        },
        {
          pattern: "〜べく (beku)",
          meaning: "A fim de... / Com o propósito de...",
          explanation: "Forma escrita e formal de expressar objetivo; em geral, conecta-se à forma de dicionário do verbo.",
          exampleJp: "原因を究明すべく、専門家が現地へ向かった。",
          exampleRomaji: "Gen'in o kyūmei subeku, senmonka ga genchi e mukatta.",
          examplePt: "Especialistas foram ao local a fim de investigar a causa."
        },
        {
          pattern: "〜を余儀なくされる (o yoginaku sareru)",
          meaning: "Ser obrigado a... / Não ter alternativa senão...",
          explanation: "Expressão formal usada quando circunstâncias externas forçam uma decisão ou mudança.",
          exampleJp: "悪天候により、計画の変更を余儀なくされた。",
          exampleRomaji: "Akutenkō ni yori, keikaku no henkō o yoginaku sareta.",
          examplePt: "Por causa do mau tempo, fomos obrigados a mudar o plano."
        }
      ],
      kanji: [
        { char: "虚", onyomi: "KYO, KO", kunyomi: "muna-shii", meaning: "Vazio, Oco, Vão", example: "無量空処 (Muryōkūsho - Vazio Ilimitado)" },
        { char: "魂", onyomi: "KON", kunyomi: "tamashii", meaning: "Alma, Espírito", example: "闘魂 (tōkon - espírito de luta)" },
        { char: "刹", onyomi: "SETSU, SATSU", kunyomi: "-", meaning: "Instante Fugaz, Templo", example: "刹那 (setsuna - momento fugaz)" },
        { char: "宿", onyomi: "SHUKU", kunyomi: "yado-ru", meaning: "Habitar, Hospedar, Destino", example: "宿命 (shukumei - destino inexorável)" },
        { char: "覇", onyomi: "HA", kunyomi: "-", meaning: "Supremacia, Dominação", example: "覇気 (haki - ambição/presença dominadora)" },
        { char: "冥", onyomi: "MEI, MYŌ", kunyomi: "kura-i", meaning: "Escuridão, Submundo", example: "冥土 (meido - submundo espiritual)" },
        { char: "孤", onyomi: "KO", kunyomi: "-", meaning: "Solidão, Órfão", example: "孤独 (kodoku - solidão/isolamento)" },
        { char: "滅", onyomi: "METSU", kunyomi: "horo-biru", meaning: "Destruir, Perecer", example: "鬼滅 (kimetsu - extermínio de demônios)" },
        { char: "懸", onyomi: "KEN", kunyomi: "ka-keru", meaning: "Suspender, Arriscar", example: "懸念 (kenen - preocupação)" }
      ],
      vocab: [
        { jp: "刹那", romaji: "setsuna", pt: "instante efêmero / fração de segundo" },
        { jp: "森羅万象", romaji: "shinrabanshō", pt: "todas as coisas do universo / criação inteira" },
        { jp: "宿命", romaji: "shukumei", pt: "destino imutável" },
        { jp: "虚無", romaji: "kyomu", pt: "o nada absoluto / niilismo" },
        { jp: "泰然自若", romaji: "taizenjijaku", pt: "imperturbável e sereno perante a tempestade" },
        { jp: "深淵", romaji: "shin'en", pt: "abismo profundo" },
        { jp: "一網打尽", romaji: "ichimōdajin", pt: "captura ou aniquilação total de uma só vez" },
        { jp: "百戦錬磨", romaji: "hyaksenrenma", pt: "veterano forjado em incontáveis batalhas" },
        { jp: "懸念", romaji: "kenen", pt: "preocupação / receio" },
        { jp: "脆弱", romaji: "zeijaku", pt: "fragilidade / vulnerabilidade" }
      ]
    }
  },

  // 2. Exercícios de listening com áudio sintetizado e análise
  animeScenes: [
    {
      id: "rezero-subaru-reset",
      anime: "Re:Zero − Starting Life in Another World",
      character: "Subaru Natsuki (ナツキ・スバル)",
      role: "Exercício original: recomeçar depois de um erro",
      animeEmoji: "⏳",
      themeColor: "#b4233a",
      level: "N4",
      badgeText: "N4 / 〜ても: mesmo que",
      originalStudy: true,
      japanese: "何度失敗しても、次の一歩を考えよう。",
      furigana: "なんどしっぱいしても、つぎのいっぽをかんがえよう。",
      romaji: "Nando shippai shite mo, tsugi no ippo o kangaeyō.",
      portuguese: "Mesmo que eu falhe várias vezes, vou pensar no próximo passo.",
      context: "Exemplo didático original associado ao tema de recomeçar da série; não é uma fala oficial do anime.",
      videoPosterBg: "radial-gradient(circle at 78% 18%, #76273d 0%, #321c36 48%, #111827 100%)",
      voicePitch: 1.02,
      voiceRate: 0.84,
      words: [
        { jp: "何度", romaji: "nando", pt: "quantas vezes / várias vezes" },
        { jp: "失敗しても", romaji: "shippai shite mo", pt: "mesmo que falhe (〜ても)" },
        { jp: "次の一歩", romaji: "tsugi no ippo", pt: "o próximo passo" },
        { jp: "考えよう", romaji: "kangaeyō", pt: "vamos pensar / vou pensar" }
      ],
      grammarNotes: [
        "Verbo na forma て + も apresenta uma condição concessiva: 失敗しても, mesmo que eu falhe.",
        "〜よう é a forma volitiva informal de 考える: expressa intenção ou convite.",
        "Frase criada para estudo e shadowing; não corresponde a uma citação do roteiro."
      ]
    },

    {
      id: "pain-shinra",
      anime: "Naruto Shippuden",
      character: "Pain / Tendō (ペイン / 天道)",
      role: "Líder da Akatsuki",
      animeEmoji: "🌀",
      themeColor: "#b91c1c",
      level: "N2",
      badgeText: "N2 / Discurso Filosófico",
      japanese: "ここより、世界に痛みを。神羅天征！",
      furigana: "ここより、せかいにいたみを。しんらてんせい！",
      romaji: "Koko yori, sekai ni itami o. Shinra Tensei!",
      portuguese: "A partir deste ponto, que o mundo conheça a verdadeira dor. Punição Celestial!",
      context: "Pain levita sobre a Vila da Folha e libera todo o poder do Rinnegan para obliterar Konoha.",
      youtubeEmbedId: "2h0N5z60p0g",
      videoPosterBg: "radial-gradient(circle at center, #7f1d1d 0%, #020617 100%)",
      voicePitch: 0.82,
      voiceRate: 0.8,
      words: [
        { jp: "ここより", romaji: "koko yori", pt: "a partir deste ponto (N2 〜より)" },
        { jp: "世界に痛みを", romaji: "sekai ni itami o", pt: "dor ao mundo (objeto da ação)" },
        { jp: "神羅天征", romaji: "Shinra Tensei", pt: "Conquista Celestial Divina (N1)" }
      ],
      grammarNotes: [
        "ここより (koko yori): Uso formal e poético da partícula より com valor de 'a partir de' (equivalente arcaico a ここから).",
        "痛みを与える (itami o ataeru): A frase elide o verbo final 'dar/infligir', deixando a partícula を em suspensão dramática.",
        "神羅天征: 森羅万象 (todas as coisas do universo) + 天征 (conquista celestial)."
      ]
    },

    {
      id: "erwin-charge",
      anime: "Shingeki no Kyojin (Attack on Titan)",
      character: "Erwin Smith (エルヴィン・スミス)",
      role: "Comandante da Tropa de Exploração",
      animeEmoji: "⚔️",
      themeColor: "#0284c7",
      level: "N3",
      badgeText: "N3 / Discurso Militar",
      japanese: "心臓を捧げよ！進めぇぇ！",
      furigana: "しんぞうをささげよ！すすめぇぇ！",
      romaji: "Shinzō o sasageyo! Susumeee!",
      portuguese: "Entreguem seus corações! Avancem!",
      context: "O grito de guerra épico na investida final da cavalaria contra o Titã Bestial.",
      youtubeEmbedId: "sjh3gKkCj_s",
      videoPosterBg: "radial-gradient(circle at center, #1e3a8a 0%, #020617 100%)",
      voicePitch: 0.85,
      voiceRate: 0.9,
      words: [
        { jp: "心臓", romaji: "Shinzō", pt: "Coração físico / Órgão vital (N3)" },
        { jp: "捧げよ", romaji: "sasageyo", pt: "Dediquem / Ofereçam (Imperativo formal N3)" },
        { jp: "進め", romaji: "susume", pt: "Avancem (Imperativo direto N3)" }
      ],
      grammarNotes: [
        "心臓 (Shinzō): Substantivo formal para coração físico, diferente de 心 (kokoro).",
        "捧げよ (sasageyo): Forma imperativa solene do verbo 捧げる (sasageru). A terminação 〜よ é típica de decretos e discursos históricos.",
        "進め (susume): Imperativo de 進む (susumu - avançar)."
      ]
    },

    {
      id: "rengoku-heart",
      anime: "Kimetsu no Yaiba (Demon Slayer)",
      character: "Kyojuro Rengoku (煉獄 杏寿郎)",
      role: "Hashira das Chamas",
      animeEmoji: "🔥",
      themeColor: "#ea580c",
      level: "N3",
      badgeText: "N3 / Forma Imperativa",
      japanese: "心を燃やせ！歯を食いしばって前を向け！",
      furigana: "こころをもやせ！はをくいしばってまえをむけ！",
      romaji: "Kokoro o moyase! Ha o kuishibatte mae o muke!",
      portuguese: "Incendeie o seu coração! Cerre os dentes e olhe para frente!",
      context: "As comoventes palavras finais de Rengoku no Trem Infinito inspirando os jovens espadachins.",
      youtubeEmbedId: "ATJy8xU4Xy8",
      videoPosterBg: "radial-gradient(circle at center, #7c2d12 0%, #1c1917 100%)",
      voicePitch: 1.0,
      voiceRate: 0.88,
      words: [
        { jp: "心", romaji: "Kokoro", pt: "Coração / Espírito" },
        { jp: "燃やせ", romaji: "moyase", pt: "Incendeie! (Imperativo de 燃やす)" },
        { jp: "歯を食いしばって", romaji: "ha o kuishibatte", pt: "Cerrando os dentes (Expressão idiomática)" },
        { jp: "前を向け", romaji: "mae o muke", pt: "Olhe para frente! (Imperativo de 向く)" }
      ],
      grammarNotes: [
        "燃やせ (moyase): Conjugação imperativa do verbo transitivo 燃やす (moyasu).",
        "歯を食いしばる (ha o kuishibaru): Expressão de suportar dor e adversidade sem vacilar.",
        "前を向け (mae o muke): Imperativo de 前を向く (encarar o futuro de cabeça erguida)."
      ]
    },

    {
      id: "zoro-shame",
      anime: "One Piece",
      character: "Roronoa Zoro (ロロノア・ゾロ)",
      role: "O Maior Espadachim",
      animeEmoji: "🗡️",
      themeColor: "#15803d",
      level: "N4",
      badgeText: "N4 / Código de Honra",
      japanese: "背中の傷は、剣士の恥だ。",
      furigana: "せなかのきずは、けんしのはじだ。",
      romaji: "Senaka no kizu wa, kenshi no haji da.",
      portuguese: "Uma cicatriz nas costas é a maior vergonha para um espadachim.",
      context: "Zoro abre os braços para receber o golpe final de Mihawk sem virar as costas para fugir.",
      youtubeEmbedId: "L8q9oB7QzO4",
      videoPosterBg: "radial-gradient(circle at center, #14532d 0%, #022c22 100%)",
      voicePitch: 0.88,
      voiceRate: 0.82,
      words: [
        { jp: "背中の傷", romaji: "senaka no kizu", pt: "ferida/cicatriz nas costas" },
        { jp: "剣士", romaji: "kenshi", pt: "espadachim" },
        { jp: "恥だ", romaji: "haji da", pt: "é vergonha/desonra" }
      ],
      grammarNotes: [
        "背中 (senaka - costas) + の + 傷 (kizu - cicatriz): Modificação de substantivo.",
        "は (wa): Partícula de contraste categórico.",
        "恥 (haji): Conceito cultural japonês de desonra inaceitável para a classe guerreira."
      ]
    },

    {
      id: "luffy-king",
      anime: "One Piece",
      character: "Monkey D. Luffy (モンキー・D・ルフィ)",
      role: "Capitão dos Chapéus de Palha",
      animeEmoji: "👒",
      themeColor: "#e11d48",
      level: "N4",
      badgeText: "N4 / Inversão & Partícula に",
      japanese: "海賊王に、おれはなる！",
      furigana: "かいぞくおうに、おれはなる！",
      romaji: "Kaizoku-ō ni, ore wa naru!",
      portuguese: "Eu serei o Rei dos Piratas!",
      context: "A clássica promessa proferida por Luffy ao partir para a Grand Line.",
      youtubeEmbedId: "gq28n3hNf0s",
      videoPosterBg: "radial-gradient(circle at center, #831843 0%, #0f172a 100%)",
      voicePitch: 1.1,
      voiceRate: 0.85,
      words: [
        { jp: "海賊王", romaji: "Kaizoku-ō", pt: "Rei dos Piratas" },
        { jp: "に", romaji: "ni", pt: "partícula de transformação de estado" },
        { jp: "おれ", romaji: "ore", pt: "eu (pronome masculino informal)" },
        { jp: "なる", romaji: "naru", pt: "tornar-se / virar" }
      ],
      grammarNotes: [
        "Inversão Poética: A ordem direta seria 'おれは海賊王になる'. A inversão prioriza o sonho.",
        "Substantivo + になる (ni naru): Regra básica do N5/N4 para transformação de estado.",
        "おれ (ore): Pronome pessoal masculino informal de determinação."
      ]
    },

    {
      id: "light-god",
      anime: "Death Note",
      character: "Light Yagami (夜神 月)",
      role: "Kira / O Julgador do Caderno",
      animeEmoji: "📓",
      themeColor: "#9333ea",
      level: "N3",
      badgeText: "N3 / Forma Neutra (to naru)",
      japanese: "僕は新世界の神となる！",
      furigana: "ぼくはしんせかいのかみとなる！",
      romaji: "Boku wa shinsekai no kami to naru!",
      portuguese: "Eu me tornarei o deus do novo mundo!",
      context: "Light declara para Ryuk sua ambição distorcida de criar um mundo expurgado de criminosos.",
      youtubeEmbedId: "t1pqi8vjTLY",
      videoPosterBg: "radial-gradient(circle at center, #581c87 0%, #09090b 100%)",
      voicePitch: 1.0,
      voiceRate: 0.85,
      words: [
        { jp: "僕", romaji: "boku", pt: "eu (casual/formal brando)" },
        { jp: "新世界", romaji: "shinsekai", pt: "novo mundo (N3)" },
        { jp: "神となる", romaji: "kami to naru", pt: "tornar-se deus (formalidade de 〜となる)" }
      ],
      grammarNotes: [
        "〜となる (to naru): Variante formal e enfática de 〜になる (ni naru), muito comum em discursos solenes e proclamações épicas.",
        "新世界 (shinsekai): 新 (novo) + 世界 (mundo).",
        "僕 (boku): Contraste sutil entre o pronome polido que Light finge usar e sua arrogância insana."
      ]
    },

    {
      id: "naruto-nindo",
      anime: "Naruto Shippuden",
      character: "Naruto Uzumaki (うずまきナルト)",
      role: "O Sétimo Hokage",
      animeEmoji: "🍥",
      themeColor: "#ea580c",
      level: "N3",
      badgeText: "N3 / Gíria Coloquial (-nee)",
      japanese: "まっすぐ自分の言葉は曲げねぇ、それがオレの忍道だ！",
      furigana: "まっすぐじぶんのことばはまげねぇ、それがオレのにんどうだ！",
      romaji: "Massugu jibun no kotoba wa magenee, sore ga ore no nindō da!",
      portuguese: "Eu nunca volto atrás na minha palavra, esse é o meu jeito ninja!",
      context: "O nindō inabalável que guiou Naruto da solidão até o reconhecimento de toda a vila.",
      youtubeEmbedId: "aU88vMhZ_78",
      videoPosterBg: "radial-gradient(circle at center, #7c2d12 0%, #18181b 100%)",
      voicePitch: 1.05,
      voiceRate: 0.85,
      words: [
        { jp: "まっすぐ", romaji: "massugu", pt: "reto / diretamente" },
        { jp: "曲げねぇ", romaji: "magenee", pt: "não dobro/não volto atrás (曲げない ➔ 曲げねぇ)" },
        { jp: "忍道", romaji: "nindō", pt: "o caminho do ninja" }
      ],
      grammarNotes: [
        "曲げねぇ (magenee): Contração coloquial de 曲げない (magenai). A terminação /ai/ vira /ee/ na fala masculina informal de animes.",
        "言葉を曲げる (kotoba o mageru): Quebrar promessas ou tergiversar.",
        "まっすぐ (massugu): Advérbio que expressa determinação moral reta."
      ]
    },

    {
      id: "frieren-time",
      anime: "Sousou no Frieren",
      character: "Frieren (フリーレン)",
      role: "A Maga Elfa Milenar",
      animeEmoji: "🪄",
      themeColor: "#059669",
      level: "N3",
      badgeText: "N3 / Partícula de Frustração (noni)",
      japanese: "人間の寿命は短いって、わかってたのに…",
      furigana: "にんげんのじゅみょうはみじかいて、わかってたのに…",
      romaji: "Ningen no jumyō wa mijikai tte, wakatteta noni...",
      portuguese: "Embora eu soubesse que a vida dos humanos era curta...",
      context: "A dor e o arrependimento de Frieren no funeral de Himmel ao perceber o valor do tempo compartilhado.",
      youtubeEmbedId: "3m9lE5hG24s",
      videoPosterBg: "radial-gradient(circle at center, #064e3b 0%, #022c22 100%)",
      voicePitch: 1.05,
      voiceRate: 0.78,
      words: [
        { jp: "人間の寿命", romaji: "ningen no jumyō", pt: "vida/tempo humano" },
        { jp: "短いって", romaji: "mijikai tte", pt: "que é curta (citação って)" },
        { jp: "わかってたのに", romaji: "wakatteta noni", pt: "mesmo sabendo... (N3 〜のに)" }
      ],
      grammarNotes: [
        "〜って (tte): Versão coloquial da partícula de citação と.",
        "わかってた (wakatteta): Contração de わかっていた (o som /i/ é elidido).",
        "〜のに (noni): Gramática do N3 que expressa contradição com tom de lamento."
      ]
    },

    {
      id: "rezero-emilia",
      anime: "Re:Zero − Starting Life in Another World",
      character: "Subaru Natsuki (ナツキ・スバル)",
      role: "O rapaz que recomeça do zero",
      animeEmoji: "⏳",
      themeColor: "#b4233a",
      level: "N4",
      badgeText: "N4 / Desejos com 〜たい",
      originalStudy: true,
      japanese: "困っている人を一人にしたくない。",
      furigana: "こまっているひとをひとりにしたくない。",
      romaji: "Komatte iru hito o hitori ni shitakunai.",
      portuguese: "Não quero deixar sozinha uma pessoa que está passando por dificuldades.",
      context: "Exemplo didático original sobre empatia, associado ao espírito da série; não é uma fala oficial do anime.",
      videoPosterBg: "radial-gradient(circle at 78% 18%, #76273d 0%, #321c36 48%, #111827 100%)",
      voicePitch: 1.02,
      voiceRate: 0.84,
      words: [
        { jp: "困っている", romaji: "komatte iru", pt: "estar em dificuldade" },
        { jp: "一人にする", romaji: "hitori ni suru", pt: "deixar alguém sozinho" },
        { jp: "〜たくない", romaji: "takunai", pt: "não querer fazer algo" }
      ],
      grammarNotes: [
        "〜たくない expressa vontade negativa: したい (querer fazer) passa a したくない (não querer fazer).",
        "困っている人 é uma oração descritiva antes do substantivo: 'a pessoa que está em dificuldade'.",
        "O sujeito é omitido, algo comum em japonês quando pode ser recuperado pelo contexto.",
        "Frase criada para estudo e shadowing; não corresponde a uma citação do roteiro."
      ]
    },

    {
      id: "rezero-emilia-request",
      anime: "Re:Zero − Starting Life in Another World",
      character: "Emilia (エミリア)",
      role: "Exercício original: pedir ajuda com gentileza",
      animeEmoji: "❄️",
      themeColor: "#587db8",
      level: "N4",
      badgeText: "N4 / 〜てくれる: fazer por mim",
      originalStudy: true,
      japanese: "この町を案内してくれる？",
      furigana: "このまちをあんないしてくれる？",
      romaji: "Kono machi o annai shite kureru?",
      portuguese: "Você pode me mostrar esta cidade?",
      context: "Pedido casual e amigável criado para praticar 〜てくれる; material de estudo original, não uma fala oficial.",
      videoPosterBg: "radial-gradient(circle at 78% 18%, #617fa8 0%, #343654 48%, #111827 100%)",
      voicePitch: 1.08,
      voiceRate: 0.82,
      words: [
        { jp: "この町", romaji: "kono machi", pt: "esta cidade" },
        { jp: "案内する", romaji: "annai suru", pt: "guiar / mostrar o lugar" },
        { jp: "〜てくれる", romaji: "te kureru", pt: "fazer algo para mim" }
      ],
      grammarNotes: [
        "Verbo na forma て + くれる expressa uma ação que outra pessoa faz como favor ao falante.",
        "A entonação ascendente transforma a frase em pergunta casual; entre desconhecidos, prefira 〜てくれますか.",
        "Frase criada para estudo e shadowing; não corresponde a uma citação do roteiro."
      ]
    },

    {
      id: "rezero-plan",
      anime: "Re:Zero − Starting Life in Another World",
      character: "Subaru Natsuki (ナツキ・スバル)",
      role: "Exercício original: avaliar uma situação",
      animeEmoji: "🕰️",
      themeColor: "#74528f",
      level: "N2",
      badgeText: "N2 / 〜までは: até que",
      originalStudy: true,
      japanese: "状況を確かめるまでは、結論を急ぐべきじゃない。",
      furigana: "じょうきょうをたしかめるまでは、けつろんをいそぐべきじゃない。",
      romaji: "Jōkyō o tashikameru made wa, ketsuron o isogu beki ja nai.",
      portuguese: "Até confirmar a situação, não devemos nos apressar em tirar conclusões.",
      context: "Frase original para treinar linguagem de planejamento e cautela; inspirada no tema de reavaliar decisões, não é uma fala oficial.",
      videoPosterBg: "radial-gradient(circle at 78% 18%, #61466f 0%, #332b4a 48%, #111827 100%)",
      voicePitch: 0.96,
      voiceRate: 0.82,
      words: [
        { jp: "状況", romaji: "jōkyō", pt: "situação / circunstâncias" },
        { jp: "確かめる", romaji: "tashikameru", pt: "confirmar / verificar" },
        { jp: "結論", romaji: "ketsuron", pt: "conclusão" },
        { jp: "〜べきではない", romaji: "beki dewa nai", pt: "não se deve..." }
      ],
      grammarNotes: [
        "〜までは marca o limite temporal: até que a situação seja confirmada.",
        "〜べきではない expressa que não é recomendável ou correto fazer algo.",
        "じゃない é a contração casual de ではない; a forma mais formal é 急ぐべきではありません.",
        "Frase criada para estudo e shadowing; não corresponde a uma citação do roteiro."
      ]
    },

    {
      id: "meruem-born",
      anime: "Hunter x Hunter",
      character: "Meruem (メルエム)",
      role: "O Rei das Formigas Quimera",
      animeEmoji: "👑",
      themeColor: "#047857",
      level: "N1",
      badgeText: "N1 / Pronome Imperial Arcaico",
      japanese: "余はこの者のために生まれてきたのだ。",
      furigana: "よはこのもののためにうまれてきたのだ。",
      romaji: "Yo wa kono mono no tame ni umarete kita no da.",
      portuguese: "Eu nasci exatamente com o propósito de estar com esta pessoa.",
      context: "Os momentos finais tocantes entre Meruem e Komugi jogando Gungi na escuridão.",
      youtubeEmbedId: "d6kYeR7K5rM",
      videoPosterBg: "radial-gradient(circle at center, #065f46 0%, #022c22 100%)",
      voicePitch: 0.88,
      voiceRate: 0.8,
      words: [
        { jp: "余", romaji: "Yo", pt: "Eu (pronome imperial arcaico de monarcas)" },
        { jp: "この者", romaji: "kono mono", pt: "esta pessoa (humilde/distante)" },
        { jp: "生まれてきた", romaji: "umarete kita", pt: "veio a nascer (〜てくる indicando trajetória)" }
      ],
      grammarNotes: [
        "余 (Yo): Pronome imperial arcaico (nível N1 literário) que apenas imperadores e reis usavam.",
        "〜てくる (te kuru): Expressa um processo que começou no passado e culminou no presente momento.",
        "のだ (no da): Partícula explicativa que confere peso emocional de certeza absoluta ao destino."
      ]
    },

    {
      id: "vegeta-pride",
      anime: "Dragon Ball Z",
      character: "Vegeta (ベジータ)",
      role: "O Príncipe dos Saiyajins",
      animeEmoji: "⚡",
      themeColor: "#1d4ed8",
      level: "N3",
      badgeText: "N3 / Honorífico Arrogante (-sama)",
      japanese: "俺は誇り高きサイヤ人の王子、ベジータ様だ！",
      furigana: "おれはほこりたかきサイヤじんのおうじ、ベジータさまだ！",
      romaji: "Ore wa hokori takaki saiyajin no ōji, Bejīta-sama da!",
      portuguese: "Eu sou o orgulhoso príncipe dos Saiyajins, o grande lorde Vegeta!",
      context: "Vegeta recusa o controle mental de Babidi provando que seu orgulho é inquebrantável.",
      youtubeEmbedId: "Wn6rF4VqE5g",
      videoPosterBg: "radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)",
      voicePitch: 0.9,
      voiceRate: 0.88,
      words: [
        { jp: "誇り高き", romaji: "hokori takaki", pt: "nobremente orgulhoso (forma clássica)" },
        { jp: "王子", romaji: "ōji", pt: "príncipe" },
        { jp: "ベジータ様", romaji: "Bejīta-sama", pt: "lorde Vegeta (auto-honorífico)" }
      ],
      grammarNotes: [
        "誇り高き (hokori takaki): Forma adjetival clássica arcaica (〜き) no lugar de 誇り高い (hokori takai).",
        "〜様 (sama) em primeira pessoa: Usar o sufixo reverencial em si mesmo é o ápice da altivez de guerreiros em animes.",
        "だ (da): Cópula assertiva firme."
      ]
    },

    {
      id: "thors-enemies",
      anime: "Vinland Saga",
      character: "Thors Snorresson (トールズ)",
      role: "O Troll de Jom",
      animeEmoji: "🛡️",
      themeColor: "#475569",
      level: "N3",
      badgeText: "N3 / Partícula 〜など",
      japanese: "お前に敵などいない。誰にも傷つけていい者などいないんだ。",
      furigana: "おまえにてきなどいない。だれにもきずつけていいものなどいないんだ。",
      romaji: "Omae ni teki nado inai. Dare ni mo kizutsukete ii mono nado inai n da.",
      portuguese: "Você não tem nenhum inimigo. Não há ninguém no mundo que você tenha o direito de ferir.",
      context: "A maior lição pacifista transmitida por Thors para seu filho Thorfinn antes de tombar com honra.",
      youtubeEmbedId: "k5i_0uL6M-8",
      videoPosterBg: "radial-gradient(circle at center, #334155 0%, #0f172a 100%)",
      voicePitch: 0.86,
      voiceRate: 0.8,
      words: [
        { jp: "敵などいない", romaji: "teki nado inai", pt: "não existem coisas como inimigos (N3 〜など)" },
        { jp: "傷つけていい", romaji: "kizutsukete ii", pt: "ter permissão de ferir (forma 〜てもいい)" },
        { jp: "者などいないんだ", romaji: "mono nado inai n da", pt: "não há pessoas que se possa..." }
      ],
      grammarNotes: [
        "〜など (nado): Partícula do N3 que desqualifica ou relativiza o substantivo ('tal coisa como inimigos').",
        "〜ていい (te ii): Versão informal de 〜てもいいです (permissão).",
        "者 (mono): Palavra formal para 'indivíduo / ser humano', mais nobre que 人 (hito)."
      ]
    },

    {
      id: "shinji-run",
      anime: "Neon Genesis Evangelion",
      character: "Shinji Ikari (碇 シンジ)",
      role: "Piloto do EVA-01",
      animeEmoji: "🤖",
      themeColor: "#7c3aed",
      level: "N4",
      badgeText: "N4 / Contração 〜ちゃダメ",
      japanese: "逃げちゃダメだ、逃げちゃダメだ、逃げちゃダメだ！",
      furigana: "にげちゃダメだ、にげちゃダメだ、にげちゃダメだ！",
      romaji: "Nigecha dame da, nigecha dame da, nigecha dame da!",
      portuguese: "Não posso fugir, não posso fugir, não posso fugir!",
      context: "O mantra angustiado de Shinji no cockpit do EVA antes de enfrentar o terceiro anjo.",
      youtubeEmbedId: "vB0j9X4bL0A",
      videoPosterBg: "radial-gradient(circle at center, #4c1d95 0%, #09090b 100%)",
      voicePitch: 1.1,
      voiceRate: 0.9,
      words: [
        { jp: "逃げちゃ", romaji: "nigecha", pt: "fugir (contração de 逃げては)" },
        { jp: "ダメだ", romaji: "dame da", pt: "é proibido / não pode" }
      ],
      grammarNotes: [
        "〜ちゃ (cha): Contração extremamente comum no japonês falado para 〜ては (te wa).",
        "〜ちゃダメだ (cha dame da): Contração casual de 〜てはいけません (não deve fazer tal ação).",
        "Repetição Tríplice: Expressa combate ao pânico psicológico interno."
      ]
    },

    {
      id: "tanjiro-live",
      anime: "Kimetsu no Yaiba",
      character: "Tanjiro Kamado (竈門 炭治郎)",
      role: "Caçador de Demônios da Água",
      animeEmoji: "🌊",
      themeColor: "#0284c7",
      level: "N3",
      badgeText: "N3 / 〜しかない (Sem Escolha)",
      japanese: "失っても失っても、生きていくしかないんです。どんなに打ちのめされても。",
      furigana: "うしなってもうしなっても、いきていくしかないんです。どんなにうちのめされても。",
      romaji: "Ushinattemo ushinattemo, ikite iku shikanai n desu. Donna ni uchinomesaretemo.",
      portuguese: "Mesmo que percamos tudo repetidamente, não temos escolha a não ser continuar vivendo. Não importa o quanto sejamos derrubados.",
      context: "Tanjiro consola o jovem Kazumi que perdeu sua noiva, revelando a dor que carrega no peito.",
      youtubeEmbedId: "5jE3Tz4yF7s",
      videoPosterBg: "radial-gradient(circle at center, #0369a1 0%, #082f49 100%)",
      voicePitch: 1.05,
      voiceRate: 0.82,
      words: [
        { jp: "失っても", romaji: "ushinattemo", pt: "mesmo perdendo (〜ても condicional concessivo)" },
        { jp: "生きていくしかない", romaji: "ikite iku shikanai", pt: "não resta outra opção a não ser viver (N3)" },
        { jp: "どんなに〜ても", romaji: "donna ni... temo", pt: "por mais que... (N3 concessivo)" }
      ],
      grammarNotes: [
        "〜しかない (shikanai): Estrutura fundamental do N3 que significa 'não haver outra alternativa além de...'.",
        "〜ていく (te iku): Indica a continuação da ação no rumo do futuro incerto.",
        "どんなに〜ても (donna ni... temo): Gramática do N3 para concessão extrema ('não importa o quão duro seja')."
      ]
    },

    {
      id: "edward-stand",
      anime: "Fullmetal Alchemist: Brotherhood",
      character: "Edward Elric (エドワード・エルリック)",
      role: "O Alquimista de Aço",
      animeEmoji: "🦾",
      themeColor: "#b91c1c",
      level: "N3",
      badgeText: "N3 / Imperativo & 〜じゃないか",
      japanese: "立って歩け、前へ進め。あんたには立派な足がついてるじゃないか。",
      furigana: "たってあるけ、まえへすすめ。あんたにはりっぱなあしがついてるじゃないか。",
      romaji: "Tatte aruke, mae e susume. Anta ni wa rippa na ashi ga tsuiteru ja nai ka.",
      portuguese: "Fique de pé e ande, siga em frente. Você tem pernas perfeitamente boas para isso, não tem?",
      context: "O conselho firme de Edward para Rose em Liore ensinando-a a ser dona do próprio futuro.",
      youtubeEmbedId: "pTz8Z1aYF9Q",
      videoPosterBg: "radial-gradient(circle at center, #7f1d1d 0%, #1e1b4b 100%)",
      voicePitch: 0.95,
      voiceRate: 0.85,
      words: [
        { jp: "立って歩け", romaji: "tatte aruke", pt: "levante e ande! (Sequência -te + imperativo)" },
        { jp: "立派な足", romaji: "rippa na ashi", pt: "pernas admiráveis/saudáveis (N3 rippa)" },
        { jp: "ついてるじゃないか", romaji: "tsuiteru ja nai ka", pt: "você as possui, não é? (N3)" }
      ],
      grammarNotes: [
        "歩け / 進め: Formas imperativas dos verbos 歩く e 進む.",
        "立派な (rippa na): Adjetivo-na do N3 para algo respeitável e saudável.",
        "〜じゃないか (ja nai ka): Busca de confirmação enfática."
      ]
    },

    {
      id: "aizen-admiration",
      anime: "Bleach",
      character: "Sosuke Aizen (藍染 惣右介)",
      role: "Ex-Capitão do 5º Esquadrão",
      animeEmoji: "🦋",
      themeColor: "#475569",
      level: "N1",
      badgeText: "N1 / Retórica Filosófica",
      japanese: "憧れは理解から最も遠い感情だよ。",
      furigana: "あこがれはりかいからももっともとおいかんじょうだよ。",
      romaji: "Akogare wa rikai kara mottomo tōi kanjō da yo.",
      portuguese: "A admiração é o sentimento mais distante da verdadeira compreensão.",
      context: "Aizen desmascara sua verdadeira identidade na Soul Society expondo sua fria visão.",
      youtubeEmbedId: "kL_q6cM2v5s",
      videoPosterBg: "radial-gradient(circle at center, #1e293b 0%, #090d16 100%)",
      voicePitch: 0.9,
      voiceRate: 0.8,
      words: [
        { jp: "憧れ", romaji: "akogare", pt: "admiração distante (N2)" },
        { jp: "理解", romaji: "rikai", pt: "compreensão (N3)" },
        { jp: "最も遠い", romaji: "mottomo tōi", pt: "o mais distante (N2 superlativo)" }
      ],
      grammarNotes: [
        "憧れ (akogare): Substantivo derivado do verbo 憧れる (idolatrar à distância).",
        "最も (mottomo): Superlativo formal do N2.",
        "から最も遠い: Construção de antítese filosófica extrema."
      ]
    },

    {
      id: "gojo-saikyou",
      anime: "Jujutsu Kaisen",
      character: "Satoru Gojo (五条 悟)",
      role: "O Feiticeiro Mais Poderoso",
      animeEmoji: "👁️",
      themeColor: "#2563eb",
      level: "N4",
      badgeText: "N4 / Confiança e Afirmação",
      japanese: "大丈夫、僕 最強だから。",
      furigana: "だいじょうぶ、ぼく さいきょうだから。",
      romaji: "Daijōbu, boku saikyō dakara.",
      portuguese: "Não se preocupe. Afinal de contas, eu sou o mais forte.",
      context: "Gojo tranquiliza Megumi com total serenidade antes de lutar contra Sukuna recém-despertado.",
      videoPosterBg: "radial-gradient(circle at center, #1e3a8a 0%, #030712 100%)",
      voicePitch: 1.05,
      voiceRate: 0.88,
      words: [
        { jp: "大丈夫", romaji: "daijōbu", pt: "tudo bem / sem problemas" },
        { jp: "僕", romaji: "boku", pt: "eu (pronome masculino casual/amigável)" },
        { jp: "最強", romaji: "saikyō", pt: "o mais forte (最 mais + 強 forte)" },
        { jp: "〜だから", romaji: "dakara", pt: "porque / afinal de contas (justificativa enfática)" }
      ],
      grammarNotes: [
        "大丈夫 (daijōbu - adjetivo na): Utilizado para acalmar alguém sobre uma situação.",
        "最強 (saikyō): Prefixo 最 (sai = superlativo absoluto) + 強 (kyō = forte).",
        "〜だから (dakara): Conectivo causal informal colocado no final da oração para expressar confiança inabalável."
      ]
    },

    {
      id: "yourname-seeking",
      anime: "Kimi no Na wa (Your Name)",
      character: "Taki Tachibana & Mitsuha Miyamizu",
      role: "Destino Cruzado entre Tóquio e Itomori",
      animeEmoji: "🌠",
      themeColor: "#0284c7",
      level: "N3",
      badgeText: "N3 / Modificação e Experiência",
      japanese: "まだ会ったことのない君を、探している。",
      furigana: "まだあったことのないきみを、さがしている。",
      romaji: "Mada atta koto no nai kimi o, sagashite iru.",
      portuguese: "Estou procurando por você, alguém que eu ainda nem cheguei a conhecer.",
      context: "O monólogo central que resume o sentimento de busca e conexão temporal entre Taki e Mitsuha.",
      videoPosterBg: "radial-gradient(circle at center, #075985 0%, #0f172a 100%)",
      voicePitch: 1.0,
      voiceRate: 0.85,
      words: [
        { jp: "まだ", romaji: "mada", pt: "ainda / até agora" },
        { jp: "会ったことのない", romaji: "atta koto no nai", pt: "que nunca encontrei (forma de experiência negativa)" },
        { jp: "君を", romaji: "kimi o", pt: "a ti / você (partícula de objeto を)" },
        { jp: "探している", romaji: "sagashite iru", pt: "estou procurando (gerúndio contínuo 〜ている)" }
      ],
      grammarNotes: [
        "〜たことがない (ta koto ga nai / no nai): Estrutura fundamental do N4/N3 para expressar nunca ter tido uma experiência.",
        "君 (kimi): Forma afetuosa e poética de se dirigir à pessoa amada.",
        "〜ている (te iru): Ação contínua e persistente de busca no presente."
      ]
    }
  ],

  // 3. Provérbios de 4 Kanjis (Yojijukugo - 四字熟語)
  yojijukugo: [
    {
      kanji: "一期一会",
      reading: "いちごいちえ (Ichigo Ichie)",
      meaning: "Um encontro único na vida",
      explanation: "Conceito derivado da cerimônia do chá (Chadō). Cada momento e cada pessoa com quem você se conecta deve ser valorizado ao máximo, pois nunca mais se repetirá exatamente da mesma forma.",
      theme: "Filosofia & Conexão",
      badge: "JLPT N2 / Filosofia Clássica"
    },
    {
      kanji: "七転八起",
      reading: "しちてんはっき (Shichiten Hakki)",
      meaning: "Cair 7 vezes, levantar 8",
      explanation: "O provérbio mais emblemático da resiliência e persistência japonesa. Simbolizado pelo boneco Daruma, ensina que o fracasso temporário é apenas parte da jornada para a vitória.",
      theme: "Perseverança",
      badge: "JLPT N3 / Lema Shōnen"
    },
    {
      kanji: "以心伝心",
      reading: "いしんでんしん (Ishin Denshin)",
      meaning: "Comunicação de coração a coração",
      explanation: "Compreensão mútua instantânea e tácita entre pessoas muito conectadas, sem necessidade de palavras faladas.",
      theme: "Empatia & Relações",
      badge: "JLPT N2 / Cultura Social"
    },
    {
      kanji: "弱肉強食",
      reading: "じゃくにくきょうしょく (Jakuniku Kyōshoku)",
      meaning: "A lei da selva / O forte devora o fraco",
      explanation: "Muito citado por antagonistas e espadachins em animes de batalha (como Shishio em Rurouni Kenshin ou Meruem em HxH).",
      theme: "Batalha & Realismo",
      badge: "JLPT N2 / Frases de Vilões"
    },
    {
      kanji: "自業自得",
      reading: "じごうじとく (Jigō Jitoku)",
      meaning: "Colher o que plantou / Carma próprio",
      explanation: "Origem budista que indica que toda consequência (boa ou ruim) decorre inevitavelmente dos atos praticados pela própria pessoa.",
      theme: "Carma & Consequência",
      badge: "JLPT N2 / Uso Cotidiano"
    },
    {
      kanji: "温故知新",
      reading: "おんこちしん (Onko Chishin)",
      meaning: "Aprender com o passado para criar o novo",
      explanation: "Estudar a sabedoria e tradição dos mestres antigos para desenvolver inovações relevantes no presente.",
      theme: "Sabedoria & Aprendizado",
      badge: "JLPT N1 / Confucionismo"
    },
    {
      kanji: "百折不撓",
      reading: "ひゃくせつふとう (Hyakusetsu Futō)",
      meaning: "Indomável / Nunca se dobrar a cem reveses",
      explanation: "Determinação absoluta de continuar em frente mesmo após sofrer centenas de derrotas e dificuldades consecutivas.",
      theme: "Espírito Guerreiro",
      badge: "JLPT N1 / Honra Samurai"
    },
    {
      kanji: "臥薪嘗胆",
      reading: "がしんしょうたん (Gashin Shōtan)",
      meaning: "Suportar grandes amarguras pela vitória final",
      explanation: "Dormir sobre lenha e lamber fel amargo para não esquecer o objetivo da vingança ou da superação máxima.",
      theme: "Estratégia & Paciência",
      badge: "JLPT N1 / Clássicos Históricos"
    },
    {
      kanji: "花鳥風月",
      reading: "かちょうふうげつ (Kachō Fūgetsu)",
      meaning: "A pura contemplação das belezas da natureza",
      explanation: "Flores (花), pássaros (鳥), vento (風) e lua (月). A apreciação estética e pacífica das transformações das quatro estações do ano na cultura japonesa.",
      theme: "Estética & Natureza",
      badge: "JLPT N2 / Poesia & Tradição"
    },
    {
      kanji: "明鏡止水",
      reading: "めいきょうしすい (Meikyō Shisui)",
      meaning: "Mente serena e translúcida como águas calmas",
      explanation: "Um espelho límpido (明鏡) e água estagnada e serena (止水). Estado mental imperturbável, sem vestígios de ódio, medo ou vaidade, essencial nas artes marciais (Budō).",
      theme: "Serenidade & Bushidō",
      badge: "JLPT N1 / Zen Budismo"
    }
  ],

  // 4. Guia Comparativo: Gírias de Anime vs. Japonês Real do Dia a Dia
  animeVsRealLife: {
    pronouns: [
      { pronoun: "おれ (Ore)", usageAnime: "Usado por quase todo protagonista shōnen (Luffy, Naruto, Goku).", reality: "Muito informal e masculino. Use apenas com amigos homens muito próximos. Em ambiente de trabalho ou com estranhos, soa rude." },
      { pronoun: "ぼく (Boku)", usageAnime: "Garotos gentis, tímidos ou intelectuais (Deku, Shinji).", reality: "Comum entre homens em situações casuais ou semiformais. Bastante aceito, mas evite em reuniões de negócios formais." },
      { pronoun: "私 (Watashi)", usageAnime: "Mulheres ou homens formais e calculistas.", reality: "O pronome padrão e educado para todos! Em ambiente de trabalho ou com desconhecidos, é a escolha mais segura para homens e mulheres." },
      { pronoun: "お前 (Omae)", usageAnime: "Personagens chamando rivais ou amigos íntimos.", reality: "Pode soar agressivo ou desrespeitoso se usado com quem você não tem intimidade. Com superiores, é considerado ofensa." },
      { pronoun: "貴様 (Kisama)", usageAnime: "Vilões e heróis furiosos ('Seu desgraçado!').", reality: "Palavra historicamente honrosa que hoje se tornou uma ofensa pesada. Ninguém usa na vida real civilizada japonesa." }
    ],
    contractions: [
      { casual: "〜ねぇ (-nee)", standard: "〜ない (-nai)", example: "知らねぇ (shiraneぇ) ➔ 知らない (shiranai - não sei)", note: "Gíria masculina bem enfática de animes." },
      { casual: "〜なきゃ (-nakya)", standard: "〜なければならない (-nakereba naranai)", example: "行かなきゃ (ikanakya) ➔ 行かなければなりません (tenho que ir)", note: "Muito comum tanto no anime quanto na fala coloquial real!" },
      { casual: "〜ちゃダメ (-cha dame)", standard: "〜てはいけない (-te wa ikenai)", example: "見ちゃダメ (micha dame) ➔ 見てはいけません (não olhe)", note: "Proibição casual usada entre amigos e familiares." },
      { casual: "〜ちゃう (-chau)", standard: "〜てしまう (-te shimau)", example: "食べちゃった (tabechatta) ➔ 食べてしまいました (acabei comendo tudo)", note: "Expressa que uma ação foi concluída ou que houve um pequeno acidente." }
    ]
  }
};

/**
 * Classe Controladora do Módulo Avançado
 */
class JapaneseAdvancedController {
  constructor() {
    this.currentTab = "anime"; // 'anime', 'jlpt', 'yojijukugo', 'slang'
    this.currentJlptLevel = "n3";
    this.currentAnimeFilter = "all";
    this.currentLevelFilter = "all";
    this.hideFuriganaMode = false;
    this.activeUtterance = null;
    this.cultureJlptLevel = "n5";
    this.cultureQuizType = "mixed";
    this.cultureQuizLevel = "all";
    this.cultureQuizRounds = [];
    this.cultureQuizIndex = 0;
    this.cultureQuizScore = 0;
    this.cultureQuizLocked = false;
    this.cultureStudyProgress = this.loadCultureStudyProgress();
    this.cultureSkillMode = "listen";
    this.cultureSkillRounds = [];
    this.cultureSkillIndex = 0;
    this.cultureSkillScore = 0;
    this.cultureSkillAnswered = false;
    this.cultureSkillRecognition = null;
  }

  init() {
    this.renderAnimeLibrary();
    this.renderAnimeScenes();
    this.renderJlptLevel(this.currentJlptLevel);
    this.updateJlptRoute(this.currentJlptLevel);
    this.renderYojijukugo();
    this.renderSlangGuide();
    this.renderJlptLevel(this.cultureJlptLevel, "cultureJlptContent");
    this.renderCultureStudyDashboard();
    this.startCultureQuiz();
    this.attachEvents();
  }

  attachEvents() {
    document.querySelectorAll("[data-culture-tab]").forEach(button => {
      button.addEventListener("click", () => this.switchCultureTab(button.dataset.cultureTab));
    });
    document.querySelectorAll("[data-culture-level]").forEach(button => {
      button.addEventListener("click", () => this.selectCultureJlptLevel(button.dataset.cultureLevel));
    });
    document.querySelectorAll("[data-study-step]").forEach(button => {
      button.addEventListener("click", () => this.completeCultureStudyStep(button.dataset.studyStep));
    });
    document.getElementById("cultureMissionChallenge")?.addEventListener("click", () => this.startCultureLevelChallenge());
    document.getElementById("cultureStudyNote")?.addEventListener("input", event => this.saveCultureStudyNote(event.target.value));
    document.getElementById("cultureClearNote")?.addEventListener("click", () => {
      const note = document.getElementById("cultureStudyNote");
      note.value = "";
      this.saveCultureStudyNote("");
      note.focus();
    });
    const skillStudio = document.getElementById("cultureJlptContent");
    skillStudio?.addEventListener("click", event => {
      const button = event.target.closest("[data-skill-action], [data-skill-mode], [data-skill-choice]");
      if (!button) return;
      if (button.dataset.skillMode) {
        this.setCultureSkillMode(button.dataset.skillMode);
      } else if (button.dataset.skillChoice) {
        this.handleCultureSkillChoice(button);
      } else {
        this.handleCultureSkillAction(button.dataset.skillAction);
      }
    });
    skillStudio?.addEventListener("submit", event => {
      if (event.target.id !== "cultureSkillForm") return;
      event.preventDefault();
      this.checkCultureSkillAnswer(document.getElementById("cultureSkillInput").value);
    });
    document.querySelectorAll("[data-culture-activity]").forEach(button => {
      button.addEventListener("click", () => {
        this.cultureQuizType = button.dataset.cultureActivity;
        document.querySelectorAll("[data-culture-activity]").forEach(modeButton => {
          const selected = modeButton === button;
          modeButton.classList.toggle("active", selected);
          modeButton.setAttribute("aria-pressed", String(selected));
        });
        this.startCultureQuiz();
      });
    });
    document.getElementById("cultureActivityLevel")?.addEventListener("change", event => {
      this.cultureQuizLevel = event.target.value;
      this.startCultureQuiz();
    });
    document.getElementById("cultureQuizNext")?.addEventListener("click", () => this.nextCultureQuizQuestion());
    document.getElementById("cultureQuizRestart")?.addEventListener("click", () => this.startCultureQuiz());

    // Alternância de Abas Internas
    document.querySelectorAll(".adv-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });
    document.querySelectorAll(".anime-library-link, .listening-back-link").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        this.switchTab(link.getAttribute("data-tab"));
      });
    });
    const library = document.getElementById("animeLibraryGrid");
    if (library) {
      library.addEventListener("click", event => {
        const button = event.target.closest("[data-anime-name]");
        if (button) this.openAnimeListening(button.dataset.animeName);
      });
    }

    // Seletor de Níveis JLPT (N5 a N1)
    document.querySelectorAll(".jlpt-level-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const level = pill.getAttribute("data-level");
        this.switchJlptLevel(level);
      });
    });

    // Filtros de Anime
    const animeSelect = document.getElementById("advAnimeFilterSelect");
    if (animeSelect) {
      animeSelect.addEventListener("change", (e) => {
        this.currentAnimeFilter = e.target.value;
        this.renderAnimeScenes();
      });
    }

    const levelSelect = document.getElementById("advLevelFilterSelect");
    if (levelSelect) {
      levelSelect.addEventListener("change", (e) => {
        this.currentLevelFilter = e.target.value;
        this.renderAnimeScenes();
      });
    }

    // Busca de falas
    const searchInput = document.getElementById("advAnimeSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.renderAnimeScenes(e.target.value);
      });
    }

    // Alternador de Furigana/Tradução
    const toggleFuriganaBtn = document.getElementById("toggleAnimeFuriganaBtn");
    if (toggleFuriganaBtn) {
      toggleFuriganaBtn.addEventListener("click", () => {
        this.hideFuriganaMode = !this.hideFuriganaMode;
        toggleFuriganaBtn.classList.toggle("active", this.hideFuriganaMode);
        toggleFuriganaBtn.innerHTML = this.hideFuriganaMode 
          ? "👁️ Modo Treino: Furigana Oculto" 
          : "👁️ Furigana & Tradução Visíveis";
        this.renderAnimeScenes();
      });
    }
  }

  switchCultureTab(tabName) {
    const validTabs = ["overview", "jlpt", "activities"];
    if (!validTabs.includes(tabName)) return;

    document.querySelectorAll("[data-culture-tab]").forEach(button => {
      const selected = button.dataset.cultureTab === tabName;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".culture-tab-panel").forEach(panel => {
      panel.hidden = panel.id !== `culturePanel${tabName[0].toUpperCase()}${tabName.slice(1)}`;
    });
  }

  loadCultureStudyProgress() {
    const storageKey = "nihongo_culture_jlpt_progress";
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { xp: 0, levels: {} };

    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || !parsed.levels || typeof parsed.levels !== "object") {
        throw new Error("Formato inválido para o progresso de estudos JLPT.");
      }
      return {
        xp: Number.isFinite(parsed.xp) ? parsed.xp : 0,
        levels: parsed.levels
      };
    } catch (error) {
      console.warn("O progresso JLPT salvo não pôde ser lido; uma nova trilha será iniciada.", error);
      return { xp: 0, levels: {} };
    }
  }

  saveCultureStudyProgress() {
    try {
      localStorage.setItem("nihongo_culture_jlpt_progress", JSON.stringify(this.cultureStudyProgress));
      return true;
    } catch (error) {
      console.error("Não foi possível salvar o progresso JLPT neste dispositivo.", error);
      const status = document.getElementById("cultureNotesSaved");
      if (status) status.textContent = "Falha ao salvar";
      window.app?.showToast("Não foi possível salvar seu progresso JLPT no navegador.", "error");
      return false;
    }
  }

  getCultureStudyLevelState(level = this.cultureJlptLevel) {
    if (!this.cultureStudyProgress.levels[level]) {
      this.cultureStudyProgress.levels[level] = { steps: {}, note: "", bestScore: 0 };
    }
    const levelState = this.cultureStudyProgress.levels[level];
    if (!levelState.steps || typeof levelState.steps !== "object") levelState.steps = {};
    if (typeof levelState.note !== "string") levelState.note = "";
    if (!Number.isFinite(levelState.bestScore)) levelState.bestScore = 0;
    return levelState;
  }

  selectCultureJlptLevel(level) {
    if (!ADVANCED_DATA.jlpt[level]) return;
    this.cultureJlptLevel = level;
    document.querySelectorAll("[data-culture-level]").forEach(button => {
      const selected = button.dataset.cultureLevel === level;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    this.renderJlptLevel(level, "cultureJlptContent");
    this.renderCultureStudyDashboard();
  }

  renderCultureStudyDashboard() {
    const levelState = this.getCultureStudyLevelState();
    const completedSteps = ["grammar", "kanji", "vocab"].filter(step => levelState.steps[step]).length;
    const missionNames = {
      n5: ["Construa sua base", "Ganhe confiança no básico"],
      n4: ["Amplie seu repertório", "Conecte frases e ideias"],
      n3: ["Atravesse a ponte", "Leia entre as linhas"],
      n2: ["Aprofunde sua precisão", "Domine as nuances"],
      n1: ["Refine o olhar", "Desafie sua leitura avançada"]
    };
    const mission = missionNames[this.cultureJlptLevel];
    document.getElementById("cultureMissionTitle").textContent = mission[0];
    document.getElementById("cultureMissionDescription").textContent =
      `${mission[1]}: complete as três etapas e teste seu conhecimento em um desafio de 10 questões.`;
    document.getElementById("cultureStudyXp").textContent = `${this.cultureStudyProgress.xp} XP`;
    document.getElementById("cultureMissionProgress").style.width = `${(completedSteps / 3) * 100}%`;
    document.querySelector(".culture-mission-progress").setAttribute("aria-valuenow", String(completedSteps));
    document.querySelectorAll("[data-study-step]").forEach(button => {
      const complete = Boolean(levelState.steps[button.dataset.studyStep]);
      button.classList.toggle("is-complete", complete);
      button.setAttribute("aria-pressed", String(complete));
      button.querySelector(".culture-step-status").textContent = complete ? "✓" : "○";
    });

    const note = document.getElementById("cultureStudyNote");
    if (note && note.dataset.level !== this.cultureJlptLevel) {
      note.value = levelState.note;
      note.dataset.level = this.cultureJlptLevel;
    }
    document.getElementById("cultureNoteCount").textContent = `${(note?.value || "").length} / 2000`;
  }

  completeCultureStudyStep(step) {
    const sectionIndexes = {
      grammar: 0,
      kanji: 1,
      vocab: 2
    };
    if (sectionIndexes[step] === undefined) return;

    const levelState = this.getCultureStudyLevelState();
    if (!levelState.steps[step]) {
      levelState.steps[step] = true;
      this.cultureStudyProgress.xp += 15;
      this.saveCultureStudyProgress();
    }
    this.renderCultureStudyDashboard();
    document.querySelectorAll("#cultureJlptContent .jlpt-content-section")[sectionIndexes[step]]
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  saveCultureStudyNote(value) {
    const levelState = this.getCultureStudyLevelState();
    levelState.note = value;
    const saved = this.saveCultureStudyProgress();
    document.getElementById("cultureNoteCount").textContent = `${value.length} / 2000`;
    const status = document.getElementById("cultureNotesSaved");
    if (!saved) return;
    status.textContent = "Nota salva";
    clearTimeout(this.cultureNoteStatusTimer);
    this.cultureNoteStatusTimer = setTimeout(() => {
      status.textContent = "Salvo neste dispositivo";
    }, 1400);
  }

  startCultureLevelChallenge() {
    this.cultureQuizType = "mixed";
    this.cultureQuizLevel = this.cultureJlptLevel;
    document.getElementById("cultureActivityLevel").value = this.cultureJlptLevel;
    document.querySelectorAll("[data-culture-activity]").forEach(button => {
      const selected = button.dataset.cultureActivity === "mixed";
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    this.startCultureQuiz();
    this.switchCultureTab("activities");
    document.getElementById("cultureQuizTitle").textContent = `Desafio JLPT ${this.cultureJlptLevel.toUpperCase()}`;
    document.getElementById("culturePanelActivities").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll(".adv-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });

    document.querySelectorAll(".adv-tab-content").forEach(panel => {
      panel.style.display = panel.id === `adv-tab-${tabName}` ? "block" : "none";
    });
  }

  openAnimeListening(animeName) {
    this.currentAnimeFilter = animeName;
    this.currentLevelFilter = "all";
    const animeSelect = document.getElementById("advAnimeFilterSelect");
    const levelSelect = document.getElementById("advLevelFilterSelect");
    const searchInput = document.getElementById("advAnimeSearchInput");
    if (animeSelect) animeSelect.value = animeName;
    if (levelSelect) levelSelect.value = "all";
    if (searchInput) searchInput.value = "";
    this.switchTab("listening");
    this.renderAnimeScenes();
  }

  renderAnimeLibrary() {
    const container = document.getElementById("animeLibraryGrid");
    if (!container) return;

    const series = new Map();
    ADVANCED_DATA.animeScenes.forEach(scene => {
      const title = scene.anime.replace(" (Demon Slayer)", "");
      const entry = series.get(title) || { title, scenes: [], representative: scene };
      entry.scenes.push(scene);
      series.set(title, entry);
    });

    const entries = [...series.values()].sort((a, b) => {
      if (a.title.startsWith("Re:Zero")) return -1;
      if (b.title.startsWith("Re:Zero")) return 1;
      return a.title.localeCompare(b.title);
    });
    const stats = document.getElementById("animeLibraryStats");
    const count = document.getElementById("animeLibraryCount");
    if (stats) stats.innerHTML = `
      <div><strong>${entries.length.toString().padStart(2, "0")}</strong><span>universos</span></div>
      <div><strong>${ADVANCED_DATA.animeScenes.length.toString().padStart(2, "0")}</strong><span>sessões</span></div>
      <div><strong>01—05</strong><span>níveis JLPT</span></div>
    `;
    if (count) count.textContent = `${entries.length} séries no acervo`;

    container.innerHTML = entries.map((entry, index) => {
      const levels = [...new Set(entry.scenes.map(scene => scene.level))].sort();
      const featured = entry.representative;
      const seriesFilter = featured.anime.replace(" (Demon Slayer)", "");
      const slug = entry.title.startsWith("Re:Zero") ? "rezero" : `series-${index % 5}`;
      return `
        <article class="anime-library-card ${slug}" style="--series-accent: ${featured.themeColor};">
          <div class="anime-library-art">
            <span class="anime-library-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="anime-library-symbol" aria-hidden="true">${featured.animeEmoji}</span>
            <span class="anime-library-japanese" aria-hidden="true">${entry.title.startsWith("Re:Zero") ? "零から" : "物語"}</span>
            <span class="anime-library-art-caption">KISE JAPAN · ANIME ARCHIVE</span>
          </div>
          <div class="anime-library-card-body">
            <div class="anime-library-card-meta"><span>${entry.scenes.length} ${entry.scenes.length === 1 ? "sessão" : "sessões"}</span><span>${levels.join(" · ")}</span></div>
            <h3>${entry.title}</h3>
            <p class="anime-library-character"><span>${featured.animeEmoji}</span>${featured.character}</p>
            <p class="anime-library-summary">${featured.role}</p>
            <div class="anime-library-card-footer">
              <span>${levels.map(level => `<i>${level}</i>`).join("")}</span>
              <button type="button" data-anime-name="${seriesFilter}" aria-label="Explorar sessões de ${entry.title}">Explorar <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  switchJlptLevel(levelKey) {
    this.currentJlptLevel = levelKey;
    document.querySelectorAll(".jlpt-level-pill").forEach(pill => {
      pill.classList.toggle("active", pill.getAttribute("data-level") === levelKey);
    });
    this.renderJlptLevel(levelKey);
    this.updateJlptRoute(levelKey);
  }

  updateJlptRoute(levelKey) {
    const levels = ["n5", "n4", "n3", "n2", "n1"];
    const activeIndex = levels.indexOf(levelKey);
    const route = document.querySelector(".jlpt-route-steps");
    if (activeIndex < 0 || !route) return;

    route.querySelectorAll("[data-route-level]").forEach((step, index) => {
      step.classList.toggle("is-passed", index < activeIndex);
      step.classList.toggle("is-current", index === activeIndex);
      if (index === activeIndex) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    route.querySelectorAll("i").forEach((connector, index) => {
      connector.classList.toggle("is-passed", index < activeIndex);
    });
  }

  /**
   * Renderiza as Cenas e Falas de Anime
   */
  renderAnimeScenes(searchQuery = "") {
    const container = document.getElementById("animeScenesGrid");
    if (!container) return;

    let scenes = ADVANCED_DATA.animeScenes;

    // Filtro por anime
    if (this.currentAnimeFilter !== "all") {
      scenes = scenes.filter(s => s.anime.toLowerCase().includes(this.currentAnimeFilter.toLowerCase()));
    }

    // Filtro por nível JLPT
    if (this.currentLevelFilter !== "all") {
      scenes = scenes.filter(s => s.level.toLowerCase() === this.currentLevelFilter.toLowerCase());
    }

    // Filtro de busca
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      scenes = scenes.filter(s => 
        s.anime.toLowerCase().includes(q) ||
        s.character.toLowerCase().includes(q) ||
        s.japanese.includes(q) ||
        s.portuguese.toLowerCase().includes(q) ||
        s.romaji.toLowerCase().includes(q)
      );
    }

    const sessionCount = document.getElementById("listeningSessionCount");
    if (sessionCount) {
      sessionCount.textContent = `${scenes.length.toString().padStart(2, "0")} ${scenes.length === 1 ? "SESSÃO DISPONÍVEL" : "SESSÕES DISPONÍVEIS"}`;
    }

    if (scenes.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Nenhuma fala de anime encontrada</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Tente ajustar seus filtros de anime ou nível JLPT.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = scenes.map(scene => {
      const furiganaStyle = this.hideFuriganaMode ? "opacity: 0.15; filter: blur(3px); transition: filter 0.2s;" : "";
      const transStyle = this.hideFuriganaMode ? "opacity: 0.15; filter: blur(3px); transition: filter 0.2s;" : "";

      return `
        <div class="anime-scene-card" id="card-${scene.id}" style="--theme-accent: ${scene.themeColor};">
          <!-- Cabeçalho do Card -->
          <div class="scene-card-header">
            <div class="scene-anime-tag">
              <span class="scene-anime-icon">${scene.animeEmoji}</span>
              <span class="scene-anime-name">${scene.anime}</span>
            </div>
            <div class="scene-jlpt-tag">${scene.badgeText}</div>
          </div>

          <!-- Personagem & Citações -->
          <div class="scene-char-row">
            <div class="scene-char-avatar" style="background: ${scene.themeColor};">
              ${scene.animeEmoji}
            </div>
            <div>
              <h3 class="scene-char-name">${scene.character}</h3>
              <p class="scene-char-role">${scene.role}</p>
            </div>
          </div>

          ${scene.originalStudy ? `
            <div class="scene-original-note">
              <span aria-hidden="true">✦</span>
              <span>Exercício original de japonês — não é uma fala oficial do anime.</span>
            </div>
          ` : ""}

          <!-- Janela do Player de Áudio & Shadowing Cinematográfico -->
          <div class="scene-audio-card-frame" style="background: ${scene.videoPosterBg};">
            <div class="scene-cine-overlay">
              <span class="scene-cinematic-badge">🎧 LISTENING LAB <span aria-hidden="true">•</span> ${scene.level}</span>
              <div class="scene-quote-display">
                <div class="scene-jp-main" title="${scene.furigana}">${scene.japanese}</div>
                <div class="scene-furigana-sub" style="${furiganaStyle}">${scene.furigana}</div>
                <div class="scene-romaji-sub" style="${furiganaStyle}">${scene.romaji}</div>
              </div>
            </div>

            <!-- Botões de Ação do Player de Áudio & Shadowing -->
            <div class="scene-audio-actions">
              <button class="scene-play-btn" onclick="window.japaneseAdvanced.playAnimeAudio('${scene.id}', 1.0)" title="Ouvir em Velocidade Normal (1.0x)">
                ▶️ Ouvir Linha (1.0x)
              </button>
              <button class="scene-slow-btn" onclick="window.japaneseAdvanced.playAnimeAudio('${scene.id}', 0.75)" title="Treino de Shadowing Lento (0.75x)">
                🐢 Shadowing (0.75x)
              </button>
              <button class="scene-detail-btn" onclick="window.japaneseAdvanced.playAnimeAudio('${scene.id}', 0.5)" title="Áudio Super Lento Detalhado (0.5x)">
                ⚡ 0.5x Detalhado
              </button>
              <button class="scene-repeat-btn" onclick="window.japaneseAdvanced.practiceShadowingPrompt('${scene.id}')" title="Desafio: Pratique repetindo em voz alta">
                🎤 Treinar Fala
              </button>
            </div>
          </div>

          <!-- Tradução e Significado -->
          <div class="scene-trans-box" style="${transStyle}" onclick="this.style.opacity='1'; this.style.filter='none';" title="Clique para revelar caso esteja oculto">
            <div class="scene-trans-label">O sentido da frase</div>
            <div class="scene-trans-text">"${scene.portuguese}"</div>
          </div>

          <!-- Contexto da Cena -->
          <div class="scene-context-note">
            <strong>Contexto:</strong> ${scene.context}
          </div>

          <!-- Decomposição Gramatical JLPT Accordion -->
          <div class="scene-grammar-accordion">
            <details>
              <summary class="scene-grammar-summary">
                <span>📚 Palavras e estruturas desta frase</span>
                <span class="chevron">▼</span>
              </summary>
              <div class="scene-grammar-body">
                <div class="scene-words-chips">
                  ${scene.words.map(w => `
                    <div class="scene-word-chip">
                      <span class="w-jp">${w.jp}</span>
                      <span class="w-rom">${w.romaji}</span>
                      <span class="w-pt">${w.pt}</span>
                    </div>
                  `).join("")}
                </div>
                <ul class="scene-grammar-list">
                  ${scene.grammarNotes.map(note => `<li>${note}</li>`).join("")}
                </ul>
              </div>
            </details>
          </div>
        </div>
      `;
    }).join("");
  }

  /**
   * Reproduz a fala em japonês usando síntese calibrada
   */
  playAnimeAudio(sceneId, speed = 1.0, onEndCallback = null) {
    const scene = ADVANCED_DATA.animeScenes.find(s => s.id === sceneId);
    if (!scene) return;

    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz nativa.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = scene.japanese.replace(/[「」…]/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ja-JP";
    utterance.rate = (scene.voiceRate || 0.85) * speed;
    utterance.pitch = scene.voicePitch || 1.0;

    const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("ja"));
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    const card = document.getElementById(`card-${sceneId}`);
    if (card) {
      card.classList.add("playing-audio");
    }

    utterance.onend = () => {
      if (card) card.classList.remove("playing-audio");
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      if (card) card.classList.remove("playing-audio");
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);

    if (window.app) {
      window.app.incrementPracticed();
    }
  }

  /**
   * Desafio de Prática de Shadowing Interativo com Fala e Áudio
   */
  practiceShadowingPrompt(sceneId) {
    const scene = ADVANCED_DATA.animeScenes.find(s => s.id === sceneId);
    if (!scene) return;

    // Reproduz em velocidade ideal para shadowing (0.8x)
    this.playAnimeAudio(sceneId, 0.8, () => {
      if (window.app && window.app.showToast) {
        window.app.showToast(`🎙️ Shadowing: Repita em voz alta: "${scene.japanese}"!`, "info");
      }
    });
  }

  /* Stubs de compatibilidade segura */
  openVideoModal(sceneId) {
    this.practiceShadowingPrompt(sceneId);
  }

  runTheaterPlayback(sceneId, speed = 1.0) {
    this.playAnimeAudio(sceneId, speed);
  }

  closeVideoModal() {
    window.speechSynthesis.cancel();
  }

  /**
   * Renderiza a Trilha de Nível JLPT Selecionada (N5 a N1)
   */
  renderJlptLevel(levelKey, containerId = "jlptLevelContent") {
    const levelData = ADVANCED_DATA.jlpt[levelKey];
    const container = document.getElementById(containerId);
    if (!levelData || !container) return;

    container.innerHTML = `
      <!-- Banner de Visão Geral do Nível -->
      <div class="jlpt-overview-banner" style="--jlpt-accent: ${levelData.color}; border-left: 5px solid ${levelData.color};">
        <div class="jlpt-ob-header">
          <div>
            <span class="jlpt-badge-pill" style="background: ${levelData.color};">${levelData.badge}</span>
            <h2 class="jlpt-level-title">${levelData.name}</h2>
          </div>
          <div class="jlpt-stats-grid">
            <div class="jlpt-stat-item">
              <span class="jlpt-stat-val">${levelData.stats.kanjiCount}</span>
              <span class="jlpt-stat-lbl">Kanjis Requeridos</span>
            </div>
            <div class="jlpt-stat-item">
              <span class="jlpt-stat-val">${levelData.stats.vocabCount}</span>
              <span class="jlpt-stat-lbl">Vocabulário Estimado</span>
            </div>
            <div class="jlpt-stat-item">
              <span class="jlpt-stat-val">${levelData.stats.studyHours}</span>
              <span class="jlpt-stat-lbl">Horas de Estudo</span>
            </div>
          </div>
        </div>
        <p class="jlpt-level-desc">${levelData.stats.summary}</p>
      </div>

      <div class="jlpt-study-counts" aria-label="Conteúdo de revisão deste nível">
        <div><strong>${levelData.grammar.length}</strong><span>pontos de gramática</span></div>
        <div><strong>${levelData.kanji.length}</strong><span>kanji para revisar</span></div>
        <div><strong>${levelData.vocab.length}</strong><span>palavras e expressões</span></div>
      </div>

      <!-- Seção 1: Gramática-chave do nível -->
      <div class="jlpt-content-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 class="jlpt-sec-title" style="margin-bottom: 0;">📖 Gramática essencial · ${levelKey.toUpperCase()}</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Toque em qualquer exemplo para ouvir a pronúncia 🔊</span>
        </div>
        <div class="jlpt-grammar-cards-grid">
          ${levelData.grammar.map((g, index) => `
            <div class="jlpt-grammar-card" style="--jlpt-accent: ${levelData.color};">
              <div class="jg-index"><span>${String(index + 1).padStart(2, "0")}</span><i></i>${levelKey.toUpperCase()} · GRAMÁTICA</div>
              <div class="jg-pattern">${g.pattern}</div>
              <div class="jg-meaning">${g.meaning}</div>
              <p class="jg-expl">${g.explanation}</p>
              <div class="jg-example-box" onclick="(window.app || window.japaneseApp).speakJapanese('${g.exampleJp.replace(/'/g, "\\'")}')" title="Clique para ouvir a pronúncia">
                <div class="jg-ex-jp">
                  <span>${g.exampleJp}</span>
                  <button class="jg-audio-btn">🔊</button>
                </div>
                <div class="jg-ex-romaji">${g.exampleRomaji}</div>
                <div class="jg-ex-pt">"${g.examplePt}"</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Seção 2: Kanji para revisão -->
      <div class="jlpt-content-section" style="margin-top: 2.5rem;">
        <h3 class="jlpt-sec-title">🈴 Kanji em contexto · ${levelKey.toUpperCase()}</h3>
        <div class="jlpt-kanji-cards-grid">
          ${levelData.kanji.map(k => `
            <div class="jlpt-kanji-card" onclick="(window.app || window.japaneseApp).speakJapanese('${k.char}')">
              <div class="jk-char">${k.char}</div>
              <div class="jk-mean">${k.meaning}</div>
              <div class="jk-readings">
                <div><span class="jk-lbl">On:</span> ${k.onyomi}</div>
                <div><span class="jk-lbl">Kun:</span> ${k.kunyomi}</div>
              </div>
              <div class="jk-example">${k.example}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Seção 3: Vocabulário com áudio -->
      <div class="jlpt-content-section" style="margin-top: 2.5rem;">
        <h3 class="jlpt-sec-title">💡 Vocabulário de revisão · ${levelKey.toUpperCase()}</h3>
        <div class="jlpt-vocab-chips-row">
          ${levelData.vocab.map(v => `
            <div class="jlpt-vocab-chip" onclick="(window.app || window.japaneseApp).speakJapanese('${v.jp}')" title="Clique para ouvir a pronúncia">
              <span class="v-jp-text">${v.jp}</span>
              <span class="v-rom-text">${v.romaji}</span>
              <span class="v-pt-text">${v.pt}</span>
              <span class="v-spk-icon">🔊</span>
            </div>
          `).join("")}
        </div>
      </div>
      ${containerId === "cultureJlptContent" ? this.renderCultureSkillStudio(levelKey) : ""}
    `;
    if (containerId === "cultureJlptContent") this.startCultureSkillPractice();
  }

  renderCultureSkillStudio(levelKey) {
    const isBeginner = ["n5", "n4"].includes(levelKey);
    return `
      <section class="culture-skill-studio" aria-labelledby="cultureSkillTitle">
        <div class="culture-skill-heading">
          <div>
            <span class="culture-section-kicker">LABORATÓRIO DE PRÁTICA · ${levelKey.toUpperCase()}</span>
            <h2 id="cultureSkillTitle">${isBeginner ? "Vamos praticar passo a passo." : "Agora é sua vez."}</h2>
            <p>${isBeginner ? "Ouça, leia a tradução e escolha a frase certa. Você pode usar as dicas e tentar quantas vezes precisar." : "Pratique sem alternativas: ouça, escreva de memória ou fale em japonês."}</p>
          </div>
          <span class="culture-skill-mark" lang="ja" aria-hidden="true">声</span>
        </div>
        <div class="culture-skill-modes" role="group" aria-label="Modo de prática JLPT">
          <button type="button" class="culture-skill-mode active" aria-pressed="true" data-skill-mode="listen"><span>01</span><strong>${isBeginner ? "Escutar & escolher" : "Escutar & escrever"}</strong><small>${isBeginner ? "Reconheça a frase" : "Ditado japonês"}</small></button>
          <button type="button" class="culture-skill-mode" aria-pressed="false" data-skill-mode="write"><span>02</span><strong>${isBeginner ? "Encontrar a frase" : "Escrever de memória"}</strong><small>Português → japonês</small></button>
          <button type="button" class="culture-skill-mode" aria-pressed="false" data-skill-mode="speak"><span>03</span><strong>${isBeginner ? "Falar ou escolher" : "Falar em voz alta"}</strong><small>${isBeginner ? "Experimente no seu ritmo" : "Pronúncia reconhecida"}</small></button>
        </div>
        <div class="culture-skill-exercise">
          <div class="culture-skill-topline"><span id="cultureSkillCategory">GRAMÁTICA · JLPT ${levelKey.toUpperCase()}</span><span id="cultureSkillCounter">1 / 6</span></div>
          <div class="culture-skill-progress" role="progressbar" aria-label="Progresso da prática" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0"><span id="cultureSkillProgress"></span></div>
          <div id="cultureSkillPrompt" class="culture-skill-prompt" aria-live="polite"></div>
          <div id="cultureSkillChoices" class="culture-skill-choices" role="group" aria-label="Escolha uma resposta" hidden></div>
          <div class="culture-skill-tools"><button type="button" class="culture-skill-tool" data-skill-action="play">🔊 Ouvir novamente</button><button type="button" class="culture-skill-tool" data-skill-action="hint">💡 Ver dica</button><span id="cultureSkillHint" hidden></span></div>
          <form id="cultureSkillForm" class="culture-skill-form">
            <label id="cultureSkillLabel" for="cultureSkillInput">Escreva o que ouviu em japonês</label>
            <div class="culture-skill-input-row"><input id="cultureSkillInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite em japonês" required><button type="submit" class="culture-skill-submit">Conferir</button></div>
          </form>
          <div class="culture-speech-fallback" id="cultureSpeechFallback" hidden></div>
          <button type="button" class="culture-speech-button" id="cultureSpeechButton" data-skill-action="speak" hidden>🎙️ Começar a falar</button>
          <p id="cultureSkillFeedback" class="culture-skill-feedback" aria-live="polite"></p>
          <div class="culture-skill-actions"><button type="button" id="cultureSkillReveal" class="culture-skill-reveal" data-skill-action="answer">Mostrar resposta</button><button type="button" id="cultureSkillNext" class="culture-skill-next" data-skill-action="next" hidden>Próximo exercício →</button></div>
          <div id="cultureSkillResult" class="culture-skill-result" hidden><span lang="ja">よくできました</span><h3>Prática concluída</h3><p id="cultureSkillFinalScore"></p><button type="button" class="culture-skill-next" data-skill-action="restart">Treinar novamente</button></div>
        </div>
      </section>
    `;
  }

  buildCultureSkillQuestions(levelKey) {
    const level = ADVANCED_DATA.jlpt[levelKey];
    const grammar = level.grammar.map(item => ({
      category: "GRAMÁTICA",
      japanese: item.exampleJp,
      portuguese: item.examplePt,
      romaji: item.exampleRomaji,
      title: item.pattern,
      answerChoices: level.grammar.map(candidate => candidate.exampleJp)
    }));
    const vocab = level.vocab.map(item => ({
      category: "VOCABULÁRIO",
      japanese: item.jp,
      portuguese: item.pt,
      romaji: item.romaji,
      title: item.jp,
      answerChoices: level.vocab.map(candidate => candidate.jp)
    }));
    const roundSize = levelKey === "n5" ? 5 : levelKey === "n4" ? 6 : 8;
    const distractorCount = levelKey === "n5" ? 2 : 3;
    return this.shuffleCultureItems([...grammar, ...vocab])
      .slice(0, roundSize)
      .map(question => ({
        ...question,
        options: this.shuffleCultureItems([
          question.japanese,
          ...this.shuffleCultureItems(question.answerChoices.filter(answer => answer !== question.japanese)).slice(0, distractorCount)
        ])
      }));
  }

  startCultureSkillPractice() {
    this.stopCultureSpeechRecognition();
    this.cultureSkillRounds = this.buildCultureSkillQuestions(this.cultureJlptLevel);
    this.cultureSkillIndex = 0;
    this.cultureSkillScore = 0;
    this.cultureSkillAnswered = false;
    this.renderCultureSkillQuestion();
    if (this.cultureSkillMode === "listen") this.speakCultureSkillAnswer();
  }

  setCultureSkillMode(mode) {
    if (!["listen", "write", "speak"].includes(mode)) return;
    this.stopCultureSpeechRecognition();
    this.cultureSkillMode = mode;
    document.querySelectorAll("[data-skill-mode]").forEach(button => {
      const selected = button.dataset.skillMode === mode;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    this.renderCultureSkillQuestion();
    if (mode === "listen") this.speakCultureSkillAnswer();
  }

  renderCultureSkillQuestion() {
    const question = this.cultureSkillRounds[this.cultureSkillIndex];
    if (!question) return;
    this.cultureSkillAnswered = false;
    const isListen = this.cultureSkillMode === "listen";
    const isSpeak = this.cultureSkillMode === "speak";
    const isBeginner = ["n5", "n4"].includes(this.cultureJlptLevel);
    document.querySelectorAll("#cultureJlptContent [data-skill-mode]").forEach(button => {
      const selected = button.dataset.skillMode === this.cultureSkillMode;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.getElementById("cultureSkillCategory").textContent =
      `${question.category} · JLPT ${this.cultureJlptLevel.toUpperCase()}`;
    document.getElementById("cultureSkillCounter").textContent =
      `${this.cultureSkillIndex + 1} / ${this.cultureSkillRounds.length}`;
    document.querySelector(".culture-skill-progress").setAttribute("aria-valuemax", String(this.cultureSkillRounds.length));
    document.getElementById("cultureSkillProgress").style.width =
      `${(this.cultureSkillIndex / this.cultureSkillRounds.length) * 100}%`;
    document.querySelector(".culture-skill-progress").setAttribute("aria-valuenow", String(this.cultureSkillIndex));

    const prompt = document.getElementById("cultureSkillPrompt");
    prompt.hidden = false;
    prompt.replaceChildren();
    const promptLabel = document.createElement("span");
    promptLabel.className = "culture-skill-prompt-label";
    promptLabel.textContent = isListen ? "OUÇA COM ATENÇÃO" : isSpeak ? "FALE EM JAPONÊS" : "PASSE PARA O JAPONÊS";
    const promptText = document.createElement("strong");
    promptText.textContent = isListen ? "Qual frase você ouviu?" : question.portuguese;
    prompt.append(promptLabel, promptText);

    const choices = document.getElementById("cultureSkillChoices");
    choices.replaceChildren();
    choices.hidden = !isBeginner;
    if (isBeginner) {
      question.options.forEach((option, index) => {
        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "culture-skill-choice";
        choice.dataset.skillChoice = option;
        const letter = document.createElement("span");
        letter.textContent = String.fromCharCode(65 + index);
        const answer = document.createElement("strong");
        answer.textContent = option;
        choice.append(letter, answer);
        choices.append(choice);
      });
    }
    const input = document.getElementById("cultureSkillInput");
    input.value = "";
    input.disabled = false;
    input.placeholder = "Digite em japonês";
    document.getElementById("cultureSkillLabel").textContent =
      isListen ? "Escreva o que ouviu em japonês" : "Sua resposta em japonês";
    document.getElementById("cultureSkillHint").hidden = !isBeginner;
    document.getElementById("cultureSkillHint").textContent = `Leitura: ${question.romaji}`;
    const feedback = document.getElementById("cultureSkillFeedback");
    feedback.hidden = false;
    feedback.textContent = "";
    feedback.className = "culture-skill-feedback";
    document.getElementById("cultureSkillNext").hidden = true;
    document.getElementById("cultureSkillReveal").hidden = false;
    document.getElementById("cultureSkillResult").hidden = true;
    document.getElementById("cultureSkillForm").hidden = isBeginner && !isSpeak;
    document.querySelector(".culture-skill-tools").hidden = false;
    document.querySelector(".culture-skill-actions").hidden = false;
    document.getElementById("cultureSpeechButton").hidden = !isSpeak;
    const fallback = document.getElementById("cultureSpeechFallback");
    fallback.hidden = !isSpeak;
    if (isSpeak) {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      fallback.textContent = Recognition
        ? (isBeginner
          ? "Tente falar a frase ou escolha uma opção abaixo."
          : "Fale a frase em japonês ou digite sua tentativa abaixo.")
        : (isBeginner
          ? "O reconhecimento de voz não está disponível. Você pode ler em voz alta e escolher uma opção abaixo."
          : "O reconhecimento de voz não está disponível neste navegador. Leia a frase em voz alta e digite sua tentativa abaixo.");
      input.placeholder = "Digite sua tentativa, se preferir";
    }
  }

  normalizeCultureSkillAnswer(answer) {
    return answer.toLowerCase().replace(/[\s。、！？!?.,，．「」『』]/g, "");
  }

  speakCultureSkillAnswer() {
    const question = this.cultureSkillRounds[this.cultureSkillIndex];
    if (!question) return;
    if (!("speechSynthesis" in window)) {
      document.getElementById("cultureSkillFeedback").textContent = "A reprodução de áudio não está disponível neste navegador.";
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.japanese);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    const japaneseVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.startsWith("ja"));
    if (japaneseVoice) utterance.voice = japaneseVoice;
    window.speechSynthesis.speak(utterance);
  }

  checkCultureSkillAnswer(answer) {
    if (this.cultureSkillAnswered || !answer.trim()) return;
    const question = this.cultureSkillRounds[this.cultureSkillIndex];
    const correct = this.normalizeCultureSkillAnswer(answer) ===
      this.normalizeCultureSkillAnswer(question.japanese);
    this.cultureSkillAnswered = true;
    if (correct) this.cultureSkillScore++;
    const feedback = document.getElementById("cultureSkillFeedback");
    feedback.className = `culture-skill-feedback ${correct ? "is-correct" : "is-incorrect"}`;
    feedback.textContent = correct
      ? "Isso mesmo! Você reconheceu a frase."
      : `Quase. A resposta esperada é: ${question.japanese}`;
    document.getElementById("cultureSkillInput").disabled = true;
    document.querySelectorAll("#cultureSkillChoices [data-skill-choice]").forEach(button => {
      button.disabled = true;
      if (button.dataset.skillChoice === question.japanese) button.classList.add("is-correct");
    });
    document.getElementById("cultureSkillReveal").hidden = true;
    document.getElementById("cultureSkillNext").hidden = false;
    document.getElementById("cultureSkillProgress").style.width =
      `${((this.cultureSkillIndex + 1) / this.cultureSkillRounds.length) * 100}%`;
    document.querySelector(".culture-skill-progress").setAttribute("aria-valuenow", String(this.cultureSkillIndex + 1));
    this.stopCultureSpeechRecognition();
  }

  handleCultureSkillChoice(button) {
    if (this.cultureSkillAnswered || button.disabled) return;
    const question = this.cultureSkillRounds[this.cultureSkillIndex];
    if (this.normalizeCultureSkillAnswer(button.dataset.skillChoice) ===
        this.normalizeCultureSkillAnswer(question.japanese)) {
      this.checkCultureSkillAnswer(button.dataset.skillChoice);
      return;
    }
    button.disabled = true;
    button.classList.add("is-incorrect");
    const feedback = document.getElementById("cultureSkillFeedback");
    feedback.className = "culture-skill-feedback is-incorrect";
    feedback.textContent = "Ainda não — tente outra opção. Você consegue!";
  }

  handleCultureSkillAction(action) {
    if (action === "play") {
      this.speakCultureSkillAnswer();
    } else if (action === "hint") {
      document.getElementById("cultureSkillHint").hidden = false;
    } else if (action === "answer") {
      if (!this.cultureSkillAnswered) {
        this.cultureSkillAnswered = true;
        document.getElementById("cultureSkillInput").disabled = true;
        document.getElementById("cultureSkillReveal").hidden = true;
        document.getElementById("cultureSkillNext").hidden = false;
        document.querySelectorAll("#cultureSkillChoices [data-skill-choice]").forEach(button => {
          button.disabled = true;
          if (button.dataset.skillChoice === this.cultureSkillRounds[this.cultureSkillIndex].japanese) {
            button.classList.add("is-correct");
          }
        });
        const feedback = document.getElementById("cultureSkillFeedback");
        feedback.className = "culture-skill-feedback";
        feedback.textContent = `Resposta: ${this.cultureSkillRounds[this.cultureSkillIndex].japanese}`;
      }
    } else if (action === "next") {
      this.cultureSkillIndex++;
      if (this.cultureSkillIndex >= this.cultureSkillRounds.length) {
        this.finishCultureSkillPractice();
      } else {
        this.renderCultureSkillQuestion();
        if (this.cultureSkillMode === "listen") this.speakCultureSkillAnswer();
      }
    } else if (action === "restart") {
      this.startCultureSkillPractice();
    } else if (action === "speak") {
      this.startCultureSpeechRecognition();
    }
  }

  startCultureSpeechRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    this.stopCultureSpeechRecognition();
    const button = document.getElementById("cultureSpeechButton");
    const feedback = document.getElementById("cultureSkillFeedback");
    const recognition = new Recognition();
    this.cultureSkillRecognition = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    button.disabled = true;
    button.textContent = "🎙️ Ouvindo...";
    feedback.textContent = "Fale a frase em japonês.";
    recognition.onresult = event => {
      const spoken = event.results[0][0].transcript;
      document.getElementById("cultureSkillInput").value = spoken;
      this.checkCultureSkillAnswer(spoken);
    };
    recognition.onerror = event => {
      feedback.className = "culture-skill-feedback is-incorrect";
      feedback.textContent = event.error === "not-allowed"
        ? "Permissão do microfone negada. Você ainda pode digitar sua resposta."
        : "Não foi possível reconhecer a fala. Tente novamente ou digite sua resposta.";
    };
    recognition.onend = () => {
      this.cultureSkillRecognition = null;
      button.disabled = false;
      button.textContent = "🎙️ Tentar falar novamente";
    };
    try {
      recognition.start();
    } catch (error) {
      this.cultureSkillRecognition = null;
      button.disabled = false;
      button.textContent = "🎙️ Tentar falar novamente";
      feedback.className = "culture-skill-feedback is-incorrect";
      feedback.textContent = "O microfone não pôde ser iniciado. Digite sua resposta para continuar.";
    }
  }

  stopCultureSpeechRecognition() {
    if (!this.cultureSkillRecognition) return;
    this.cultureSkillRecognition.onresult = null;
    this.cultureSkillRecognition.onerror = null;
    this.cultureSkillRecognition.onend = null;
    this.cultureSkillRecognition.stop();
    this.cultureSkillRecognition = null;
    const button = document.getElementById("cultureSpeechButton");
    if (button) {
      button.disabled = false;
      button.textContent = "🎙️ Começar a falar";
    }
  }

  finishCultureSkillPractice() {
    this.stopCultureSpeechRecognition();
    document.getElementById("cultureSkillPrompt").hidden = true;
    document.getElementById("cultureSkillChoices").hidden = true;
    document.querySelector(".culture-skill-tools").hidden = true;
    document.getElementById("cultureSkillForm").hidden = true;
    document.getElementById("cultureSpeechFallback").hidden = true;
    document.getElementById("cultureSpeechButton").hidden = true;
    document.getElementById("cultureSkillFeedback").hidden = true;
    document.querySelector(".culture-skill-actions").hidden = true;
    document.getElementById("cultureSkillCounter").textContent =
      `${this.cultureSkillRounds.length} / ${this.cultureSkillRounds.length}`;
    document.getElementById("cultureSkillProgress").style.width = "100%";
    document.querySelector(".culture-skill-progress").setAttribute("aria-valuenow", String(this.cultureSkillRounds.length));
    document.getElementById("cultureSkillResult").hidden = false;
    document.getElementById("cultureSkillFinalScore").textContent =
      `Você acertou ${this.cultureSkillScore} de ${this.cultureSkillRounds.length}. Continue praticando para fixar as frases!`;
  }

  shuffleCultureItems(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  buildCultureQuestionPool(levelKeys, questionType) {
    const questions = [];
    levelKeys.forEach(levelKey => {
      const level = ADVANCED_DATA.jlpt[levelKey];
      ["grammar", "kanji", "vocab"].filter(type => questionType === "mixed" || questionType === type).forEach(type => {
        const items = level[type];
        items.forEach(item => {
          const values = items.map(candidate => {
            if (type === "grammar") return candidate.meaning;
            if (type === "kanji") return candidate.meaning;
            return candidate.pt;
          }).filter((value, index, collection) => value && collection.indexOf(value) === index);
          const answer = type === "grammar" ? item.meaning : type === "kanji" ? item.meaning : item.pt;
          const distractors = this.shuffleCultureItems(values.filter(value => value !== answer)).slice(0, 3);
          if (distractors.length < 3) return;

          let prompt;
          let detail;
          if (type === "grammar") {
            prompt = item.pattern;
            detail = `${item.exampleJp} · ${item.examplePt}`;
          } else if (type === "kanji") {
            prompt = item.char;
            detail = `On: ${item.onyomi} · Kun: ${item.kunyomi} · Ex.: ${item.example}`;
          } else {
            prompt = item.jp;
            detail = `${item.romaji} · Qual é o significado?`;
          }

          questions.push({
            level: levelKey.toUpperCase(),
            category: type === "grammar" ? "GRAMÁTICA" : type === "kanji" ? "KANJI" : "VOCABULÁRIO",
            prompt,
            detail,
            answer,
            explanation: type === "grammar"
              ? `${item.pattern}: ${item.explanation}`
              : type === "kanji"
                ? `${item.char} significa “${item.meaning}”. Leituras e exemplo: ${item.onyomi} · ${item.kunyomi} · ${item.example}.`
                : `${item.jp} (${item.romaji}) significa “${item.pt}”.`,
            options: this.shuffleCultureItems([answer, ...distractors])
          });
        });
      });
    });
    return questions;
  }

  startCultureQuiz() {
    const levelSelect = document.getElementById("cultureActivityLevel");
    this.cultureQuizLevel = levelSelect?.value || this.cultureQuizLevel || "all";
    const levelKeys = this.cultureQuizLevel === "all"
      ? ["n5", "n4", "n3", "n2", "n1"]
      : [this.cultureQuizLevel];
    const questionPool = this.buildCultureQuestionPool(levelKeys, this.cultureQuizType);
    if (questionPool.length === 0) {
      throw new Error("Não há perguntas suficientes para esta atividade JLPT.");
    }

    this.cultureQuizRounds = this.shuffleCultureItems(questionPool).slice(0, 10);
    this.cultureQuizIndex = 0;
    this.cultureQuizScore = 0;
    this.cultureQuizLocked = false;
    document.getElementById("cultureQuestion").hidden = false;
    document.getElementById("cultureAnswerOptions").hidden = false;
    document.getElementById("cultureQuizFeedback").textContent = "";
    document.getElementById("cultureQuizNext").hidden = true;
    document.getElementById("cultureQuizResult").hidden = true;
    this.renderCultureQuizQuestion();
  }

  renderCultureQuizQuestion() {
    const question = this.cultureQuizRounds[this.cultureQuizIndex];
    if (!question) return;

    const prompt = document.getElementById("cultureQuestion");
    prompt.replaceChildren();
    const category = document.createElement("span");
    category.className = "culture-question-category";
    category.textContent = `JLPT ${question.level} · ${question.category}`;
    const title = document.createElement("strong");
    title.className = "culture-question-prompt";
    title.textContent = question.prompt;
    if (question.category === "KANJI" || question.category === "VOCABULÁRIO") title.lang = "ja";
    const detail = document.createElement("span");
    detail.className = "culture-question-detail";
    detail.textContent = question.detail;
    prompt.append(category, title, detail);

    document.getElementById("cultureQuizCounter").textContent = `${this.cultureQuizIndex + 1} / ${this.cultureQuizRounds.length}`;
    const progress = (this.cultureQuizIndex / this.cultureQuizRounds.length) * 100;
    document.getElementById("cultureQuizProgress").style.width = `${progress}%`;
    document.querySelector(".culture-quiz-progress").setAttribute("aria-valuenow", String(this.cultureQuizIndex));
    const feedback = document.getElementById("cultureQuizFeedback");
    feedback.textContent = "";
    feedback.className = "culture-quiz-feedback";
    const options = document.getElementById("cultureAnswerOptions");
    options.replaceChildren();
    question.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "culture-answer-option";
      button.textContent = option;
      button.addEventListener("click", () => this.checkCultureQuizAnswer(option));
      options.appendChild(button);
    });
    this.cultureQuizLocked = false;
  }

  checkCultureQuizAnswer(answer) {
    if (this.cultureQuizLocked) return;
    this.cultureQuizLocked = true;
    const question = this.cultureQuizRounds[this.cultureQuizIndex];
    const isCorrect = answer === question.answer;
    if (isCorrect) this.cultureQuizScore++;

    document.querySelectorAll(".culture-answer-option").forEach(button => {
      button.disabled = true;
      if (button.textContent === question.answer) button.classList.add("is-correct");
      else if (button.textContent === answer) button.classList.add("is-incorrect");
    });
    const feedback = document.getElementById("cultureQuizFeedback");
    feedback.textContent = `${isCorrect ? "Correto!" : `A resposta é: ${question.answer}.`} ${question.explanation}`;
    feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    document.getElementById("cultureQuizNext").hidden = false;
    document.getElementById("cultureQuizNext").textContent =
      this.cultureQuizIndex + 1 === this.cultureQuizRounds.length ? "Ver resultado →" : "Próxima pergunta →";
  }

  nextCultureQuizQuestion() {
    this.cultureQuizIndex++;
    if (this.cultureQuizIndex >= this.cultureQuizRounds.length) {
      this.finishCultureQuiz();
      return;
    }
    this.renderCultureQuizQuestion();
  }

  finishCultureQuiz() {
    const levelState = this.getCultureStudyLevelState(this.cultureQuizLevel === "all" ? this.cultureJlptLevel : this.cultureQuizLevel);
    if (this.cultureQuizScore > levelState.bestScore) {
      this.cultureStudyProgress.xp += (this.cultureQuizScore - levelState.bestScore) * 10;
      levelState.bestScore = this.cultureQuizScore;
      this.saveCultureStudyProgress();
      this.renderCultureStudyDashboard();
    }
    const progress = document.getElementById("cultureQuizProgress");
    progress.style.width = "100%";
    document.querySelector(".culture-quiz-progress").setAttribute("aria-valuenow", String(this.cultureQuizRounds.length));
    document.getElementById("cultureQuizCounter").textContent = `${this.cultureQuizRounds.length} / ${this.cultureQuizRounds.length}`;
    document.getElementById("cultureQuestion").hidden = true;
    document.getElementById("cultureAnswerOptions").hidden = true;
    document.getElementById("cultureQuizFeedback").textContent = "";
    document.getElementById("cultureQuizNext").hidden = true;
    document.getElementById("cultureQuizFinalScore").textContent =
      `Você acertou ${this.cultureQuizScore} de ${this.cultureQuizRounds.length} questões.`;
    document.getElementById("cultureQuizResult").hidden = false;
  }

  /**
   * Renderiza a Seção de Provérbios de 4 Kanjis (Yojijukugo)
   */
  renderYojijukugo() {
    const container = document.getElementById("yojijukugoGrid");
    if (!container) return;

    container.innerHTML = ADVANCED_DATA.yojijukugo.map(item => `
      <div class="yojijukugo-card" onclick="(window.app || window.japaneseApp).speakJapanese('${item.kanji}')" title="Clique para ouvir o provérbio">
        <div class="yoji-header">
          <span class="yoji-badge">${item.badge}</span>
          <span class="yoji-audio-pill">🔊 Ouvir</span>
        </div>
        <div class="yoji-kanji-display">${item.kanji}</div>
        <div class="yoji-reading">${item.reading}</div>
        <div class="yoji-meaning">"${item.meaning}"</div>
        <p class="yoji-explanation">${item.explanation}</p>
        <div class="yoji-footer">
          <span class="yoji-theme-tag">🏷️ ${item.theme}</span>
        </div>
      </div>
    `).join("");
  }

  /**
   * Renderiza o Guia de Gírias de Anime vs Japonês Real
   */
  renderSlangGuide() {
    const pronounContainer = document.getElementById("slangPronounsContainer");
    const contractionsContainer = document.getElementById("slangContractionsContainer");

    if (pronounContainer) {
      pronounContainer.innerHTML = ADVANCED_DATA.animeVsRealLife.pronouns.map(p => `
        <div class="slang-compare-card">
          <div class="sc-pronoun-tag">${p.pronoun}</div>
          <div class="sc-body">
            <div class="sc-row">
              <span class="sc-label anime-lbl">📺 Como é no Anime:</span>
              <p class="sc-text">${p.usageAnime}</p>
            </div>
            <div class="sc-row">
              <span class="sc-label real-lbl">🇯🇵 Como é na Vida Real no Japão:</span>
              <p class="sc-text">${p.reality}</p>
            </div>
          </div>
        </div>
      `).join("");
    }

    if (contractionsContainer) {
      contractionsContainer.innerHTML = ADVANCED_DATA.animeVsRealLife.contractions.map(c => `
        <div class="slang-contract-card">
          <div class="sc-header">
            <span class="sc-casual">${c.casual}</span>
            <span class="sc-arrow">➔</span>
            <span class="sc-standard">${c.standard}</span>
          </div>
          <div class="sc-example" onclick="(window.app || window.japaneseApp).speakJapanese('${c.example.split('➔')[0].trim()}')">
            <strong>Exemplo:</strong> ${c.example} 🔊
          </div>
          <p class="sc-note">${c.note}</p>
        </div>
      `).join("");
    }
  }
}

// Inicializar e disponibilizar globalmente
window.japaneseAdvanced = new JapaneseAdvancedController();

document.addEventListener("DOMContentLoaded", () => {
  window.japaneseAdvanced.init();
});
