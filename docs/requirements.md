# トレーニング記録アプリケーション要件定義書

## 1. システム概要

### 1.1 目的
個人の筋力トレーニングを記録・管理するためのWebアプリケーション

### 1.2 システム構成図

```mermaid
graph TD
    User[ユーザー]
    Frontend[フロントエンド<br/>Next.js]
    Lambda[AWS Lambda]
    DB[(DynamoDB)]
    Route53[Route53]
    
    User -->|HTTPS| Route53
    Route53 --> Frontend
    Frontend --> Lambda
    Lambda --> DB
```

## 2. 機能要件

### 2.1 必須機能
```mermaid
mindmap
  root((トレーニング<br/>記録アプリ))
    トレーニング記録
      種目選択（プリセット）
      重量記録
      セット数記録
      回数記録
      メモ機能
    データ表示
      過去記録の閲覧
      グラフ化
    認証
      個人認証
    プリセット管理
      種目登録
        種目名設定
        デフォルトセット数設定
        デフォルト重量設定
        種目カテゴリ設定
      種目編集
        名前変更
        デフォルト値変更
      種目削除
    トレーニング実行
      セット数の自由な追加・削除
      重量・回数の自由な変更
      種目の追加・削除
      種目の順序変更
```

### 2.2 オプション機能
```mermaid
mindmap
  root((オプション機能))
    写真アップロード
      フォームチェック用
```

## 3. 非機能要件

### 3.1 性能要件
- レスポンス時間: 3秒以内
- 同時接続数: 1ユーザーのみ
- データ保存期間: バックアップ不要

### 3.2 セキュリティ要件
- HTTPS通信必須
- 個人認証必須
- 他者からのアクセス制限

### 3.3 ユーザビリティ要件
- レスポンシブデザイン対応（モバイルファースト）
- PCでのグラフ表示最適化
- 直感的な操作性

## 4. 開発要件

### 4.1 技術スタック
- フロントエンド: Next.js
- バックエンド: AWS Lambda
- データベース: DynamoDB
- DNS: Route53
- 認証: AWS Cognito

### 4.2 開発期間
- 目標: 1週間

### 4.3 開発優先順位
```mermaid
graph LR
    A[認証機能] --> B[基本的な記録機能]
    B --> C[プリセット機能]
    C --> D[グラフ表示機能]
    D --> E[写真アップロード機能]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
```

## 5. データモデル

### 5.1 基本構造
```mermaid
erDiagram
    USER ||--o{ WORKOUT : records
    WORKOUT ||--o{ EXERCISE : contains
    EXERCISE ||--o{ SET : has
    PRESET ||--o{ EXERCISE : uses
    CATEGORY ||--o{ PRESET : groups

    USER {
        string user_id
        string username
        string email
    }
    WORKOUT {
        string workout_id
        date date
        string memo
        string user_id
    }
    EXERCISE {
        string exercise_id
        string workout_id
        string preset_id
        string name
        number order
    }
    SET {
        string set_id
        string exercise_id
        number weight
        number reps
        number set_number
    }
    PRESET {
        string preset_id
        string name
        string description
        number default_sets
        number default_weight
        string category_id
        string user_id
    }
    CATEGORY {
        string category_id
        string name
        string user_id
    }
``` 

## 6. 技術アーキテクチャ

### 6.1 詳細構成図
```mermaid
graph TD
    User[ユーザー]
    Route53[Route53]
    APIGateway[API Gateway]
    Cognito[Cognito]
    NextLambda[Next.js Lambda]
    DynamoDB[(DynamoDB)]
    
    User -->|HTTPS| Route53
    Route53 --> APIGateway
    User -->|認証| Cognito
    APIGateway --> NextLambda
    NextLambda -->|認証確認| Cognito
    NextLambda --> DynamoDB
```

### 6.2 技術スタック詳細

