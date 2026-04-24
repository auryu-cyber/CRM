# CRM System セットアップガイド / Setup Guide

## 日本語（Japanese）

このドキュメントでは、Google Apps ScriptのCRMシステムをデプロイ（つまり、使える状態にする）する方法を説明します。

### 準備するもの
- Google アカウント（Google Workspaceのビジネススタンダード契約）
- インターネット接続できるパソコン

### ステップ1: Google Apps Scriptプロジェクトを作成する

1. **Google Drive** を開く: https://drive.google.com
2. **新規作成** → **その他** → **Google Apps Script** をクリック
3. プロジェクト名を入力（例：「CRM システム」）
4. **保存** をクリック

### ステップ2: コードをコピーする

以下のファイルを、対応する場所にコピーペーストします：

#### ファイル一覧と説明

| ファイル名 | 役割 |
|-----------|------|
| **appsscript.json** | 設定ファイル（どのデータにアクセスするかを定義） |
| **Code.gs** | メイン処理（顧客、案件などのデータ管理） |
| **Database.gs** | Google Sheetsとの連携（データベース操作） |
| **Index.html** | メイン画面のレイアウト |
| **Stylesheet.html** | デザイン（色、大きさなど） |
| **JavaScript.html** | 動作ロジック（画面の切り替え、データ入出力など） |
| **i18n.html** | 言語設定（日本語、英語、タイ語） |

#### コピー方法

**appsscript.json をコピーする**
1. Google Apps Script のプロジェクトで、左側の「プロジェクト設定」をクリック
2. appsscript.json の内容を、表示された appsscript.json にペースト

**Code.gs をコピーする**
1. Google Apps Script で、新しいファイルを作成：**＋** → **スクリプト**
2. 名前を「Code」にする
3. Code.gs の内容をすべてコピーしてペースト

**Database.gs をコピーする**
1. もう一度 **＋** → **スクリプト** で新しいファイルを作成
2. 名前を「Database」にする
3. Database.gs の内容をコピーしてペースト

**HTML ファイルをコピーする（Index, Stylesheet, JavaScript, i18n）**
1. 左側の **ファイル** から、各ファイルを **＋** → **HTML** で作成
2. ファイル名を正確に設定：
   - `Index.html`
   - `Stylesheet.html`
   - `JavaScript.html`
   - `i18n.html`
3. それぞれの内容をコピーしてペースト

### ステップ3: 初回セットアップを実行する

1. Google Apps Script で、左側の **デプロイ** をクリック
2. **新しいデプロイ** をクリック
3. デプロイの種類：**ウェブアプリ**
4. 以下のように設定：
   - **実行者**：自分
   - **アクセスできるユーザー**：自分（テスト用）or 特定のユーザー（本番用）
5. **デプロイ** をクリック
6. 表示されたURLをコピー

### ステップ4: アプリを開く

1. デプロイしたURLをブラウザで開く
2. 画面右下の「⚙️ 設定」をクリック
3. **🚀 スプレッドシートを作成** ボタンをクリック
   - ⏳ 少し待つと、Google Sheets がおのずと作成される
4. セットアップ完了のメッセージが表示されたら、ページをリロード（F5キー）
5. これでアプリが使えます！

### 重要な設定

アプリを自分のチーム全体で使うようにする場合：

1. Google Apps Script で、**デプロイ** から設定を編集
2. **アクセスできるユーザー** を「**組織内の全員**」に変更
3. 保存

---

## English

This guide explains how to deploy (set up and make usable) the Google Apps Script CRM system.

### What You Need
- Google Account (Google Workspace Business Standard)
- Internet-connected computer
- Basic understanding of Google Docs/Drive

### Step 1: Create a Google Apps Script Project

1. Open **Google Drive**: https://drive.google.com
2. Click **Create** → **More** → **Google Apps Script**
3. Enter a project name (e.g., "CRM System")
4. Click **Save**

### Step 2: Copy Code Files

