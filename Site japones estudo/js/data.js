/**
 * Base de Dados Completa para o Estudo de Japonês
 * Contém Hiragana, Katakana, Kanji N5/N4 e Vocabulário Essencial
 */

const JAPANESE_DATA = {
  hiragana: {
    basic: [
      { char: "あ", romaji: "a", example: "あめ (ame - chuva)", strokes: 3 },
      { char: "い", romaji: "i", example: "いぬ (inu - cachorro)", strokes: 2 },
      { char: "う", romaji: "u", example: "うみ (umi - mar)", strokes: 2 },
      { char: "え", romaji: "e", example: "えき (eki - estação)", strokes: 2 },
      { char: "お", romaji: "o", example: "お茶 (ocha - chá)", strokes: 3 },

      { char: "か", romaji: "ka", example: "かさ (kasa - guarda-chuva)", strokes: 3 },
      { char: "き", romaji: "ki", example: "き (ki - árvore)", strokes: 4 },
      { char: "く", romaji: "ku", example: "くるま (kuruma - carro)", strokes: 1 },
      { char: "け", romaji: "ke", example: "けむし (kemushi - lagarta)", strokes: 3 },
      { char: "こ", romaji: "ko", example: "こども (kodomo - criança)", strokes: 2 },

      { char: "さ", romaji: "sa", example: "さくら (sakura - cerejeira)", strokes: 3 },
      { char: "し", romaji: "shi", example: "しろ (shiro - branco)", strokes: 1 },
      { char: "す", romaji: "su", example: "すし (sushi - sushi)", strokes: 2 },
      { char: "せ", romaji: "se", example: "せんせい (sensei - professor)", strokes: 3 },
      { char: "そ", romaji: "so", example: "そら (sora - céu)", strokes: 1 },

      { char: "た", romaji: "ta", example: "たまご (tamago - ovo)", strokes: 4 },
      { char: "ち", romaji: "chi", example: "ちず (chizu - mapa)", strokes: 2 },
      { char: "つ", romaji: "tsu", example: "つき (tsuki - lua)", strokes: 1 },
      { char: "て", romaji: "te", example: "て (te - mão)", strokes: 1 },
      { char: "と", romaji: "to", example: "とり (tori - pássaro)", strokes: 2 },

      { char: "な", romaji: "na", example: "なつ (natsu - verão)", strokes: 4 },
      { char: "に", romaji: "ni", example: "にほん (nihon - Japão)", strokes: 3 },
      { char: "ぬ", romaji: "nu", example: "ぬいぐるみ (nuigurumi - pelúcia)", strokes: 2 },
      { char: "ね", romaji: "ne", example: "ねこ (neko - gato)", strokes: 2 },
      { char: "の", romaji: "no", example: "のみもの (nomimono - bebida)", strokes: 1 },

      { char: "は", romaji: "ha", example: "はな (hana - flor)", strokes: 3 },
      { char: "ひ", romaji: "hi", example: "ひかり (hikari - luz)", strokes: 1 },
      { char: "ふ", romaji: "fu", example: "ふね (fune - navio)", strokes: 4 },
      { char: "へ", romaji: "he", example: "へや (heya - quarto)", strokes: 1 },
      { char: "ほ", romaji: "ho", example: "ほし (hoshi - estrela)", strokes: 4 },

      { char: "ま", romaji: "ma", example: "まち (machi - cidade)", strokes: 3 },
      { char: "み", romaji: "mi", example: "みず (mizu - água)", strokes: 2 },
      { char: "む", romaji: "mu", example: "むし (mushi - inseto)", strokes: 3 },
      { char: "め", romaji: "me", example: "め (me - olho)", strokes: 2 },
      { char: "も", romaji: "mo", example: "もり (mori - floresta)", strokes: 3 },

      { char: "や", romaji: "ya", example: "やま (yama - montanha)", strokes: 3 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "ゆ", romaji: "yu", example: "ゆき (yuki - neve)", strokes: 2 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "よ", romaji: "yo", example: "よる (yoru - noite)", strokes: 2 },

      { char: "ら", romaji: "ra", example: "らいおん (raion - leão)", strokes: 2 },
      { char: "り", romaji: "ri", example: "りんご (ringo - maçã)", strokes: 2 },
      { char: "る", romaji: "ru", example: "るす (rusu - ausente)", strokes: 1 },
      { char: "れ", romaji: "re", example: "れきし (rekishi - história)", strokes: 2 },
      { char: "ろ", romaji: "ro", example: "ろうそく (rousoku - vela)", strokes: 1 },

      { char: "わ", romaji: "wa", example: "わたし (watashi - eu)", strokes: 2 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "を", romaji: "wo (o)", example: "Partícula de objeto", strokes: 3 },

      { char: "ん", romaji: "n", example: "にほん (nihon - n final)", strokes: 1 }
    ],
    dakuon: [
      { char: "が", romaji: "ga", example: "がっこう (gakkou - escola)" },
      { char: "ぎ", romaji: "gi", example: "ぎんこう (ginkou - banco)" },
      { char: "ぐ", romaji: "gu", example: "ぐあい (guai - condição/saúde)" },
      { char: "げ", romaji: "ge", example: "げんき (genki - bem/saudável)" },
      { char: "ご", romaji: "go", example: "ごはん (gohan - arroz/refeição)" },

      { char: "ざ", romaji: "za", example: "ざっし (zasshi - revista)" },
      { char: "じ", romaji: "ji", example: "じかん (jikan - tempo)" },
      { char: "ず", romaji: "zu", example: "ずっと (zutto - sempre)" },
      { char: "ぜ", romaji: "ze", example: "ぜんぶ (zenbu - tudo)" },
      { char: "ぞ", romaji: "zo", example: "ぞう (zou - elefante)" },

      { char: "だ", romaji: "da", example: "だいがく (daigaku - universidade)" },
      { char: "ぢ", romaji: "ji (di)", example: "はなぢ (hanaji - sangramento nasal)" },
      { char: "づ", romaji: "zu (du)", example: "つづく (tsuzuku - continuar)" },
      { char: "で", romaji: "de", example: "でんわ (denwa - telefone)" },
      { char: "ど", romaji: "do", example: "どこ (doko - onde)" },

      { char: "ば", romaji: "ba", example: "ばしょ (basho - lugar)" },
      { char: "び", romaji: "bi", example: "びょういん (byouin - hospital)" },
      { char: "ぶ", romaji: "bu", example: "ぶた (buta - porco)" },
      { char: "べ", romaji: "be", example: "べんきょう (benkyou - estudo)" },
      { char: "ぼ", romaji: "bo", example: "ぼうし (boushi - chapéu)" },

      { char: "ぱ", romaji: "pa", example: "ぱちぱち (pachipachi - palmas)" },
      { char: "ぴ", romaji: "pi", example: "ぴかぴか (pikapika - brilhante)" },
      { char: "ぷ", romaji: "pu", example: "ぷりん (purin - pudim)" },
      { char: "ぺ", romaji: "pe", example: "ぺこぺこ (pekopeko - com fome)" },
      { char: "ぽ", romaji: "po", example: "ぽすと (posuto - correio)" }
    ],
    yoon: [
      { char: "きゃ", romaji: "kya", example: "きゃく (kyaku - cliente)" },
      { char: "きゅ", romaji: "kyu", example: "きゅう (kyuu - nove)" },
      { char: "きょ", romaji: "kyo", example: "きょう (kyou - hoje)" },

      { char: "しゃ", romaji: "sha", example: "しゃしん (shashin - foto)" },
      { char: "しゅ", romaji: "shu", example: "しゅくだい (shukudai - dever de casa)" },
      { char: "しょ", romaji: "sho", example: "しょくどう (shokudou - refeitório)" },

      { char: "ちゃ", romaji: "cha", example: "おちゃ (ocha - chá verde)" },
      { char: "ちゅ", romaji: "chu", example: "ちゅうごく (chuugoku - China)" },
      { char: "ちょ", romaji: "cho", example: "ちょっと (chotto - um pouco)" },

      { char: "にゃ", romaji: "nya", example: "にゃー (nyaa - miau)" },
      { char: "にゅ", romaji: "nyu", example: "ぎゅうにゅう (gyuunyuu - leite)" },
      { char: "にょ", romaji: "nyo", example: "にょうぼう (nyoubou - esposa)" },

      { char: "ひゃ", romaji: "hya", example: "ひゃく (hyaku - cem)" },
      { char: "ひゅ", romaji: "hyu", example: "ひゅうひゅう (vento soprando)" },
      { char: "ひょ", romaji: "hyo", example: "ひょう (hyou - leopardo / granizo)" },

      { char: "みゃ", romaji: "mya", example: "みゃく (myaku - pulso/pulsação)" },
      { char: "みゅ", romaji: "myu", example: "みゅーじかる (musical)" },
      { char: "みょ", romaji: "myo", example: "みょうじ (myouji - sobrenome)" },

      { char: "りゃ", romaji: "rya", example: "りゃく (ryaku - abreviação)" },
      { char: "りゅ", romaji: "ryu", example: "りゅう (ryuu - dragão)" },
      { char: "りょ", romaji: "ryo", example: "りょこう (ryokou - viagem)" },

      { char: "ぎゃ", romaji: "gya", example: "ぎゃく (gyaku - oposto)" },
      { char: "ぎゅ", romaji: "gyu", example: "ぎゅうにく (gyuuniku - carne bovina)" },
      { char: "ぎょ", romaji: "gyo", example: "ぎょぎょう (gyogyou - pesca)" },

      { char: "じゃ", romaji: "ja", example: "じゃあね (jaane - até mais)" },
      { char: "じゅ", romaji: "ju", example: "じゅぎょう (jugyou - aula)" },
      { char: "じょ", romaji: "jo", example: "じょせい (josei - mulher)" },

      { char: "びゃ", romaji: "bya", example: "びゃくだん (byakudan - sândalo)" },
      { char: "びゅ", romaji: "byu", example: "びゅー (som de vento)" },
      { char: "びょ", romaji: "byo", example: "びょうき (byouki - doença)" },

      { char: "ぴゃ", romaji: "pya", example: "ろっぴゃく (roppyaku - 600)" },
      { char: "ぴゅ", romaji: "pyu", example: "ぴゅーぴゅー (assovio do vento)" },
      { char: "ぴょ", romaji: "pyo", example: "ぴょんぴょん (pulando)" }
    ]
  },

  katakana: {
    basic: [
      { char: "ア", romaji: "a", example: "アイス (aisu - sorvete)", strokes: 2 },
      { char: "イ", romaji: "i", example: "インク (inku - tinta)", strokes: 2 },
      { char: "ウ", romaji: "u", example: "ウェブ (webu - web)", strokes: 3 },
      { char: "エ", romaji: "e", example: "エレベーター (erebeetaa - elevador)", strokes: 3 },
      { char: "オ", romaji: "o", example: "オレンジ (orenji - laranja)", strokes: 3 },

      { char: "カ", romaji: "ka", example: "カメラ (kamera - câmera)", strokes: 2 },
      { char: "キ", romaji: "ki", example: "キーボード (kiiboodo - teclado)", strokes: 3 },
      { char: "ク", romaji: "ku", example: "クラス (kurasu - classe)", strokes: 2 },
      { char: "ケ", romaji: "ke", example: "ケーキ (keeki - bolo)", strokes: 3 },
      { char: "コ", romaji: "ko", example: "コーヒー (koohii - café)", strokes: 2 },

      { char: "サ", romaji: "sa", example: "サラダ (sarada - salada)", strokes: 3 },
      { char: "シ", romaji: "shi", example: "シャツ (shatsu - camisa)", strokes: 3 },
      { char: "ス", romaji: "su", example: "スポーツ (supootsu - esporte)", strokes: 2 },
      { char: "セ", romaji: "se", example: "セーター (seetaa - suéter)", strokes: 2 },
      { char: "ソ", romaji: "so", example: "ソファ (sofa - sofá)", strokes: 2 },

      { char: "タ", romaji: "ta", example: "タクシー (takushii - táxi)", strokes: 3 },
      { char: "チ", romaji: "chi", example: "チーズ (chiizu - queijo)", strokes: 3 },
      { char: "ツ", romaji: "tsu", example: "ツアー (tsuaa - tour)", strokes: 3 },
      { char: "テ", romaji: "te", example: "テレビ (terebi - televisão)", strokes: 3 },
      { char: "ト", romaji: "to", example: "トマト (tomato - tomate)", strokes: 2 },

      { char: "ナ", romaji: "na", example: "ナイフ (naifu - faca)", strokes: 2 },
      { char: "ニ", romaji: "ni", example: "ニュース (nyuusu - notícia)", strokes: 2 },
      { char: "ヌ", romaji: "nu", example: "ヌードル (nuudoru - macarrão instantâneo)", strokes: 2 },
      { char: "ネ", romaji: "ne", example: "ネクタイ (nekutai - gravata)", strokes: 4 },
      { char: "ノ", romaji: "no", example: "ノート (nooto - caderno)", strokes: 1 },

      { char: "ハ", romaji: "ha", example: "ハンバーガー (hanbaagaa - hambúrguer)", strokes: 2 },
      { char: "ヒ", romaji: "hi", example: "ヒーター (hiitaa - aquecedor)", strokes: 2 },
      { char: "フ", romaji: "fu", example: "フォーク (fooku - garfo)", strokes: 1 },
      { char: "ヘ", romaji: "he", example: "ヘルメット (herumetto - capacete)", strokes: 1 },
      { char: "ホ", romaji: "ho", example: "ホテル (hoteru - hotel)", strokes: 4 },

      { char: "マ", romaji: "ma", example: "マスク (masuku - máscara)", strokes: 2 },
      { char: "ミ", romaji: "mi", example: "ミルク (miruku - leite)", strokes: 3 },
      { char: "ム", romaji: "mu", example: "ムービー (muubii - filme)", strokes: 2 },
      { char: "メ", romaji: "me", example: "メニュー (menyuu - cardápio)", strokes: 2 },
      { char: "モ", romaji: "mo", example: "モデル (moderu - modelo)", strokes: 3 },

      { char: "ヤ", romaji: "ya", example: "ヤシ (yashi - palmeira)", strokes: 2 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "ユ", romaji: "yu", example: "ユーザー (yuuzaa - usuário)", strokes: 2 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "ヨ", romaji: "yo", example: "ヨーグルト (yooguruto - iogurte)", strokes: 3 },

      { char: "ラ", romaji: "ra", example: "ラジオ (rajio - rádio)", strokes: 2 },
      { char: "リ", romaji: "ri", example: "リモコン (rimokon - controle remoto)", strokes: 2 },
      { char: "ル", romaji: "ru", example: "ルール (ruuru - regra)", strokes: 2 },
      { char: "レ", romaji: "re", example: "レストラン (resutoran - restaurante)", strokes: 1 },
      { char: "ロ", romaji: "ro", example: "ロボット (robotto - robô)", strokes: 3 },

      { char: "ワ", romaji: "wa", example: "ワイン (wain - vinho)", strokes: 2 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "", romaji: "", example: "", strokes: 0 },
      { char: "ヲ", romaji: "wo", example: "(raramente usado em katakana)", strokes: 3 },

      { char: "ン", romaji: "n", example: "パン (pan - pão)", strokes: 2 }
    ],
    dakuon: [
      { char: "ガ", romaji: "ga", example: "ガス (gasu - gás)" },
      { char: "ギ", romaji: "gi", example: "ギター (gitaa - violão/guitarra)" },
      { char: "グ", romaji: "gu", example: "グラス (gurasu - copo)" },
      { char: "ゲ", romaji: "ge", example: "ゲーム (geemu - jogo)" },
      { char: "ゴ", romaji: "go", example: "ゴルフ (gorufu - golfe)" },

      { char: "ザ", romaji: "za", example: "デザート (dezaato - sobremesa)" },
      { char: "ジ", romaji: "ji", example: "ジーンズ (jiinzu - calça jeans)" },
      { char: "ズ", romaji: "zu", example: "ズボン (zubon - calça)" },
      { char: "ゼ", romaji: "ze", example: "ゼロ (zero - zero)" },
      { char: "ゾ", romaji: "zo", example: "ゾーン (zoon - zona/área)" },

      { char: "ダ", romaji: "da", example: "ダンス (dansu - dança)" },
      { char: "ヂ", romaji: "ji (di)", example: "ラジオヂャケット (arcaico)" },
      { char: "ヅ", romaji: "zu (du)", example: "ディズニー (dizunii - Disney)" },
      { char: "デ", romaji: "de", example: "デザート (dezaato - sobremesa)" },
      { char: "ド", romaji: "do", example: "ドア (doa - porta)" },

      { char: "バ", romaji: "ba", example: "バス (basu - ônibus)" },
      { char: "ビ", romaji: "bi", example: "ビール (biiru - cerveja)" },
      { char: "ブ", romaji: "bu", example: "ベッド (beddo - cama)" },
      { char: "ベ", romaji: "be", example: "ベル (beru - sino/campainha)" },
      { char: "ボ", romaji: "bo", example: "ボール (booru - bola)" },

      { char: "パ", romaji: "pa", example: "パーティー (paatii - festa)" },
      { char: "ピ", romaji: "pi", example: "ピアノ (piano - piano)" },
      { char: "プ", romaji: "pu", example: "プール (puuru - piscina)" },
      { char: "ペ", romaji: "pe", example: "ペン (pen - caneta)" },
      { char: "ポ", romaji: "po", example: "ポスト (posuto - caixa de correio)" }
    ],
    yoon: [
      { char: "キャ", romaji: "kya", example: "キャンプ (kyanpu - acampamento)" },
      { char: "キュ", romaji: "kyu", example: "キューブ (kyuubu - cubo)" },
      { char: "キョ", romaji: "kyo", example: "キロ (kiro - quilo)" },

      { char: "シャ", romaji: "sha", example: "シャワー (shawaa - chuveiro)" },
      { char: "シュ", romaji: "shu", example: "シュークリーム (shuukuriimu - bomba de creme)" },
      { char: "ショ", romaji: "sho", example: "ショップ (shoppu - loja)" },

      { char: "チャ", romaji: "cha", example: "チャンス (chansu - chance)" },
      { char: "チュ", romaji: "chu", example: "チューリップ (chuurippu - tulipa)" },
      { char: "チョ", romaji: "cho", example: "チョコレート (chokoreeto - chocolate)" },

      { char: "ニャ", romaji: "nya", example: "コニャック (konyakku - conhaque)" },
      { char: "ニュ", romaji: "nyu", example: "ニュース (nyuusu - notícia)" },
      { char: "ニョ", romaji: "nyo", example: "ニョッキ (nyokki - nhoque)" },

      { char: "ヒャ", romaji: "hya", example: "ヒャッキン (100 yen shop)" },
      { char: "ヒュ", romaji: "hyu", example: "ヒューストン (Hyuusuton - Houston)" },
      { char: "ヒョ", romaji: "hyo", example: "ヒョウ (leopardo)" },

      { char: "ミャ", romaji: "mya", example: "ミャンマー (Myanmaa - Mianmar)" },
      { char: "ミュ", romaji: "myu", example: "ミュージアム (myuujiamu - museu)" },
      { char: "ミョ", romaji: "myo", example: "ミョウガ (tempero japonês)" },

      { char: "リャ", romaji: "rya", example: "ラリー (rarii - rali)" },
      { char: "リュ", romaji: "ryu", example: "リュック (ryukku - mochila)" },
      { char: "リョ", romaji: "ryo", example: "リョカ (hotel tradicional)" },

      { char: "ギャ", romaji: "gya", example: "ギャグ (gyagu - piada/gag)" },
      { char: "ギュ", romaji: "gyu", example: "ギョーザ (gyouza - guioza)" },
      { char: "ギョ", romaji: "gyo", example: "ギョーザ (gyouza - guioza)" },

      { char: "ジャ", romaji: "ja", example: "ジャケット (jaketto - jaqueta)" },
      { char: "ジュ", romaji: "ju", example: "ジュース (juusu - suco)" },
      { char: "ジョ", romaji: "jo", example: "ジョギング (jogingu - corrida)" }
    ]
  },

  kanji: [
    // Números e Quantidade
    {
      id: "k1",
      kanji: "一",
      meaning: "Um",
      onyomi: "イチ, イツ (ichi, itsu)",
      kunyomi: "ひと-つ (hito-tsu)",
      strokes: 1,
      level: "N5",
      category: "Números",
      examples: [
        { word: "一つ (ひとつ)", reading: "hitotsu", meaning: "uma coisa" },
        { word: "一人 (ひとり)", reading: "hitori", meaning: "uma pessoa / sozinho" },
        { word: "一月 (いちがつ)", reading: "ichigatsu", meaning: "janeiro" }
      ]
    },
    {
      id: "k2",
      kanji: "二",
      meaning: "Dois",
      onyomi: "ニ (ni)",
      kunyomi: "ふた-つ (futa-tsu)",
      strokes: 2,
      level: "N5",
      category: "Números",
      examples: [
        { word: "二つ (ふたつ)", reading: "futatsu", meaning: "duas coisas" },
        { word: "二人 (ふたり)", reading: "futari", meaning: "duas pessoas" },
        { word: "二月 (にがつ)", reading: "nigatsu", meaning: "fevereiro" }
      ]
    },
    {
      id: "k3",
      kanji: "三",
      meaning: "Três",
      onyomi: "サン (san)",
      kunyomi: "みっ-つ (mit-tsu)",
      strokes: 3,
      level: "N5",
      category: "Números",
      examples: [
        { word: "三つ (みっつ)", reading: "mittsu", meaning: "três coisas" },
        { word: "三人 (さんにん)", reading: "sannin", meaning: "três pessoas" },
        { word: "三日 (みっか)", reading: "mikka", meaning: "dia 3 / três dias" }
      ]
    },
    {
      id: "k4",
      kanji: "四",
      meaning: "Quatro",
      onyomi: "シ (shi)",
      kunyomi: "よっ-つ, よん (yot-tsu, yon)",
      strokes: 5,
      level: "N5",
      category: "Números",
      examples: [
        { word: "四つ (よっつ)", reading: "yottsu", meaning: "quatro coisas" },
        { word: "四日 (よっか)", reading: "yokka", meaning: "dia 4 / quatro dias" },
        { word: "四月 (しがつ)", reading: "shigatsu", meaning: "abril" }
      ]
    },
    {
      id: "k5",
      kanji: "五",
      meaning: "Cinco",
      onyomi: "ゴ (go)",
      kunyomi: "いつ-つ (itsu-tsu)",
      strokes: 4,
      level: "N5",
      category: "Números",
      examples: [
        { word: "五つ (いつつ)", reading: "itsutsu", meaning: "cinco coisas" },
        { word: "五月 (ごがつ)", reading: "gogatsu", meaning: "maio" },
        { word: "五日 (いつか)", reading: "itsuka", meaning: "dia 5 / cinco dias" }
      ]
    },
    {
      id: "k6",
      kanji: "六",
      meaning: "Seis",
      onyomi: "ロク (roku)",
      kunyomi: "むっ-つ (mut-tsu)",
      strokes: 4,
      level: "N5",
      category: "Números",
      examples: [
        { word: "六つ (むっつ)", reading: "muttsu", meaning: "seis coisas" },
        { word: "六月 (ろくがつ)", reading: "rokugatsu", meaning: "junho" },
        { word: "六日 (むいか)", reading: "muika", meaning: "dia 6 / seis dias" }
      ]
    },
    {
      id: "k7",
      kanji: "七",
      meaning: "Sete",
      onyomi: "シチ (shichi)",
      kunyomi: "なな-つ (nana-tsu)",
      strokes: 2,
      level: "N5",
      category: "Números",
      examples: [
        { word: "七つ (ななつ)", reading: "nanatsu", meaning: "sete coisas" },
        { word: "七月 (しちがつ)", reading: "shichigatsu", meaning: "julho" },
        { word: "七日 (なのか)", reading: "nanoka", meaning: "dia 7 / sete dias" }
      ]
    },
    {
      id: "k8",
      kanji: "八",
      meaning: "Oito",
      onyomi: "ハチ (hachi)",
      kunyomi: "やっ-つ (yat-tsu)",
      strokes: 2,
      level: "N5",
      category: "Números",
      examples: [
        { word: "八つ (やっつ)", reading: "yattsu", meaning: "oito coisas" },
        { word: "八月 (はちがつ)", reading: "hachigatsu", meaning: "agosto" },
        { word: "八日 (ようか)", reading: "youka", meaning: "dia 8 / oito dias" }
      ]
    },
    {
      id: "k9",
      kanji: "九",
      meaning: "Nove",
      onyomi: "キュウ, ク (kyuu, ku)",
      kunyomi: "ここの-つ (kokono-tsu)",
      strokes: 2,
      level: "N5",
      category: "Números",
      examples: [
        { word: "九つ (ここのつ)", reading: "kokonotsu", meaning: "nove coisas" },
        { word: "九月 (くがつ)", reading: "kugatsu", meaning: "setembro" },
        { word: "九日 (ここのか)", reading: "kokonoka", meaning: "dia 9 / nove dias" }
      ]
    },
    {
      id: "k10",
      kanji: "十",
      meaning: "Dez",
      onyomi: "ジュウ, ジッ (juu, jip)",
      kunyomi: "とお (too)",
      strokes: 2,
      level: "N5",
      category: "Números",
      examples: [
        { word: "十 (とお)", reading: "too", meaning: "dez coisas" },
        { word: "十月 (じゅうがつ)", reading: "juugatsu", meaning: "outubro" },
        { word: "十日 (とおか)", reading: "tooka", meaning: "dia 10 / dez dias" }
      ]
    },
    {
      id: "k11",
      kanji: "百",
      meaning: "Cem",
      onyomi: "ヒャク (hyaku)",
      kunyomi: "もも (momo)",
      strokes: 6,
      level: "N5",
      category: "Números",
      examples: [
        { word: "百 (ひゃく)", reading: "hyaku", meaning: "cem" },
        { word: "三百 (さんびゃく)", reading: "sanbyaku", meaning: "trezentos" },
        { word: "百科事典 (ひゃっかじてん)", reading: "hyakkajiten", meaning: "enciclopédia" }
      ]
    },
    {
      id: "k12",
      kanji: "千",
      meaning: "Mil",
      onyomi: "セン (sen)",
      kunyomi: "ち (chi)",
      strokes: 3,
      level: "N5",
      category: "Números",
      examples: [
        { word: "千 (せん)", reading: "sen", meaning: "mil" },
        { word: "三千 (さんぜん)", reading: "sanzen", meaning: "três mil" },
        { word: "千代 (ちよ)", reading: "chiyo", meaning: "mil anos / eternidade" }
      ]
    },
    {
      id: "k13",
      kanji: "万",
      meaning: "Dez Mil",
      onyomi: "マン, バン (man, ban)",
      kunyomi: "よろず (yorozu)",
      strokes: 3,
      level: "N5",
      category: "Números",
      examples: [
        { word: "一万 (いちまん)", reading: "ichiman", meaning: "dez mil" },
        { word: "万国 (ばんこく)", reading: "bankoku", meaning: "todas as nações" },
        { word: "万歳 (ばんざい)", reading: "banzai", meaning: "viva! / dez mil anos" }
      ]
    },
    {
      id: "k14",
      kanji: "円",
      meaning: "Iene / Círculo",
      onyomi: "エン (en)",
      kunyomi: "まる-い (maru-i)",
      strokes: 4,
      level: "N5",
      category: "Números",
      examples: [
        { word: "百円 (ひゃくえん)", reading: "hyakuen", meaning: "100 ienes" },
        { word: "円高 (えんだか)", reading: "endaka", meaning: "iene forte" },
        { word: "円い (まるい)", reading: "marui", meaning: "redondo / circular" }
      ]
    },

    // Natureza e Elementos
    {
      id: "k15",
      kanji: "日",
      meaning: "Dia / Sol / Japão",
      onyomi: "ニチ, ジツ (nichi, jitsu)",
      kunyomi: "ひ, -か (hi, ka)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "日本 (にほん)", reading: "nihon", meaning: "Japão" },
        { word: "日曜日 (にちようび)", reading: "nichiyoubi", meaning: "domingo" },
        { word: "今日 (きょう)", reading: "kyou", meaning: "hoje" }
      ]
    },
    {
      id: "k16",
      kanji: "月",
      meaning: "Mês / Lua",
      onyomi: "ゲツ, ガツ (getsu, gatsu)",
      kunyomi: "つき (tsuki)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "月 (つき)", reading: "tsuki", meaning: "lua" },
        { word: "月曜日 (げつようび)", reading: "getsuyoubi", meaning: "segunda-feira" },
        { word: "今月 (こんげつ)", reading: "kongetsu", meaning: "este mês" }
      ]
    },
    {
      id: "k17",
      kanji: "火",
      meaning: "Fogo",
      onyomi: "カ (ka)",
      kunyomi: "ひ, ほ (hi, ho)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "火 (ひ)", reading: "hi", meaning: "fogo / chama" },
        { word: "火曜日 (かようび)", reading: "kayoubi", meaning: "terça-feira" },
        { word: "火山 (かざん)", reading: "kazan", meaning: "vulcão" }
      ]
    },
    {
      id: "k18",
      kanji: "水",
      meaning: "Água",
      onyomi: "スイ (sui)",
      kunyomi: "みず (mizu)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "水 (みず)", reading: "mizu", meaning: "água" },
        { word: "水曜日 (すいようび)", reading: "suiyoubi", meaning: "quarta-feira" },
        { word: "水泳 (すいえい)", reading: "suiei", meaning: "natação" }
      ]
    },
    {
      id: "k19",
      kanji: "木",
      meaning: "Árvore / Madeira",
      onyomi: "モク, ボク (moku, boku)",
      kunyomi: "き, こ (ki, ko)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "木 (き)", reading: "ki", meaning: "árvore" },
        { word: "木曜日 (もくようび)", reading: "mokuyoubi", meaning: "quinta-feira" },
        { word: "木材 (もくざい)", reading: "mokuzai", meaning: "madeira / tábuas" }
      ]
    },
    {
      id: "k20",
      kanji: "金",
      meaning: "Ouro / Dinheiro",
      onyomi: "キン, コン (kin, kon)",
      kunyomi: "かね, かな (kane, kana)",
      strokes: 8,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "お金 (おかね)", reading: "okane", meaning: "dinheiro" },
        { word: "金曜日 (きんようび)", reading: "kinyoubi", meaning: "sexta-feira" },
        { word: "金メダル (きんめだる)", reading: "kin medaru", meaning: "medalha de ouro" }
      ]
    },
    {
      id: "k21",
      kanji: "土",
      meaning: "Terra / Solo",
      onyomi: "ド, ト (do, to)",
      kunyomi: "つち (tsuchi)",
      strokes: 3,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "土 (つち)", reading: "tsuchi", meaning: "terra / barro" },
        { word: "土曜日 (どようび)", reading: "doyoubi", meaning: "sábado" },
        { word: "土地 (とち)", reading: "tochi", meaning: "terreno / lote" }
      ]
    },
    {
      id: "k22",
      kanji: "山",
      meaning: "Montanha",
      onyomi: "サン (san)",
      kunyomi: "やま (yama)",
      strokes: 3,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "山 (やま)", reading: "yama", meaning: "montanha" },
        { word: "富士山 (ふじさん)", reading: "fujisan", meaning: "Monte Fuji" },
        { word: "山登り (やまのぼり)", reading: "yamanobori", meaning: "montanhismo" }
      ]
    },
    {
      id: "k23",
      kanji: "川",
      meaning: "Rio",
      onyomi: "セン (sen)",
      kunyomi: "かわ (kawa)",
      strokes: 3,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "川 (かわ)", reading: "kawa", meaning: "rio" },
        { word: "小川 (おがわ)", reading: "ogawa", meaning: "riacho" },
        { word: "河川 (かせん)", reading: "kasen", meaning: "rios / hidrografia" }
      ]
    },
    {
      id: "k24",
      kanji: "天",
      meaning: "Céu / Céus",
      onyomi: "テン (ten)",
      kunyomi: "あめ, あま (ame, ama)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "天気 (てんき)", reading: "tenki", meaning: "clima / tempo" },
        { word: "天才 (てんさい)", reading: "tensai", meaning: "gênio" },
        { word: "天国 (てんごく)", reading: "tengoku", meaning: "paraíso / céu" }
      ]
    },
    {
      id: "k25",
      kanji: "気",
      meaning: "Espírito / Energia / Ar",
      onyomi: "キ, ケ (ki, ke)",
      kunyomi: "いき (iki)",
      strokes: 6,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "元気 (げんき)", reading: "genki", meaning: "bem / animado / saudável" },
        { word: "気分 (きぶん)", reading: "kibun", meaning: "humor / estado de espírito" },
        { word: "気持ち (きもち)", reading: "kimochi", meaning: "sentimento / sensação" }
      ]
    },
    {
      id: "k26",
      kanji: "雨",
      meaning: "Chuva",
      onyomi: "ウ (u)",
      kunyomi: "あめ, あま (ame, ama)",
      strokes: 8,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "雨 (あめ)", reading: "ame", meaning: "chuva" },
        { word: "大雨 (おおあめ)", reading: "ooame", meaning: "chuva forte" },
        { word: "雨季 (うき)", reading: "uki", meaning: "estação chuvosa" }
      ]
    },

    // Pessoas e Relações
    {
      id: "k27",
      kanji: "人",
      meaning: "Pessoa / Humano",
      onyomi: "ジン, ニン (jin, nin)",
      kunyomi: "ひと (hito)",
      strokes: 2,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "人 (ひと)", reading: "hito", meaning: "pessoa" },
        { word: "日本人 (にほんじん)", reading: "nihonjin", meaning: "japonês (pessoa)" },
        { word: "大人 (おとな)", reading: "otona", meaning: "adulto" }
      ]
    },
    {
      id: "k28",
      kanji: "男",
      meaning: "Homem / Masculino",
      onyomi: "ダン, ナン (dan, nan)",
      kunyomi: "おとこ (otoko)",
      strokes: 7,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "男 (おとこ)", reading: "otoko", meaning: "homem" },
        { word: "男の子 (おとこのこ)", reading: "otokonoko", meaning: "menino" },
        { word: "男性 (だんせい)", reading: "dansei", meaning: "sexo masculino" }
      ]
    },
    {
      id: "k29",
      kanji: "女",
      meaning: "Mulher / Feminino",
      onyomi: "ジョ, ニョ (jo, nyo)",
      kunyomi: "おんな, め (onna, me)",
      strokes: 3,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "女 (おんな)", reading: "onna", meaning: "mulher" },
        { word: "女の子 (おんなのこ)", reading: "onnanoko", meaning: "menina" },
        { word: "女性 (じょせい)", reading: "josei", meaning: "sexo feminino" }
      ]
    },
    {
      id: "k30",
      kanji: "子",
      meaning: "Criança / Filho",
      onyomi: "シ, ス (shi, su)",
      kunyomi: "こ (ko)",
      strokes: 3,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "子ども (こども)", reading: "kodomo", meaning: "criança" },
        { word: "息子 (むすこ)", reading: "musuko", meaning: "filho" },
        { word: "様子 (ようす)", reading: "yousu", meaning: "aspecto / situação" }
      ]
    },
    {
      id: "k31",
      kanji: "母",
      meaning: "Mãe",
      onyomi: "ボ (bo)",
      kunyomi: "はは (haha)",
      strokes: 5,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "母 (はは)", reading: "haha", meaning: "minha mãe" },
        { word: "お母さん (おかあさん)", reading: "okaasan", meaning: "mãe (cortês)" },
        { word: "母国 (ぼこく)", reading: "bokoku", meaning: "pátria / país natal" }
      ]
    },
    {
      id: "k32",
      kanji: "父",
      meaning: "Pai",
      onyomi: "フ (fu)",
      kunyomi: "ちち (chichi)",
      strokes: 4,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "父 (ちち)", reading: "chichi", meaning: "meu pai" },
        { word: "お父さん (おとうさん)", reading: "otousan", meaning: "pai (cortês)" },
        { word: "父母 (ふぼ)", reading: "fubo", meaning: "pais / pai e mãe" }
      ]
    },
    {
      id: "k33",
      kanji: "友",
      meaning: "Amigo",
      onyomi: "ユウ (yuu)",
      kunyomi: "とも (tomo)",
      strokes: 4,
      level: "N5",
      category: "Pessoas & Sociedade",
      examples: [
        { word: "友達 (ともだち)", reading: "tomodachi", meaning: "amigo(s)" },
        { word: "親友 (しんゆう)", reading: "shinyuu", meaning: "melhor amigo" },
        { word: "友情 (ゆうじょう)", reading: "yuujou", meaning: "amizade" }
      ]
    },
    {
      id: "k34",
      kanji: "本",
      meaning: "Livro / Origem / Base",
      onyomi: "ホン (hon)",
      kunyomi: "もと (moto)",
      strokes: 5,
      level: "N5",
      category: "Sociedade & Objetos",
      examples: [
        { word: "本 (ほん)", reading: "hon", meaning: "livro" },
        { word: "日本 (にほん)", reading: "nihon", meaning: "Japão" },
        { word: "本当 (ほんとう)", reading: "hontou", meaning: "verdade / real" }
      ]
    },

    // Verbos e Ações
    {
      id: "k35",
      kanji: "行",
      meaning: "Ir / Realizar",
      onyomi: "コウ, ギョウ (kou, gyou)",
      kunyomi: "い-く, ゆ-く, おこな-う (i-ku, yu-ku, okona-u)",
      strokes: 6,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "行く (いく)", reading: "iku", meaning: "ir" },
        { word: "旅行 (りょこう)", reading: "ryokou", meaning: "viagem" },
        { word: "銀行 (ぎんこう)", reading: "ginkou", meaning: "banco" }
      ]
    },
    {
      id: "k36",
      kanji: "来",
      meaning: "Vir / Chegar",
      onyomi: "ライ (rai)",
      kunyomi: "く-る, きた-る (ku-ru, kita-ru)",
      strokes: 7,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "来る (くる)", reading: "kuru", meaning: "vir" },
        { word: "来年 (らいねん)", reading: "rainen", meaning: "ano que vem" },
        { word: "未来 (みらい)", reading: "mirai", meaning: "futuro distante" }
      ]
    },
    {
      id: "k37",
      kanji: "食",
      meaning: "Comer / Alimento",
      onyomi: "ショク (shoku)",
      kunyomi: "た-べる, く-う (ta-beru, ku-u)",
      strokes: 9,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "食べる (たべる)", reading: "taberu", meaning: "comer" },
        { word: "食べ物 (たべもの)", reading: "tabemono", meaning: "comida" },
        { word: "食事 (しょくじ)", reading: "shokuji", meaning: "refeição" }
      ]
    },
    {
      id: "k38",
      kanji: "飲",
      meaning: "Beber",
      onyomi: "イン (in)",
      kunyomi: "の-む (no-mu)",
      strokes: 12,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "飲む (のむ)", reading: "nomu", meaning: "beber" },
        { word: "飲み物 (のみもの)", reading: "nomimono", meaning: "bebida" },
        { word: "飲食店 (いんしょくてん)", reading: "inshokuten", meaning: "restaurante" }
      ]
    },
    {
      id: "k39",
      kanji: "見",
      meaning: "Ver / Olhar",
      onyomi: "ケン (ken)",
      kunyomi: "み-る, み-せる (mi-ru, mi-seru)",
      strokes: 7,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "見る (みる)", reading: "miru", meaning: "ver / assistir" },
        { word: "見せる (みせる)", reading: "miseru", meaning: "mostrar" },
        { word: "意見 (いけん)", reading: "iken", meaning: "opinião" }
      ]
    },
    {
      id: "k40",
      kanji: "聞",
      meaning: "Ouvir / Perguntar",
      onyomi: "ブン, モン (bun, mon)",
      kunyomi: "き-く, き-こえる (ki-ku, ki-koeru)",
      strokes: 14,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "聞く (きく)", reading: "kiku", meaning: "ouvir / escutar / perguntar" },
        { word: "新聞 (しんぶん)", reading: "shinbun", meaning: "jornal" },
        { word: "聞こえる (きこえる)", reading: "kikoeru", meaning: "ser audível" }
      ]
    },
    {
      id: "k41",
      kanji: "話",
      meaning: "Falar / Conversar",
      onyomi: "ワ (wa)",
      kunyomi: "はな-す, はなし (hana-su, hanashi)",
      strokes: 13,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "話す (はなす)", reading: "hanasu", meaning: "falar" },
        { word: "話 (はなし)", reading: "hanashi", meaning: "conversa / história" },
        { word: "電話 (でんわ)", reading: "denwa", meaning: "telefone" }
      ]
    },
    {
      id: "k42",
      kanji: "読",
      meaning: "Ler",
      onyomi: "ドク, トク (doku, toku)",
      kunyomi: "よ-む (yo-mu)",
      strokes: 14,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "読む (よむ)", reading: "yomu", meaning: "ler" },
        { word: "読書 (どくしょ)", reading: "dokusho", meaning: "leitura" },
        { word: "読者 (どくしゃ)", reading: "dokusha", meaning: "leitor" }
      ]
    },
    {
      id: "k43",
      kanji: "書",
      meaning: "Escrever",
      onyomi: "ショ (sho)",
      kunyomi: "か-く (ka-ku)",
      strokes: 10,
      level: "N5",
      category: "Ações & Verbos",
      examples: [
        { word: "書く (かく)", reading: "kaku", meaning: "escrever" },
        { word: "図書館 (としょかん)", reading: "toshokan", meaning: "biblioteca" },
        { word: "教科書 (きょうかしょ)", reading: "kyoukasho", meaning: "livro didático" }
      ]
    },
    {
      id: "k44",
      kanji: "学",
      meaning: "Estudar / Aprender",
      onyomi: "ガク (gaku)",
      kunyomi: "まな-ぶ (mana-bu)",
      strokes: 8,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "学校 (がっこう)", reading: "gakkou", meaning: "escola" },
        { word: "学生 (がくせい)", reading: "gakusei", meaning: "estudante" },
        { word: "大学 (だいがく)", reading: "daigaku", meaning: "universidade" }
      ]
    },
    {
      id: "k45",
      kanji: "校",
      meaning: "Escola",
      onyomi: "コウ (kou)",
      kunyomi: "-",
      strokes: 10,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "学校 (がっこう)", reading: "gakkou", meaning: "escola" },
        { word: "高校 (こうこう)", reading: "koukou", meaning: "ensino médio" },
        { word: "校長 (こうちょう)", reading: "kouchou", meaning: "diretor escolar" }
      ]
    },
    {
      id: "k46",
      kanji: "先",
      meaning: "Antes / À frente",
      onyomi: "セン (sen)",
      kunyomi: "さき (saki)",
      strokes: 6,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "先生 (せんせい)", reading: "sensei", meaning: "professor / mestre" },
        { word: "先月 (せんげつ)", reading: "sengetsu", meaning: "mês passado" },
        { word: "先週 (せんしゅう)", reading: "senshuu", meaning: "semana passada" }
      ]
    },
    {
      id: "k47",
      kanji: "生",
      meaning: "Vida / Nascer / Puro",
      onyomi: "セイ, ショウ (sei, shou)",
      kunyomi: "い-きる, う-まれる, なま (i-kiru, u-mareru, nama)",
      strokes: 5,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "生きる (いきる)", reading: "ikiru", meaning: "viver" },
        { word: "先生 (せんせい)", reading: "sensei", meaning: "professor" },
        { word: "誕生日 (たんじょうび)", reading: "tanjoubi", meaning: "aniversário" }
      ]
    },

    // Espaço, Tamanho e Direções
    {
      id: "k48",
      kanji: "大",
      meaning: "Grande",
      onyomi: "ダイ, タイ (dai, tai)",
      kunyomi: "おお-きい (oo-kii)",
      strokes: 3,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "大きい (おおきい)", reading: "ookii", meaning: "grande" },
        { word: "大学 (だいがく)", reading: "daigaku", meaning: "universidade" },
        { word: "大変 (たいへん)", reading: "taihen", meaning: "muito difícil / grave" }
      ]
    },
    {
      id: "k49",
      kanji: "中",
      meaning: "Meio / Dentro",
      onyomi: "チュウ (chuu)",
      kunyomi: "なか (naka)",
      strokes: 4,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "中 (なか)", reading: "naka", meaning: "dentro / meio" },
        { word: "一日中 (いちにちじゅう)", reading: "ichinichijuu", meaning: "o dia todo" },
        { word: "中学校 (ちゅうがっこう)", reading: "chuugakkou", meaning: "ensino fundamental II" }
      ]
    },
    {
      id: "k50",
      kanji: "小",
      meaning: "Pequeno",
      onyomi: "ショウ (shou)",
      kunyomi: "ちい-さい, こ, お (chii-sai, ko, o)",
      strokes: 3,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "小さい (ちいさい)", reading: "chiisai", meaning: "pequeno" },
        { word: "小学生 (しょうがくせい)", reading: "shougakusei", meaning: "aluno do primário" },
        { word: "小川 (おがわ)", reading: "ogawa", meaning: "riacho" }
      ]
    },
    {
      id: "k51",
      kanji: "上",
      meaning: "Cima / Sobre",
      onyomi: "ジョウ (jou)",
      kunyomi: "うえ, あ-がる (ue, a-garu)",
      strokes: 3,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "上 (うえ)", reading: "ue", meaning: "em cima / sobre" },
        { word: "上手 (じょうず)", reading: "jouzu", meaning: "habilidoso / bom nisso" },
        { word: "上がる (あがる)", reading: "agaru", meaning: "subir / elevar-se" }
      ]
    },
    {
      id: "k52",
      kanji: "下",
      meaning: "Baixo / Embaixo",
      onyomi: "カ, ゲ (ka, ge)",
      kunyomi: "した, さ-がる, くだ-る (shita, sa-garu, kuda-ru)",
      strokes: 3,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "下 (した)", reading: "shita", meaning: "embaixo" },
        { word: "下手 (へた)", reading: "heta", meaning: "inábil / ruim nisso" },
        { word: "地下鉄 (ちかてつ)", reading: "chikatetsu", meaning: "metrô subterrâneo" }
      ]
    },
    {
      id: "k53",
      kanji: "左",
      meaning: "Esquerda",
      onyomi: "サ (sa)",
      kunyomi: "ひだり (hidari)",
      strokes: 5,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "左 (ひだり)", reading: "hidari", meaning: "esquerda" },
        { word: "左手 (ひだりて)", reading: "hidarite", meaning: "mão esquerda" },
        { word: "左側 (ひだりがわ)", reading: "hidarigawa", meaning: "lado esquerdo" }
      ]
    },
    {
      id: "k54",
      kanji: "右",
      meaning: "Direita",
      onyomi: "ウ, ユウ (u, yuu)",
      kunyomi: "みぎ (migi)",
      strokes: 5,
      level: "N5",
      category: "Adjetivos & Espaço",
      examples: [
        { word: "右 (みぎ)", reading: "migi", meaning: "direita" },
        { word: "右手 (みぎて)", reading: "migite", meaning: "mão direita" },
        { word: "左右 (さゆう)", reading: "sayuu", meaning: "esquerda e direita" }
      ]
    },
    {
      id: "k55",
      kanji: "車",
      meaning: "Carro / Veículo",
      onyomi: "シャ (sha)",
      kunyomi: "くるま (kuruma)",
      strokes: 7,
      level: "N5",
      category: "Sociedade & Objetos",
      examples: [
        { word: "車 (くるま)", reading: "kuruma", meaning: "carro" },
        { word: "電車 (でんしゃ)", reading: "densha", meaning: "trem elétrico" },
        { word: "自転車 (じてんしゃ)", reading: "jitensha", meaning: "bicicleta" }
      ]
    },
    {
      id: "k56",
      kanji: "門",
      meaning: "Portão",
      onyomi: "モン (mon)",
      kunyomi: "かど (kado)",
      strokes: 8,
      level: "N5",
      category: "Sociedade & Objetos",
      examples: [
        { word: "門 (もん)", reading: "mon", meaning: "portão" },
        { word: "校門 (こうもん)", reading: "koumon", meaning: "portão da escola" },
        { word: "専門 (せんもん)", reading: "senmon", meaning: "especialidade" }
      ]
    },
    {
      id: "k57",
      kanji: "間",
      meaning: "Intervalo / Entre / Espaço",
      onyomi: "カン, ケン (kan, ken)",
      kunyomi: "あいだ, ま (aida, ma)",
      strokes: 12,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "時間 (じかん)", reading: "jikan", meaning: "tempo / horas" },
        { word: "間 (あいだ)", reading: "aida", meaning: "entre / durante" },
        { word: "間に合う (まにあう)", reading: "maniau", meaning: "chegar a tempo" }
      ]
    },
    {
      id: "k58",
      kanji: "時",
      meaning: "Hora / Tempo",
      onyomi: "ジ (ji)",
      kunyomi: "とき (toki)",
      strokes: 10,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "時 (とき)", reading: "toki", meaning: "tempo / ocasião" },
        { word: "一時 (いちじ)", reading: "ichiji", meaning: "uma hora (relógio)" },
        { word: "時計 (とけい)", reading: "tokei", meaning: "relógio" }
      ]
    },
    {
      id: "k59",
      kanji: "分",
      meaning: "Minuto / Parte / Entender",
      onyomi: "ブン, フン, ブ (bun, fun, bu)",
      kunyomi: "わ-ける, わ-かる (wa-keru, wa-karu)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "十分 (じゅっぷん)", reading: "juppun", meaning: "dez minutos" },
        { word: "分かる (わかる)", reading: "wakaru", meaning: "entender / compreender" },
        { word: "気分 (きぶん)", reading: "kibun", meaning: "humor / sensação" }
      ]
    },
    {
      id: "k60",
      kanji: "年",
      meaning: "Ano",
      onyomi: "ネン (nen)",
      kunyomi: "とし (toshi)",
      strokes: 6,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "今年 (ことし)", reading: "kotoshi", meaning: "este ano" },
        { word: "去年 (きょねん)", reading: "kyonen", meaning: "ano passado" },
        { word: "毎年 (まいとし)", reading: "maitoshi", meaning: "todos os anos" }
      ]
    },
    {
      id: "k61",
      kanji: "今",
      meaning: "Agora",
      onyomi: "コン, キン (kon, kin)",
      kunyomi: "いま (ima)",
      strokes: 4,
      level: "N5",
      category: "Natureza & Tempo",
      examples: [
        { word: "今 (いま)", reading: "ima", meaning: "agora" },
        { word: "今日 (きょう)", reading: "kyou", meaning: "hoje" },
        { word: "今週 (こんしゅう)", reading: "konshuu", meaning: "esta semana" }
      ]
    },
    {
      id: "k62",
      kanji: "国",
      meaning: "País / Nação",
      onyomi: "コク (koku)",
      kunyomi: "くに (kuni)",
      strokes: 8,
      level: "N5",
      category: "Sociedade & Objetos",
      examples: [
        { word: "国 (くに)", reading: "kuni", meaning: "país" },
        { word: "外国 (がいこく)", reading: "gaikoku", meaning: "país estrangeiro" },
        { word: "国際 (こくさい)", reading: "kokusai", meaning: "internacional" }
      ]
    },
    {
      id: "k63",
      kanji: "語",
      meaning: "Língua / Idioma / Palavra",
      onyomi: "ゴ (go)",
      kunyomi: "かた-る (kata-ru)",
      strokes: 14,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "日本語 (にほんご)", reading: "nihongo", meaning: "língua japonesa" },
        { word: "英語 (えいご)", reading: "eigo", meaning: "língua inglesa" },
        { word: "単語 (たんご)", reading: "tango", meaning: "vocabulário / palavra" }
      ]
    },
    {
      id: "k64",
      kanji: "電",
      meaning: "Eletricidade / Elétrico",
      onyomi: "デン (den)",
      kunyomi: "--",
      strokes: 13,
      level: "N5",
      category: "Sociedade & Tecnologia",
      examples: [
        { word: "電車 (でんしゃ)", reading: "densha", meaning: "trem elétrico" },
        { word: "電気 (でんき)", reading: "denki", meaning: "eletricidade / luz" },
        { word: "電話 (でんわ)", reading: "denwa", meaning: "telefone" }
      ]
    },
    {
      id: "k65",
      kanji: "校",
      meaning: "Escola / Instituição de Ensino",
      onyomi: "コウ (kō)",
      kunyomi: "--",
      strokes: 10,
      level: "N5",
      category: "Educação & Trabalho",
      examples: [
        { word: "学校 (がっこう)", reading: "gakkou", meaning: "escola" },
        { word: "高校 (こうこう)", reading: "koukou", meaning: "ensino médio" },
        { word: "校長 (こうちょう)", reading: "kouchou", meaning: "diretor escolar" }
      ]
    },
    {
      id: "k66",
      kanji: "社",
      meaning: "Companhia / Sociedade / Santuário",
      onyomi: "シャ (sha)",
      kunyomi: "やしろ (yashiro)",
      strokes: 7,
      level: "N5",
      category: "Sociedade & Cotidiano",
      examples: [
        { word: "会社 (かいしゃ)", reading: "kaisha", meaning: "empresa / companhia" },
        { word: "社長 (しゃちょう)", reading: "shachou", meaning: "presidente da empresa" },
        { word: "神社 (じんじゃ)", reading: "jinja", meaning: "santuário xintoísta" }
      ]
    },
    {
      id: "k67",
      kanji: "店",
      meaning: "Loja / Estabelecimento Comercial",
      onyomi: "テン (ten)",
      kunyomi: "みせ (mise)",
      strokes: 8,
      level: "N5",
      category: "Sociedade & Cotidiano",
      examples: [
        { word: "店 (みせ)", reading: "mise", meaning: "loja / comércio" },
        { word: "店員 (てんいん)", reading: "ten'in", meaning: "atendente da loja" },
        { word: "喫茶店 (きっさてん)", reading: "kissaten", meaning: "cafeteria tradicional" }
      ]
    },
    {
      id: "k68",
      kanji: "駅",
      meaning: "Estação de Trem ou Metrô",
      onyomi: "エキ (eki)",
      kunyomi: "--",
      strokes: 14,
      level: "N5",
      category: "Sociedade & Cotidiano",
      examples: [
        { word: "駅 (えき)", reading: "eki", meaning: "estação" },
        { word: "駅員 (えきいん)", reading: "eki'in", meaning: "funcionário da estação" },
        { word: "東京駅 (とうきょうえき)", reading: "toukyou-eki", meaning: "Estação de Tóquio" }
      ]
    },
    {
      id: "k69",
      kanji: "道",
      meaning: "Caminho / Estrada / Filosofia (Dō)",
      onyomi: "ドウ (dō)",
      kunyomi: "みち (michi)",
      strokes: 12,
      level: "N5",
      category: "Natureza & Sociedade",
      examples: [
        { word: "道 (みち)", reading: "michi", meaning: "caminho / estrada / rua" },
        { word: "茶道 (さどう)", reading: "sadou", meaning: "cerimônia do chá" },
        { word: "柔道 (じゅうどう)", reading: "juudou", meaning: "judô (caminho suave)" }
      ]
    }
  ],

  // Guia de Gramática e Frases Úteis para Enriquecer a Experiência
  phrases: [
    { jp: "こんにちは", romaji: "Konnichiwa", pt: "Olá / Boa tarde" },
    { jp: "おはようございます", romaji: "Ohayou gozaimasu", pt: "Bom dia (formal)" },
    { jp: "こんばんは", romaji: "Konbanwa", pt: "Boa noite (ao encontrar)" },
    { jp: "おやすみなさい", romaji: "Oyasuminasai", pt: "Boa noite (ao se despedir para dormir)" },
    { jp: "ありがとうございます", romaji: "Arigatou gozaimasu", pt: "Muito obrigado(a)" },
    { jp: "すみません", romaji: "Sumimasen", pt: "Com licença / Desculpe" },
    { jp: "はじめまして", romaji: "Hajimemashite", pt: "Prazer em conhecer" },
    { jp: "よろしくお願いします", romaji: "Yoroshiku onegaishimasu", pt: "Por favor, cuide bem de mim / Conto com você" },
    { jp: "いただきます", romaji: "Itadakimasu", pt: "Bom apetite (antes de comer)" },
    { jp: "ごちそうさまでした", romaji: "Gochisousama deshita", pt: "Obrigado pela refeição" }
  ],

  // Desafio: Construtor de Frases (Ordenação de Sentenças N5)
  sentences: [
    {
      id: "s1",
      level: "Iniciante",
      pt: "Eu estudo japonês.",
      audio: "わたしはにほんごをべんきょうします",
      romaji: "Watashi wa nihongo o benkyou shimasu.",
      blocks: ["わたしは", "にほんごを", "べんきょう", "します"],
      explanation: "わたしは (Eu + partícula de tópico 'wa') + にほんごを (Língua japonesa + partícula de objeto direto 'o') + べんきょう します (Faço estudo)."
    },
    {
      id: "s2",
      level: "Iniciante",
      pt: "Eu como sushi.",
      audio: "すしをたべます",
      romaji: "Sushi o tabemasu.",
      blocks: ["すしを", "たべます"],
      explanation: "No japonês, o verbo sempre vai no final da frase! (Sushi [objeto] + tabemasu [comer])."
    },
    {
      id: "s3",
      level: "Iniciante",
      pt: "Isto é um livro.",
      audio: "これはほんです",
      romaji: "Kore wa hon desu.",
      blocks: ["これは", "ほん", "です"],
      explanation: "これ (Isto) + は (partícula de tópico) + ほん (Livro) + です (é/ser cortês)."
    },
    {
      id: "s4",
      level: "Intermediário",
      pt: "Amanhã vou para a escola.",
      audio: "あした がっこうへ いきます",
      romaji: "Ashita gakkou e ikimasu.",
      blocks: ["あした", "がっこうへ", "いきます"],
      explanation: "あした (Amanhã) + がっこうへ (Para a escola - a partícula へ/e indica direção) + いきます (Vou)."
    },
    {
      id: "s5",
      level: "Intermediário",
      pt: "Eu bebo água todos os dias.",
      audio: "まいにち みずを のみます",
      romaji: "Mainichi mizu o nomimasu.",
      blocks: ["まいにち", "みずを", "のみます"],
      explanation: "まいにち (Todos os dias) + みずを (Água + partícula 'o') + のみます (Bebo)."
    },
    {
      id: "s6",
      level: "Intermediário",
      pt: "O professor é uma boa pessoa.",
      audio: "せんせいは いい ひと です",
      romaji: "Sensei wa ii hito desu.",
      blocks: ["せんせいは", "いい", "ひと", "です"],
      explanation: "せんせいは (O professor) + いい (bom/boa) + ひと (pessoa) + です (é)."
    }
  ],

  // Para quem já sabe um pouco: Kanjis Compostos (Jukugo 熟語)
  compoundKanji: [
    {
      kanji: "日本人",
      kana: "にほんじん (nihonjin)",
      pt: "Pessoa japonesa / Cidadão japonês",
      breakdown: "日 (Sol) + 本 (Origem) + 人 (Pessoa) = Pessoa da terra do sol nascente"
    },
    {
      kanji: "火山",
      kana: "かざん (kazan)",
      pt: "Vulcão",
      breakdown: "火 (Fogo) + 山 (Montanha) = Montanha de fogo"
    },
    {
      kanji: "大学",
      kana: "だいがく (daigaku)",
      pt: "Universidade",
      breakdown: "大 (Grande) + 学 (Estudo/Aprender) = O grande estudo"
    },
    {
      kanji: "先生",
      kana: "せんせい (sensei)",
      pt: "Professor / Mestre",
      breakdown: "先 (Antes/Preceder) + 生 (Nascer/Vida) = Aquele que nasceu antes de você"
    },
    {
      kanji: "地下鉄",
      kana: "ちかてつ (chikatetsu)",
      pt: "Metrô subterrâneo",
      breakdown: "地 (Terra) + 下 (Abaixo) + 鉄 (Ferro) = Ferrovia embaixo da terra"
    },
    {
      kanji: "花火",
      kana: "はなび (hanabi)",
      pt: "Fogos de artifício",
      breakdown: "花 (Flor) + 火 (Fogo) = Flores de fogo no céu"
    }
  ],

  // Guia Amigável: Para quem não sabe NADA (Zero Absoluto)
  beginnerGuide: [
    {
      title: "1. Os 3 Sistemas de Escrita",
      desc: "O japonês usa três alfabetos juntos! **Hiragana** (sons nativos e gramática), **Katakana** (palavras estrangeiras como café e anime) e **Kanji** (ideogramas que representam ideias e significados inteiros)."
    },
    {
      title: "2. A Ordem Sagrada das 5 Vogais",
      desc: "Em japonês, a ordem é sempre **A, I, U, E, O**. Elas nunca mudam de som! O 'U' soa suave (como bico leve) e o 'E' soa sempre aberto como 'é'."
    },
    {
      title: "3. A Estrutura da Frase: Verbo no Final!",
      desc: "Em português dizemos: 'Eu [bebo] água'. Em japonês, o verbo vai no final: 'Eu água [bebo]'. As pequenas partículas (como は 'wa' e を 'o') conectam as palavras."
    }
  ],

  // Conquistas Gamificadas (Badges)
  achievementsList: [
    { id: "first_audio", title: "Primeiro Som", desc: "Ouviu sua primeira pronúncia em japonês", icon: "🎵" },
    { id: "quiz_completed", title: "Guerreiro do Quiz", desc: "Completou seu primeiro quiz avaliativo", icon: "⚔️" },
    { id: "perfect_quiz", title: "Sensei da Perfeição", desc: "Acertou 100% de um quiz de 10 perguntas", icon: "🏆" },
    { id: "calligraphy_master", title: "Pincel de Ouro", desc: "Praticou caligrafia no Dojo interativo", icon: "🖌️" },
    { id: "memory_winner", title: "Mente Brilhante", desc: "Venceu uma partida do Jogo da Memória", icon: "🎴" },
    { id: "speed_runner", title: "Veloz como Shinkansen", desc: "Acertou 8+ respostas no Modo Contra o Tempo", icon: "🚅" },
    { id: "sentence_builder", title: "Gramático N5", desc: "Montou sua primeira frase japonesa correta", icon: "🧩" },
    { id: "notebook_used", title: "Anotador Dedicado", desc: "Criou sua primeira anotação no Caderno de Estudos", icon: "📓" }
  ],

  // 1. Vocabulário Básico Essencial (Para Iniciantes Absolutos)
  beginnerVocab: [
    { jp: "ねこ (猫)", romaji: "neko", pt: "Gato", category: "Animais" },
    { jp: "いぬ (犬)", romaji: "inu", pt: "Cachorro", category: "Animais" },
    { jp: "とり (鳥)", romaji: "tori", pt: "Pássaro", category: "Animais" },
    { jp: "さかな (魚)", romaji: "sakana", pt: "Peixe", category: "Animais" },
    { jp: "みず (水)", romaji: "mizu", pt: "Água", category: "Comidas & Bebidas" },
    { jp: "お茶 (おちゃ)", romaji: "ocha", pt: "Chá verde", category: "Comidas & Bebidas" },
    { jp: "ごはん (ご飯)", romaji: "gohan", pt: "Arroz cozido / Refeição", category: "Comidas & Bebidas" },
    { jp: "にく (肉)", romaji: "niku", pt: "Carne", category: "Comidas & Bebidas" },
    { jp: "パン", romaji: "pan", pt: "Pão", category: "Comidas & Bebidas" },
    { jp: "あか (赤)", romaji: "aka", pt: "Vermelho", category: "Cores" },
    { jp: "あお (青)", romaji: "ao", pt: "Azul", category: "Cores" },
    { jp: "しろ (白)", romaji: "shiro", pt: "Branco", category: "Cores" },
    { jp: "くろ (黒)", romaji: "kuro", pt: "Preto", category: "Cores" },
    { jp: "きいろ (黄色)", romaji: "kiiro", pt: "Amarelo", category: "Cores" },
    { jp: "いえ (家)", romaji: "ie", pt: "Casa", category: "Lugares" },
    { jp: "えき (駅)", romaji: "eki", pt: "Estação de trem", category: "Lugares" },
    { jp: "がっこう (学校)", romaji: "gakkou", pt: "Escola", category: "Lugares" },
    { jp: "みせ (店)", romaji: "mise", pt: "Loja / Restaurante", category: "Lugares" }
  ],

  // 2. Guia de Caracteres Confusos: "Cuidado com os Gêmeos!"
  confusingKana: [
    {
      pair: "さ (sa)  vs  ち (chi)",
      type: "Hiragana",
      tip: "さ (sa) tem o laço virado para a DIREITA (lembre-se de 'SAvonete'). ち (chi) tem o laço virado para a ESQUERDA (parece o número 5 ao contrário!)."
    },
    {
      pair: "れ (re)  vs  ね (ne)  vs  わ (wa)",
      type: "Hiragana",
      tip: "れ (re) termina com a perninha virada para fora. ね (ne) termina com um nó/lacinho no final (como o rabo de um gato, 'neko'). わ (wa) termina redondinho e suave."
    },
    {
      pair: "は (ha)  vs  ほ (ho)",
      type: "Hiragana",
      tip: "ほ (ho) tem um 'chapéu' horizontal em cima que cobre o caractere; は (ha) é aberto no topo sem tampa."
    },
    {
      pair: "シ (shi)  vs  ツ (tsu)",
      type: "Katakana",
      tip: "Dica de ouro: em シ (shi), os traços começam de BAIXO para cima (como uma garota olhando para cima). Em ツ (tsu), os traços caem de CIMA para baixo (como uma gota de chuva caindo!)."
    },
    {
      pair: "ソ (so)  vs  ン (n)",
      type: "Katakana",
      tip: "ソ (so) é mais vertical (o traço longo desce de cima). ン (n) é mais inclinado e sobe de baixo para a direita."
    }
  ],

  // 3. Para Intermediários/Avançados: As 4 Formas Verbais Sagradas (JLPT N5/N4)
  verbForms: [
    {
      verb: "食べる (taberu - comer)",
      group: "Grupo 2 (Ichidan)",
      dictionary: "たべる (taberu)",
      masu: "たべます (tabemasu - como)",
      te: "たべて (tabete - comendo / coma por favor)",
      nai: "たべない (tabenai - não como)",
      ta: "たべた (tabeta - comi)"
    },
    {
      verb: "飲む (nomu - beber)",
      group: "Grupo 1 (Godan)",
      dictionary: "のむ (nomu)",
      masu: "のみます (nomimasu - bebo)",
      te: "のんで (nonde - bebendo / beba)",
      nai: "のまない (nomanai - não bebo)",
      ta: "のんだ (nonda - bebi)"
    },
    {
      verb: "行く (iku - ir)",
      group: "Grupo 1 (Godan)",
      dictionary: "いく (iku)",
      masu: "いきます (ikimasu - vou)",
      te: "いって (itte - indo / vá)",
      nai: "いかない (ikanai - não vou)",
      ta: "いった (itta - fui)"
    },
    {
      verb: "見る (miru - ver/olhar)",
      group: "Grupo 2 (Ichidan)",
      dictionary: "みる (miru)",
      masu: "みます (mimasu - vejo)",
      te: "みて (mite - olhando / olhe)",
      nai: "みない (minai - não vejo)",
      ta: "みた (mita - vi)"
    },
    {
      verb: "する (suru - fazer)",
      group: "Irregular",
      dictionary: "する (suru)",
      masu: "します (shimasu - faço)",
      te: "して (shite - fazendo / faça)",
      nai: "しない (shinai - não faço)",
      ta: "した (shita - fiz)"
    },
    {
      verb: "来る (kuru - vir)",
      group: "Irregular",
      dictionary: "くる (kuru)",
      masu: "きます (kimasu - venho)",
      te: "きて (kite - vindo / venha)",
      nai: "こない (konai - não venho)",
      ta: "きた (kita - vim)"
    },
    {
      verb: "飲む (nomu - beber)",
      group: "Grupo 1 (Godan)",
      dictionary: "のむ (nomu)",
      masu: "のみます (nomimasu - bebo)",
      te: "のんで (nonde - bebendo / beba)",
      nai: "のまない (nomanai - não bebo)",
      ta: "のんだ (nonda - bebi)"
    },
    {
      verb: "話す (hanasu - falar/conversar)",
      group: "Grupo 1 (Godan)",
      dictionary: "はなす (hanasu)",
      masu: "はなします (hanashimasu - falo)",
      te: "はなして (hanashite - falando / fale)",
      nai: "はなさない (hanasanai - não falo)",
      ta: "はなした (hanashita - falei)"
    },
    {
      verb: "読む (yomu - ler)",
      group: "Grupo 1 (Godan)",
      dictionary: "よむ (yomu)",
      masu: "よみます (yomimasu - leio)",
      te: "よんで (yonde - lendo / leia)",
      nai: "よまない (yomanai - não leio)",
      ta: "よんだ (yonda - li)"
    },
    {
      verb: "買う (kau - comprar)",
      group: "Grupo 1 (Godan)",
      dictionary: "かう (kau)",
      masu: "かいます (kaimasu - compro)",
      te: "かって (katte - comprando / compre)",
      nai: "かわない (kawanai - não compro)",
      ta: "かった (katta - comprei)"
    }
  ],

  // 4. Contadores Japoneses (Joushi 助数詞)
  counters: [
    {
      name: "〜つ (tsu)",
      usage: "Contador nativo geral (1 a 10 coisas)",
      items: "1: ひとつ (hitotsu) | 2: ふたつ (futatsu) | 3: みっつ (mittsu) | 4: よっつ (yottsu) | 5: いつつ (itsutsu)"
    },
    {
      name: "〜本 (ほん - hon)",
      usage: "Objetos compridos e cilíndricos (garrafas, canetas, árvores, dedos)",
      items: "1: いっぽん (ippon) | 2: にほん (nihon) | 3: さんぼん (sanbon) | 4: よんほん (yonhon) | 5: ごほん (gohon)"
    },
    {
      name: "〜枚 (まい - mai)",
      usage: "Objetos planos e finos (folhas de papel, camisas, pratos, ingressos)",
      items: "1: いちまい (ichimai) | 2: にまい (nimai) | 3: さんまい (sanmai) | 4: よんまい (yonmai) | 5: ごまい (gomai)"
    },
    {
      name: "〜人 (にん - nin)",
      usage: "Pessoas (atenção às exceções nos dois primeiros!)",
      items: "1: ひとり (hitori - 1 pessoa) | 2: ふたり (futari - 2 pessoas) | 3: さんにん (sannin) | 4: よにん (yonin)"
    },
    {
      name: "〜匹 (ひき - hiki)",
      usage: "Animais pequenos (gatos, cães, peixes, insetos)",
      items: "1: いっぴき (ippiki) | 2: にひき (nihiki) | 3: さんびき (sanbiki) | 4: よんひき (yonhiki)"
    },
    {
      name: "〜階 (かい - kai)",
      usage: "Andares de prédios e edifícios",
      items: "1: いっかい (ikkai - 1º andar) | 2: にかい (nikai) | 3: さんがい (sangai) | B1: ちかいっかい (chika ikkai - subsolo 1)"
    },
    {
      name: "〜歳 / 才 (さい - sai)",
      usage: "Idade de pessoas e animais (atenção especial a 20 anos!)",
      items: "1: いっさい (issai) | 10: じゅっさい (jussai) | 20: はたち (hatachi - maioridade tradicional)"
    },
    {
      name: "〜冊 (さつ - satsu)",
      usage: "Encadernados, livros, cadernos e volumes de mangá",
      items: "1: いっさつ (issatsu) | 2: にさつ (nisatsu) | 3: さんさつ (sansatsu) | 5: ごさつ (gosatsu)"
    },
    {
      name: "〜回 (かい - kai)",
      usage: "Contagem de frequência de vezes e repetições",
      items: "1: いっかい (ikkai - 1 vez) | 2: にかい (nikai - 2 vezes) | もういっかい (mou ikkai - mais uma vez!)"
    }
  ],

  // 5. Diálogos Práticos da Vida Real
  dialogues: [
    {
      title: "🍜 No Restaurante de Lámen em Tóquio",
      lines: [
        { speaker: "Cliente", jp: "すみません、みそラーメン を ひとつ ください。", romaji: "Sumimasen, miso raamen o hitotsu kudasai.", pt: "Com licença, um lámen de missô, por favor." },
        { speaker: "Atendente", jp: "かしこまりました！しょうしょう おまち ください。", romaji: "Kashikomarimashita! Shoushou omachi kudasai.", pt: "Entendido! Aguarde um momento, por favor." },
        { speaker: "Cliente", jp: "おかいけい を おねがいします。", romaji: "Okaikei o onegaishimasu.", pt: "A conta, por favor." }
      ]
    },
    {
      title: "🚉 Perguntando Direções na Estação de Trem",
      lines: [
        { speaker: "Viajante", jp: "すみません、ちかてつ の えき は どこ ですか？", romaji: "Sumimasen, chikatetsu no eki wa doko desu ka?", pt: "Com licença, onde fica a estação de metrô?" },
        { speaker: "Morador", jp: "あそこ です。まっすぐ いって ください。", romaji: "Asoko desu. Massugu itte kudasai.", pt: "É ali adiante. Por favor, vá em frente." },
        { speaker: "Viajante", jp: "どうも ありがとうございます！", romaji: "Doumo arigatou gozaimasu!", pt: "Muito obrigado(a)!" }
      ]
    },
    {
      title: "🏪 Na Loja de Conveniência (Conbini)",
      lines: [
        { speaker: "Atendente", jp: "いらっしゃいませ！おべんとう は あたためますか？", romaji: "Irasshaimase! Obentou wa atatamemasu ka?", pt: "Bem-vindo! Deseja esquentar a marmita?" },
        { speaker: "Cliente", jp: "はい、おねがいします。ふくろ も 1まい ください。", romaji: "Hai, onegaishimasu. Fukuro mo ichimai kudasai.", pt: "Sim, por favor. Uma sacola também, por favor." },
        { speaker: "Atendente", jp: "ぜんぶ で 750えん に なります。", romaji: "Zenbu de nanahyaku gojuu-en ni narimasu.", pt: "O total fica em 750 ienes." }
      ]
    },
    {
      title: "☕ Pedindo Café e Sobremesa em Shibuya",
      lines: [
        { speaker: "Atendente", jp: "ご注文 は お決まり ですか？", romaji: "Gochuumon wa okimari desu ka?", pt: "Já decidiu o seu pedido?" },
        { speaker: "Cliente", jp: "アイスコーヒー と 抹茶ケーキ を お願いします。", romaji: "Aisu koohii to matcha keeki o onegaishimasu.", pt: "Um café gelado e um bolo de matcha, por favor." },
        { speaker: "Atendente", jp: "店内 で お召し上がり ですか？", romaji: "Tennai de omeshagari desu ka?", pt: "Será para consumir aqui no local?" },
        { speaker: "Cliente", jp: "はい、ここで 食べます。", romaji: "Hai, koko de tabemasu.", pt: "Sim, vou comer aqui." }
      ]
    }
  ]
};


