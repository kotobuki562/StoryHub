export const characterCategory: Array<{
  nameEn: string
  nameJa: string
  description: string
}> = [
  {
    nameEn: "MainCharacter",
    nameJa: "主人公",
    description: "物語の中心人物であり主役的存在",
  },
  {
    nameEn: "Heroine",
    nameJa: "ヒロイン",
    description: "物語の女主人公的存在",
  },
  {
    nameEn: "Rival",
    nameJa: "ライバル",
    description: "物語の競争相手・好敵手",
  },
  {
    nameEn: "Villian",
    nameJa: "ヴィラン",
    description: "物語の悪役。主人公と敵対する勢力",
  },
  {
    nameEn: "Friend",
    nameJa: "フレンド",
    description: "主人公に対して友好的な関係を築く存在",
  },
  { nameEn: "Family", nameJa: "ファミリー", description: "主人公の肉親" },
  {
    nameEn: "Sidekick",
    nameJa: "サイドキック",
    description: "主人公の相棒的存在",
  },
  {
    nameEn: "Mascot",
    nameJa: "マスコット",
    description: "物語に頻繁に出てくる小動物や象徴的な者",
  },
  {
    nameEn: "Mob",
    nameJa: "モブ",
    description: "物語において中心的な存在ではないもの",
  },
  {
    nameEn: "Mastermind",
    nameJa: "マスターマインド(黒幕)",
    description: "物語の黒幕・ボス的な存在",
  },
  {
    nameEn: "Narrator",
    nameJa: "語り部",
    description: "物語を進めるだけの存在",
  },
  { nameEn: "Other", nameJa: "その他", description: "その他" },
]

export const ageCategory: Array<{
  nameEn: string
  nameJa: string
  description: string
}> = [
  {
    nameEn: "G",
    nameJa: "G",
    description: "年齢を問わず、どなたでもご覧いただけます。",
  },
  {
    nameEn: "PG12",
    nameJa: "PG12",
    description: "12歳未満の方は、保護者の助言・指導が必要です。",
  },
  {
    nameEn: "R15+",
    nameJa: "R15+",
    description:
      "15歳以上の方がご覧いただけます。生年月日を確認できるものをご持参ください。",
  },
  {
    nameEn: "R18+",
    nameJa: "R18+",
    description:
      "18歳以上の方がご覧いただけます。生年月日を確認できるものをご持参ください。",
  },
]

