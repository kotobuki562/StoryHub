import type { Prisma } from "@prisma/client"

const createCategories = (): Prisma.CategoryCreateInput[] => {
  const data: Array<{ category_title: string }> = [
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
  return data
}

export { createCategories }