#### アプリケーション（Lambda上のNext.js）
- **Next.js 14**
  - App Router
  - Server Components
  - @vendia/serverless-express でLambda対応
- **UI/コンポーネント**
  - TailwindCSS
  - Headless UI
  - React Hook Form（フォーム管理）
  - Chart.js（グラフ表示）
- **状態管理**
  - Server Components + Server Actionsの活用
  - Zustand（必要な場合のみクライアントステート用）

#### バックエンド構成
- **実行環境**
  - Node.js 20.x runtime
  - TypeScript
  - AWS SDK v3
- **API実装**
  - Next.js API Routes
  - Server Actions
  - API Gateway HTTP API

#### データベース（DynamoDB）
- **テーブル設計**
  ```
  WorkoutTable:
    PK: USER#${userId}
    SK: WORKOUT#${date}#${workoutId}
    GSI1PK: DATE#${date}
    GSI1SK: USER#${userId}
    
  ExerciseTable:
    PK: WORKOUT#${workoutId}
    SK: EXERCISE#${exerciseId}
    GSI1PK: USER#${userId}
    GSI1SK: DATE#${date}

  PresetTable:
    PK: USER#${userId}
    SK: PRESET#${presetId}
  ```

### 6.3 Lambda最適化設計
```mermaid
graph TD
    A[Next.jsアプリケーション] --> B[Lambda最適化]
    B --> C[コールドスタート対策]
    B --> D[バンドルサイズ最適化]
    B --> E[メモリ設定最適化]

    C --> C1[予備温機能利用]
    C --> C2[依存関係最小化]
    
    D --> D1[tree-shaking]
    D --> D2[動的インポート]
    
    E --> E1[1024MB以上設定]
    E --> E2[実行時間監視]
```

### 6.4 開発環境
- **必要なツール**
  - Node.js 20.x
  - TypeScript
  - AWS CLI

- **ローカル開発環境**
  ```mermaid
  graph TD
    A[開発環境] --> B[ローカル開発モード]
    A --> C[本番モード]
    
    B --> D[Next.js Dev Server]
    B --> E[DynamoDB Local]
    B --> F[Local認証]
    
    C --> G[Lambda]
    C --> H[DynamoDB]
    C --> I[Cognito]
  ```

- **開発モードの構成**
  - Next.js開発サーバー（`next dev`）
  - DynamoDB Localでデータベースをエミュレート
  - 認証は開発用の簡易認証に置き換え
  - 環境変数で切り替え（.env.development / .env.production）

- **開発からデプロイまでのフロー**
  ```mermaid
  graph LR
    A[ローカル開発] --> B[テスト]
    B --> C[ビルド]
    C --> D[Lambda用パッケージング]
    D --> E[デプロイ]
    
    subgraph ローカル環境
    A
    B
    end
    
    subgraph デプロイ準備
    C
    D
    end
    
    subgraph AWS環境
    E
    end
  ```

### 6.5 パフォーマンス最適化
- Lambda関数のメモリ: 1024MB以上を推奨
- 依存関係の最小化
- 画像最適化はNext.jsの機能を利用
- Server Componentsの積極的な活用でクライアントバンドルを最小化 

### 6.6 開発プロセス
- **ローカル開発手順**
  1. `npm run dev` でNext.js開発サーバー起動
  2. DynamoDB Localの起動
     ```bash
     docker run -p 8000:8000 amazon/dynamodb-local
     ```
  3. 開発用の環境変数設定
     ```
     # .env.development
     NEXT_PUBLIC_API_URL=http://localhost:3000/api
     DYNAMODB_ENDPOINT=http://localhost:8000
     AUTH_MODE=development
     ```

- **本番環境への移行手順**
  1. 本番用ビルド
     ```bash
     npm run build
     ```
  2. Lambda用パッケージング
     ```bash
     npm run package:lambda
     ```
  3. デプロイ
     ```bash
     npm run deploy
     ``` 