export const genderArray: Array<{ name: string; description: string }> = [
  { name: "Agender", description: "無性別者" },
  { name: "Man", description: "男性" },
  {
    name: "Woman",
    description: "女性",
  },
  {
    name: "Androgyne",
    description: "両性。男性・女性のはっきりとした身体的区別のできない人。",
  },
  {
    name: "Androgynous",
    description: "両性的・中性的。性の差異を超えて自由な思考や行動をする人",
  },
  {
    name: "Bigender",
    description: "両方のジェンダーを自認して男性・女性を切り替えている人",
  },
  {
    name: "Cisgender",
    description: "身体的性別と自分の性認識が一致している人",
  },
  {
    name: "CisgenderWoman",
    description: "身体的性別が女性で自己を女性と認識している人",
  },
  {
    name: "CisgenderMan",
    description: "身体的性別が男性で自己を男性と認識している人",
  },
  {
    name: "CisMan",
    description: "身体的性別が男性で自己を男性と認識している人",
  },
  {
    name: "FemaleToMale",
    description: "身体的には女性であるが性自認が男性の人",
  },
  {
    name: "MaleToFemale",
    description: "身体的には男性であるが性自認が女性の人",
  },
  {
    name: "GenderFluid",
    description:
      "ジェンダーが流動的な人。自己意識として男性・女性の間を揺れ動いている状態で２重の生活をしている人",
  },
  {
    name: "GenderNonconForming",
    description:
      "包括的に(レズビアン・ゲイも含む)既存のジェンダー分類に当てはまらない人",
  },
  {
    name: "GenderQuestioning",
    description: "自分の性認識が未確定の人",
  },
  {
    name: "GenderVariant",
    description:
      "生物学的性や性自認と異なる人。同性愛者なども含めた広義の概念を持つ",
  },
  {
    name: "Genderqueer",
    description:
      "既存のジェンダー分類に当てはまらず、一言で表せない性・アイデンティティを持った人",
  },
  {
    name: "Intersex",
    description:
      "中間的な性・半陰陽者・両性具有者。遺伝子、染色体、性腺、内性・外性器などの一部またはすべてが非典型的である人",
  },
  {
    name: "Neither",
    description: "男性・女性のどちらでもない人",
  },
  {
    name: "Neutrois",
    description: "性別がないと自認している人。身体的無性になりたいと考える人",
  },
  {
    name: "Non-binary",
    description:
      "第３の性。ジェンダーを男性・女性に限定せず、両性が混合または中間的、もしくは全く違うものを感じる人",
  },

  {
    name: "Pangender",
    description:
      "性愛思考に関係なく、性別という概念を気にせずに自分を自由に捉えて扱っている人",
  },
  {
    name: "Trans",
    description: "性同一性障害。生まれ持った性と自認している性が一致しない人",
  },
  {
    name: "TransFemale",
    description: "身体は男性であるが性自認が女性の人",
  },
  {
    name: "TransMale",
    description: "身体は女性であるが性自認が男性の人",
  },
  {
    name: "TransPerson",
    description: "身体と心の性別に違和感・不一致感を持つ人",
  },
  {
    name: "Transgender",
    description:
      "性同一性障害。生まれついた性と自認している性が一致しない人たちの総称",
  },
  {
    name: "TransgenderFemale",
    description:
      "性不適合者で女性であると自認している人。広義では女性に性転換した人も含む",
  },
  {
    name: "TransgenderMale",
    description:
      "性不適合者で男性であると自認している人。広義では男性に性転換した人も含む",
  },
  {
    name: "TransgenderPerson",
    description: "性不適合者。広義では性転換した人も含む",
  },
  {
    name: "Transfeminine",
    description: "どちらかというと女性と自認しているトランスジェンダー",
  },
  {
    name: "Transmasculine",
    description: "どちらかというと男性と自認しているトランスジェンダー",
  },
  {
    name: "Transsexual",
    description: "性同一性障害で性別適合手術などにより身体の性転換を望む人",
  },
  {
    name: "TranssexualFemale",
    description: "性別適合手術などによって女性になった人",
  },
  {
    name: "TranssexualMale",
    description: "性別適合手術などによって男性になった人",
  },
  {
    name: "TranssexualPerson",
    description: "性転換者",
  },
  {
    name: "Two-spirit",
    description:
      "ネイティブ・アメリカンの伝統的に認識されてきた多様なジェンダー・ロール(性役割)を担う人",
  },
  {
    name: "Other",
    description: "その他",
  },
]

export const categories: Array<{ category_title: string }> = [
  { category_title: "大人向け" },
  { category_title: "青年向け" },
  { category_title: "女性向け" },
  { category_title: "男性向け" },
  { category_title: "子供向け" },
  { category_title: "フィクション" },
  { category_title: "ノンフィクション" },
  { category_title: "SF" },
  { category_title: "ホラー" },
  { category_title: "デスゲーム" },
  { category_title: "ファンタジー" },
  { category_title: "ダークファンタジー" },
  { category_title: "コメディ" },
  { category_title: "ラブコメディ" },
  { category_title: "ギャグ" },
  { category_title: "ブラックユーモア" },
  { category_title: "ヒューマンドラマ" },
  { category_title: "アクション" },
  { category_title: "アドベンチャー" },
  { category_title: "スポーツ" },
  { category_title: "ミステリー" },
  { category_title: "スチームパンク" },
  { category_title: "ディストピア" },
  { category_title: "ユートピア" },
  { category_title: "ピースフル" },
  { category_title: "エロス" },
  { category_title: "学園" },
  { category_title: "恋愛" },
  { category_title: "推理" },
  { category_title: "現実主義" },
  { category_title: "日常系" },
]
