# Think-Tank セットアップガイド

## 🚀 初期設定手順

### 1. リポジトリの準備
1. このコードをGitHubリポジトリにアップロード
2. リポジトリ名を `think-tank` に設定（推奨）

### 2. GitHub Pagesの有効化
1. GitHubリポジトリの `Settings` > `Pages` に移動
2. Source を `Deploy from a branch` に設定
3. Branch を `main` / `(root)` に設定
4. `Save` をクリック

### 3. Issuesの有効化
1. リポジトリの `Settings` > `General` に移動
2. Features セクションで `Issues` にチェック

### 4. GitHub Actionsの権限設定
1. `Settings` > `Actions` > `General` に移動
2. `Workflow permissions` を `Read and write permissions` に設定
3. `Allow GitHub Actions to create and approve pull requests` にチェック

### 5. カスタマイズ
`README.md` の以下の部分を編集：
- `yourusername` を実際のGitHubユーザー名に変更
- リポジトリ名が `think-tank` 以外の場合は適切に変更

## 📝 リンクの追加方法

### 方法1: GitHub Issues（推奨）
1. リポジトリの `Issues` タブをクリック
2. `New issue` ボタンをクリック
3. `新しいリンクを追加` テンプレートを選択
4. フォームに以下を入力：
   - **タイトル**: `[ADD LINK] ページタイトル`
   - **URL**: 追加したいWebページのURL
   - **ハッシュタグ**: カンマ区切りで関連タグを入力
5. `Submit new issue` をクリック

**例**:
```
タイトル: [ADD LINK] MDN Web Docs - Web開発学習の決定版
本文:
URL: https://developer.mozilla.org/ja/
ハッシュタグ: Web開発,JavaScript,学習,リファレンス
```

### 方法2: 直接編集
1. `data/links.json` ファイルを直接編集
2. 新しいリンクオブジェクトを配列の先頭に追加
3. 変更をコミット・プッシュ

## 🔧 カスタマイズ方法

### サイトタイトルの変更
`index.html` の以下を編集：
```html
<title>Think-Tank - 概念理解支援リンク集</title>
<h1 class="header-title">Think-Tank</h1>
<p class="header-subtitle">概念理解・学習支援リンク集</p>
```

### 色・デザインの変更
`assets/style.css` のCSS変数を編集：
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --bg-color: #f7fafc;
}
```

### GitHubリンクの更新
`index.html` のフッター部分を編集：
```html
<a href="https://github.com/yourusername/think-tank/issues" target="_blank">
```

## 📊 データ形式

リンクデータは以下の形式で保存されます：

```json
{
  "id": "unique_id",
  "title": "ページタイトル",
  "url": "https://example.com",
  "hashtags": ["タグ1", "タグ2", "タグ3"],
  "created_at": "2025-09-16T12:00:00Z"
}
```

## 🛠️ トラブルシューティング

### リンクが追加されない場合
1. Issue のタイトルが `[ADD LINK]` で始まっているか確認
2. URL が `https://` または `http://` で始まっているか確認
3. GitHub Actions の権限設定を確認
4. `Actions` タブでワークフローのログを確認

### サイトが表示されない場合
1. GitHub Pages が有効化されているか確認
2. デプロイまで数分かかることがある
3. ブラウザのキャッシュをクリア
4. `https://yourusername.github.io/think-tank/` でアクセス

### 検索が動作しない場合
1. ブラウザの開発者ツールでJavaScriptエラーを確認
2. `data/links.json` の形式が正しいか確認
3. HTTPS環境での利用を推奨

## 🎯 運用のベストプラクティス

### リンクの品質管理
- 概念理解や学習に役立つサイトを選別
- 適切なハッシュタグを設定
- 重複するURLは自動的にスキップされる

### ハッシュタグの統一
- 似たような概念には同じタグを使用
- 日本語と英語の混在を避ける
- 具体的で検索しやすいタグを選択

### 定期的なメンテナンス
- リンク切れのチェック
- 古い情報の更新
- 人気のないタグの整理

## 🔒 セキュリティ

- GitHub Actions は自動的にセキュアに実行
- Issue作成は GitHub アカウントが必要
- 悪意のあるリンクは手動で削除可能

## 📱 PWA対応（将来の拡張）

現在のコードには PWA の基盤が含まれています：
- Service Worker の登録準備
- レスポンシブデザイン
- オフライン対応の準備

## 🌐 公開URL例

設定完了後、以下のURLでアクセス可能：
- `https://yourusername.github.io/think-tank/`
- カスタムドメインも設定可能