Copy each code file to the corresponding location in Apps Script:

#### File Reference

| Filename | Purpose |
|----------|---------|
| **appsscript.json** | Configuration (defines what data to access) |
| **Code.gs** | Main backend (customer, deal management) |
| **Database.gs** | Sheets integration (database operations) |
| **Index.html** | Main layout |
| **Stylesheet.html** | Styling (colors, sizes, responsive design) |
| **JavaScript.html** | Client logic (page switching, data I/O) |
| **i18n.html** | Language translations (JA/EN/TH) |

#### How to Copy

**For appsscript.json:**
1. In Apps Script, go to **Project Settings** (gear icon)
2. Replace the contents of appsscript.json with the new code

**For .gs files (Code.gs, Database.gs):**
1. Click **＋** → **Script**
2. Name it (e.g., "Code")
3. Replace the contents with the file code

**For .html files (Index, Stylesheet, JavaScript, i18n):**
1. Click **＋** → **HTML**
2. Name it exactly (e.g., "Index.html")
3. Paste the HTML file contents

### Step 3: Deploy the Project

1. Click **Deploy** in Apps Script
2. Click **New deployment**
3. Select **Web app** as type
4. Configure:
   - **Execute as**: Your email
   - **Who has access**: Me (for testing) or Organization (for full team)
5. Click **Deploy**
6. Copy the deployment URL

### Step 4: Initialize the Database

1. Open the deployment URL in your browser
2. Click **⚙️** (Settings) in sidebar
3. Click **🚀 Create Spreadsheet** button
4. Wait 30 seconds (it creates the database)
5. When you see the success message, refresh the page (Ctrl+R or Cmd+R)
6. Done! The app is ready to use

### To Share with Your Team

1. In Apps Script, go to **Deploy** settings
2. Change **Who has access** to **Organization** or **Specific users**
3. Share the deployment URL with team members

---

## ไทย

คู่มือนี้อธิบายวิธีการใช้งาน CRM System บน Google Apps Script

### สิ่งที่ต้องเตรียม
- บัญชี Google (สัญญา Google Workspace Business Standard)
- คอมพิวเตอร์ที่เชื่อมต่ออินเทอร์เน็ต

### ขั้นที่ 1: สร้างโปรเจค Google Apps Script

1. เปิด **Google Drive**: https://drive.google.com
2. คลิก **สร้างใหม่** → **อื่นๆ** → **Google Apps Script**
3. ป้อนชื่อโปรเจค (เช่น "CRM System")
4. คลิก **บันทึก**

### ขั้นที่ 2: คัดลอกไฟล์โค้ด

คัดลอกแต่ละไฟล์ลงใน Apps Script ตามลำดับที่กำหนด

#### รายการไฟล์

| ชื่อไฟล์ | วัตถุประสงค์ |
|---------|----------|
| **appsscript.json** | การตั้งค่า |
| **Code.gs** | ลอจิกหลัก |
| **Database.gs** | การเชื่อมต่อ Sheets |
| **Index.html** | เลย์เอาต์หลัก |
| **Stylesheet.html** | ตกแต่ง |
| **JavaScript.html** | ลอจิกส่วนหน้า |
| **i18n.html** | การแปลภาษา |

### ขั้นที่ 3: ปรับใช้ (Deploy)

1. คลิก **Deploy** ใน Apps Script
2. คลิก **New deployment**
3. เลือก **Web app**
4. ตั้งค่า:
   - **Execute as**: อีเมลของคุณ
   - **Who has access**: Me (ทดสอบ) หรือ Organization (ทั้งองค์กร)
5. คลิก **Deploy**
6. คัดลอก URL ที่ได้

### ขั้นที่ 4: เริ่มใช้งาน

1. เปิด URL ในเบราว์เซอร์
2. คลิก **⚙️** (Settings) ที่ด้านข้าง
3. คลิก **🚀 Create Spreadsheet**
4. รอ 30 วินาที
5. รีเฟรชหน้า (Ctrl+R หรือ Cmd+R)
6. เสร็จแล้ว! พร้อมใช้งาน

