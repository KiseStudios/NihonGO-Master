/**
 * ==========================================================================
 * MÓDULO AVANÇADO: JLPT N5 AO N1 & ANIME IMMERSION STUDIO (EXPANDIDO)
 * ==========================================================================
 * Conteúdo de alta densidade para estudantes intermediários e avançados:
 * - 40 Gramáticas Oficiais JLPT (8 por nível: N5, N4, N3, N2, N1) com áudios e fórmulas
 * - 40 Kanjis Notáveis estruturados com leituras On'yomi, Kun'yomi e Jukugo
 * - 40 Vocabulários essenciais com áudio instantâneo
 * - 16 Cenas e Falas Icônicas de Anime com Player Cinematográfico 16:9,
 *   Áudio calibrado, Modo Shadowing, Legendas Karaokê e Links Oficiais Diretos
 * - Provérbios de 4 Kanjis (Yojijukugo - 四字熟語) com pronúncia e significado
 * - Guia comparativo de Gírias de Anime vs. Japonês Real
 */

const ADVANCED_DATA = {
  // 1. Dados Estruturados por Nível JLPT (N5 ao N1) - 8 Gramáticas, 8 Kanjis e 8 Vocabs cada
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
        { char: "人", onyomi: "JIN, NIN", kunyomi: "hito", meaning: "Pessoa", example: "日本人 (nihonjin - japonês)" }
      ],
      vocab: [
        { jp: "毎日", romaji: "mainichi", pt: "todos os dias" },
        { jp: "友達", romaji: "tomodachi", pt: "amigo(a)" },
        { jp: "勉強", romaji: "benkyō", pt: "estudo" },
        { jp: "大丈夫", romaji: "daijōbu", pt: "tudo bem / sem problemas" },
        { jp: "時間", romaji: "jikan", pt: "tempo / hora" },
        { jp: "家族", romaji: "kazoku", pt: "família" },
        { jp: "学校", romaji: "gakkō", pt: "escola" },
        { jp: "天気", romaji: "tenki", pt: "clima / tempo meteorológico" }
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
        { char: "言", onyomi: "GEN, GON", kunyomi: "i-u, koto", meaning: "Dizer, Palavra", example: "言葉 (kotoba - palavra/idioma)" }
      ],
      vocab: [
        { jp: "約束", romaji: "yakusoku", pt: "promessa / compromisso" },
        { jp: "準備", romaji: "junbi", pt: "preparação" },
        { jp: "経験", romaji: "keiken", pt: "experiência" },
        { jp: "複雑", romaji: "fukuzatsu", pt: "complexo" },
        { jp: "都合", romaji: "tsugō", pt: "conveniência / disponibilidade de horário" },
        { jp: "連絡", romaji: "renraku", pt: "contato / comunicação" },
        { jp: "案内", romaji: "annai", pt: "guia / orientação" },
        { jp: "遠慮", romaji: "enryo", pt: "hesitação / reserva social" }
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
        { char: "感", onyomi: "KAN", kunyomi: "-", meaning: "Sentimento, Sensação", example: "感情 (kanjō - emoção)" }
      ],
      vocab: [
        { jp: "限界", romaji: "genkai", pt: "limite / fronteira" },
        { jp: "覚悟", romaji: "kakugo", pt: "determinação / prontidão psicológica" },
        { jp: "仲間", romaji: "nakama", pt: "companheiro de equipe / aliado" },
        { jp: "真実", romaji: "shinjitsu", pt: "verdade" },
        { jp: "絶望", romaji: "zetsubō", pt: "desespero profundo" },
        { jp: "希望", romaji: "kibō", pt: "esperança" },
        { jp: "挑戦", romaji: "chōsen", pt: "desafio" },
        { jp: "信頼", romaji: "shinrai", pt: "confiança mútua" }
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
        { char: "統", onyomi: "TŌ", kunyomi: "su-beru", meaning: "Unificar, Governar", example: "統一 (tōitsu - unificação)" }
      ],
      vocab: [
        { jp: "矛盾", romaji: "mujun", pt: "contradição" },
        { jp: "必然", romaji: "hitsuzen", pt: "inevitável / inevitabilidade" },
        { jp: "展開", romaji: "tenkai", pt: "desdobramento / desenvolvimento" },
        { jp: "圧倒的", romaji: "attōteki", pt: "esmagador / avassalador" },
        { jp: "主観的", romaji: "shukanteki", pt: "subjetivo" },
        { jp: "客観的", romaji: "kyakkanteki", pt: "objetivo / imparcial" },
        { jp: "潜在能力", romaji: "senzai nōryoku", pt: "potencial latente" },
        { jp: "葛藤", romaji: "kattō", pt: "conflito interno / dilema" }
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
        { char: "滅", onyomi: "METSU", kunyomi: "horo-biru", meaning: "Destruir, Perecer", example: "鬼滅 (kimetsu - extermínio de demônios)" }
      ],
      vocab: [
        { jp: "刹那", romaji: "setsuna", pt: "instante efêmero / fração de segundo" },
        { jp: "森羅万象", romaji: "shinrabanshō", pt: "todas as coisas do universo / criação inteira" },
        { jp: "宿命", romaji: "shukumei", pt: "destino imutável" },
        { jp: "虚無", romaji: "kyomu", pt: "o nada absoluto / niilismo" },
        { jp: "泰然自若", romaji: "taizenjijaku", pt: "imperturbável e sereno perante a tempestade" },
        { jp: "深淵", romaji: "shin'en", pt: "abismo profundo" },
        { jp: "一網打尽", romaji: "ichimōdajin", pt: "captura ou aniquilação total de uma só vez" },
        { jp: "百戦錬磨", romaji: "hyaksenrenma", pt: "veterano forjado em incontáveis batalhas" }
      ]
    }
  },

  // 2. Acervo de 16 Cenas e Falas de Anime com Áudio, Vídeo e Análise
  animeScenes: [
    {
      id: "gojo-domain",
      anime: "Jujutsu Kaisen",
      character: "Satoru Gojo (五条 悟)",
      role: "O Feiticeiro Mais Forte",
      animeEmoji: "🔮",
      themeColor: "#8b5cf6",
      level: "N2",
      badgeText: "N2 / Vocabulário Místico",
      japanese: "領域展開...「無量空処」。何もしなくていいんだよ。",
      furigana: "りょういきてんかい...「むりょうくうしょ」。なにもしなくていいんだよ。",
      romaji: "Ryōiki Tenkai... 'Muryōkūsho'. Nanimo shinakute ii n da yo.",
      portuguese: "Expansão de Domínio... 'Vazio Ilimitado'. Você não precisa fazer absolutamente nada.",
      context: "Momento lendário em que Gojo remove a venda e expande seu Domínio contra Jogo, inundando sua mente com informações infinitas.",
      youtubeEmbedId: "b8y48kO7f0U",
      videoPosterBg: "radial-gradient(circle at center, #3b0764 0%, #0f172a 100%)",
      voicePitch: 0.95,
      voiceRate: 0.82,
      words: [
        { jp: "領域展開", romaji: "Ryōiki Tenkai", pt: "Expansão de Domínio (N2)" },
        { jp: "無量空処", romaji: "Muryōkūsho", pt: "Vazio Ilimitado (Termo budista N1)" },
        { jp: "何もしなくていい", romaji: "nanimo shinakute ii", pt: "Não precisa fazer nada (N4 〜なくていい)" },
        { jp: "んだよ", romaji: "n da yo", pt: "ênfase explicativa relaxada" }
      ],
      grammarNotes: [
        "領域展開 (Ryōiki Tenkai): 領域 (domínio - N2) + 展開 (expansão - N2).",
        "無量空処 (Muryōkūsho): Reino do espaço infinito imaterial na cosmologia budista.",
        "〜なくていい (nakute ii): Estrutura do N4 que indica ausência de obrigação.",
        "んだよ (n da yo): のだ + よ, transmitindo um tom sereno de superioridade absoluta."
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
  }

  init() {
    this.renderAnimeScenes();
    this.renderJlptLevel(this.currentJlptLevel);
    this.renderYojijukugo();
    this.renderSlangGuide();
    this.attachEvents();
  }

  attachEvents() {
    // Alternância de Abas Internas
    document.querySelectorAll(".adv-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

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

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll(".adv-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });

    document.querySelectorAll(".adv-tab-content").forEach(panel => {
      panel.style.display = panel.id === `adv-tab-${tabName}` ? "block" : "none";
    });
  }

  switchJlptLevel(levelKey) {
    this.currentJlptLevel = levelKey;
    document.querySelectorAll(".jlpt-level-pill").forEach(pill => {
      pill.classList.toggle("active", pill.getAttribute("data-level") === levelKey);
    });
    this.renderJlptLevel(levelKey);
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

          <!-- Janela do Player de Áudio & Shadowing Cinematográfico -->
          <div class="scene-audio-card-frame" style="background: ${scene.videoPosterBg};">
            <div class="scene-cine-overlay">
              <span class="scene-cinematic-badge">🎙️ ESTÚDIO DE ÁUDIO & SHADOWING</span>
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
            <div class="scene-trans-label">🇧🇷 Significado em Português:</div>
            <div class="scene-trans-text">"${scene.portuguese}"</div>
          </div>

          <!-- Contexto da Cena -->
          <div class="scene-context-note">
            <strong>Contexto na Obra:</strong> ${scene.context}
          </div>

          <!-- Decomposição Gramatical JLPT Accordion -->
          <div class="scene-grammar-accordion">
            <details>
              <summary class="scene-grammar-summary">
                <span>📚 Decomposição Gramatical & Vocabulário JLPT</span>
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
  renderJlptLevel(levelKey) {
    const levelData = ADVANCED_DATA.jlpt[levelKey];
    const container = document.getElementById("jlptLevelContent");
    if (!levelData || !container) return;

    container.innerHTML = `
      <!-- Banner de Visão Geral do Nível -->
      <div class="jlpt-overview-banner" style="border-left: 5px solid ${levelData.color};">
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

      <!-- Seção 1: Gramáticas-Chave do Nível (8 Gramáticas Completas) -->
      <div class="jlpt-content-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 class="jlpt-sec-title" style="margin-bottom: 0;">📖 8 Gramáticas Fundamentais do ${levelKey.toUpperCase()}</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Toque em qualquer exemplo para ouvir a pronúncia 🔊</span>
        </div>
        <div class="jlpt-grammar-cards-grid">
          ${levelData.grammar.map(g => `
            <div class="jlpt-grammar-card">
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

      <!-- Seção 2: Kanjis Notáveis do Nível (8 Kanjis) -->
      <div class="jlpt-content-section" style="margin-top: 2.5rem;">
        <h3 class="jlpt-sec-title">🈴 8 Kanjis Notáveis do ${levelKey.toUpperCase()}</h3>
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

      <!-- Seção 3: Vocabulário Selecionado com Áudio (8 Palavras) -->
      <div class="jlpt-content-section" style="margin-top: 2.5rem;">
        <h3 class="jlpt-sec-title">💡 Vocabulário & Expressões Típicas do ${levelKey.toUpperCase()}</h3>
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
    `;
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
