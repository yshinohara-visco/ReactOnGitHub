# React で作成したページを GitHubPages で公開するプロジェクト

## 概要
Reactで作成した内容をGitHubPages上で見る事ができる。
ローカルでビルドとかしなくていいので、練習とか作例はこの形でGitHubに上げとけば見返す時とかに便利そう。  
ローカルでビルドするなら機能ごとにブランチを分けるのが肥大化せず整理できて好みだが、Pagesで扱うならフォルダ分けとReactRouterで切り替えられる形が良さそう。

## 初期化についての記録
ChatGpt に従い以下の手順で設定した。

✅ 前提条件
React プロジェクトが ~~create-react-app~~ npm create vite を使用して作成されている  
Node.js と npm がインストールされている  
GitHub アカウントを持っており、公開リポジトリを作成済みである

🚀 公開手順

1. gh-pages パッケージのインストール  
   プロジェクトディレクトリで以下のコマンドを実行して、gh-pages パッケージを開発依存としてインストールします。

        npm install --save-dev gh-pages

 2. package.json の設定  
a. homepage フィールドの追加
package.json に homepage フィールドを追加します。

        "homepage": "https://<GitHub ユーザー名>.github.io/<リポジトリ名>"

    例: ユーザー名が your-username、リポジトリ名が your-repo の場合:

        "homepage": "https://your-username.github.io/your-repo"

    (vite.config.jsonにbaseを書き足す必要があった)

        export default defineConfig({
            plugins: [react()],
            base: "/ReactOnGitHub/"
        })

    b. scripts セクションの更新  
package.json の scripts セクションに以下を追加します。

        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"

 3. GitHub リポジトリへのプッシュ  
プロジェクトを GitHub リポジトリにプッシュします。

        git init
        git remote add origin https://github.com/<GitHub ユーザー名>/<リポジトリ名>.git
        git add .
        git commit -m "Initial commit"
        git push -u origin main 4. デプロイの実行

 4. デプロイの実行  
    以下のコマンドでアプリケーションをビルドし、gh-pages ブランチにデプロイします。
    (ビルドした内容をブランチgh-pagesとしてプッシュするところまで纏めて実行される)

        npm run deploy

 5. GitHub Pages の設定  
GitHub のリポジトリページにアクセスします。  
「Settings」タブをクリックします。  
左側のメニューから「Pages」を選択します。  
「Source」セクションで「gh-pages」ブランチを選択し、「Save」をクリックします。  
数分後、https://<GitHub ユーザー名>.github.io/<リポジトリ名>/ でアプリケーションが公開されます。

gh-pages ブランチはデプロイ専用のブランチであり、通常の開発ブランチとは分けて管理されます。  
この手順に従うことで、React アプリケーションを簡単に GitHub Pages で公開できます。