---

## 機能説明 / Feature Overview

### Dashboard (ダッシュボード)
- **実績数値表示**: 今月の受注額、パイプライン額、期限超過タスク数
- **達成率チャート**: 目標との比較ビジュアル
- **最近の活動**: 最新5件の活動履歴表示
- **案件ステージ別**: パイプライン内の案件を段階別に表示

### Customers (顧客管理)
- 顧客情報の追加・編集・削除
- 検索・フィルタリング機能
- ステータス管理（見込み客、取引中、取引停止）
- 担当者割り当て

### Activities (活動履歴)
- 顧客接触の記録（面談、電話、メール、訪問）
- 日付と詳細の記録
- 編集・削除機能

### Deals (案件・商談)
- 商談の進捗管理
- パイプラインステージ（発掘→検討→提案→交渉→受注/失注）
- RFQ番号の管理
- 確度（％）の記録
- 金額と見積通貨の記録

### Tasks (タスク)
- タスク作成・管理
- 優先度設定（高・中・低）
- ステータス管理（未対応→対応中→完了）
- 期限通知

### Sales Targets (売上目標)
- 年別・月別の目標設定
- 実績との比較表示
- 達成率の計算

### Reports (レポート)
- 月別売上グラフ
- 受注率（Win Rate）
- 顧客別売上ランキング
- 目標対比分析

### User Management (ユーザー管理) - 管理者のみ
- ユーザーの追加・編集
- 権限設定（管理者・マネージャー・営業）
- 言語設定（日本語・英語・タイ語）

---

## トラブルシューティング / Troubleshooting

### Q: スプレッドシートが自動作成されない
**A:** 以下を確認してください：
1. Apps Script の権限設定で「Spreadsheets」と「Drive」にチェックが入っているか
2. Google アカウントに Google Drive への書き込み権限があるか
3. ブラウザをリロード（F5）してからボタンをクリック

### Q: 言語が切り替わらない
**A:** 
1. ブラウザの開発者ツール（F12）コンソールをチェック
2. ページをハードリロード（Ctrl+Shift+R または Cmd+Shift+R）

### Q: スマートフォンで見づらい
**A:** このアプリはレスポンシブデザイン対応なので、ブラウザをズームアウト（ピンチ）して調整できます

### Q: チーム全体で使いたい
**A:** 
1. Apps Script で **Deploy** を開く
2. **Who has access** を「Organization」に変更
3. チーム全員に URL を共有

---

## よくある質問 / FAQ

**Q: データはどこに保存される？**
A: Google Sheets（スプレッドシート）に保存されます。Google Drive のスペースを使うため、追加料金はかかりません。

**Q: オフラインで使える？**
A: Google Sheets と Apps Script はオンラインが必須です。インターネット接続が必要です。

**Q: データのバックアップは？**
A: Google Sheets は自動的にバージョン履歴を保存するため、過去のデータを復元できます。

**Q: 複数人で同時編集できる？**
A: はい。複数人が同時にアクセスしても動作します。ただし、非常に多くの人が同時にアクセスするとやや遅くなる可能性があります。

**Q: カスタマイズできる？**
A: はい。Code.gs を編集してカスタマイズできます。開発経験のある方向けです。

---

## 次のステップ / Next Steps

1. ✅ アプリをデプロイ（完了）
2. ✅ スプレッドシート作成（完了）
3. 📋 サンプルデータで試す
4. 👥 チームメンバーを追加
5. 🔧 必要に応じてカスタマイズ
6. 📊 ダッシュボードで分析開始

---

## サポート / Support

問題が発生した場合：
1. このドキュメントの「トラブルシューティング」を確認
2. Google Apps Script コンソール（View → Logs）でエラーを確認
3. ブラウザの開発者ツール（F12）でエラーメッセージを確認
