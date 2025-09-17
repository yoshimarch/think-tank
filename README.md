# Think-Tank リンク集

GitHub Issues + GitHub Actionsを使った概念理解支援リンク集システム

## 🚀 セットアップ手順

1. このリポジトリをforkまたはclone
2. GitHub Pagesを有効化
3. Issuesを有効化
4. GitHub Actionsの権限設定
5. データ追加は指定フォーマットでIssueを作成

## 📁 プロジェクト構造

```
think-tank/
├── index.html          # メインページ
├── assets/
│   ├── style.css      # スタイルシート
│   └── script.js      # JavaScript
├── data/
│   └── links.json     # リンクデータ
├── .github/
│   └── workflows/
│       └── update-links.yml  # GitHub Actions
└── README.md          # このファイル
```

## 🔧 リンク追加方法

新しいリンクを追加するには、以下のフォーマットでIssueを作成してください：

**タイトル**: `[ADD LINK] ページタイトル`

**本文**:
```
URL: https://example.com
ハッシュタグ: 概念,理解,学習
```

## 📝 データ形式

```json
{
  "id": "unique_id",
  "title": "ページタイトル", 
  "url": "https://example.com",
  "hashtags": ["概念", "理解", "学習"],
  "created_at": "2025-09-16T12:00:00Z"
}
```

## 🌐 デモ

[https://yourusername.github.io/think-tank](https://yourusername.github.io/think-tank)
