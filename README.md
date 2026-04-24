# CRM System - Multilingual Manufacturing Management Platform

[日本語](#日本語) | [English](#english) | [ไทย](#ไทย)

---

## 日本語

### 概要
このプロジェクトは、Google Apps Script を使った**完全無料のクラウドCRMシステム**です。Google Workspace Business Standard（貴社で既に契約済み）の範囲内で、追加料金なしに構築できます。

**三言語対応**：日本語・英語・タイ語をタブ切り替えで即座に変更可能です。

### 🎯 主な機能

| 機能 | 説明 |
|------|------|
| 📊 **ダッシュボード** | 今月の売上、目標達成率、パイプライン、期限超過タスク表示 |
| 🏢 **顧客管理** | 顧客情報の登録・編集・削除、検索・フィルタ |
| 📝 **活動履歴** | 面談・電話・メール・訪問などの接触記録 |
| 💼 **案件・商談** | RFQ管理、パイプライン管理（発掘→交渉→受注） |
| ✅ **タスク管理** | 優先度・期限・担当者の設定、完了追跡 |
| 📈 **レポート** | 月別売上、受注率、顧客別実績、目標対比分析 |
| 🎯 **売上目標** | 年月別の目標設定・実績管理 |
| 👥 **ユーザー管理** | 管理者による権限設定（管理者・マネージャー・営業） |

### 💻 対応デバイス
- ✅ パソコン（Windows/Mac）
- ✅ タブレット（iPad/Android）
- ✅ スマートフォン（iPhone/Android）

すべてのデバイスで同じURLを開くだけで、自動的に画面サイズに合わせて表示が最適化されます。

### 🚀 クイックスタート

1. **Google Apps Script プロジェクト作成**
   - Google Drive で「新規作成」→「Google Apps Script」
2. **コードをコピペ**
   - 7つのファイル（Code.gs, Database.gs, Index.html など）をApps Script にコピー
3. **デプロイ**
   - 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択
4. **初期化**
   - 表示された URL を開く
   - 「⚙️ 設定」→「🚀 スプレッドシートを作成」をクリック
5. **完成！**
   - ページをリロードして、すぐに使い始めます

### 📊 データベース
- **自動作成される Google Sheets**
  - Customers（顧客）
  - Activities（活動）
  - Deals（案件）
  - Tasks（タスク）
  - SalesTargets（売上目標）
  - Users（ユーザー）

### 👤 ユーザー権限

| 権限 | ダッシュボード | 顧客管理 | データ入力 | レポート | ユーザー管理 |
|------|:-:|:-:|:-:|:-:|:-:|
| **営業・購買** | ✅ | ✅ | ✅ | 📈 | ❌ |
| **マネージャー** | ✅ | 📋 | ❌ | ✅ | ❌ |
| **管理者** | ✅ | ✅ | ✅ | ✅ | ✅ |

### 📁 ファイル構成

```
CRM システム/
├── appsscript.json          # 設定ファイル
├── Code.gs                  # メイン処理（バックエンド）
├── Database.gs              # データベース操作
├── Index.html               # メイン画面のレイアウト
├── Stylesheet.html          # デザイン（CSS）
├── JavaScript.html          # 動作ロジック
├── i18n.html                # 言語対応
├── SETUP_GUIDE.md           # セットアップ手順（詳細）
├── TECHNICAL_DOCS.md        # 技術文書（開発者向け）
└── README.md                # このファイル
```

### 📖 ドキュメント

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - 初心者向けセットアップガイド（日本語・英語・タイ語）
  - 詳細なステップバイステップ手順
  - トラブルシューティング
  - FAQ

- **[TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)** - 開発者向け技術文書
  - システムアーキテクチャ
  - API仕様
  - 拡張方法

### 🌍 言語切り替え
ページ上部のタブ「JA」「EN」「TH」をクリックするだけで、瞬時に全画面の表示言語が切り替わります。

### 🔒 セキュリティ
- Google OAuth で自動認証（Google アカウントでログイン）
- ロールベースアクセス制御（役職に応じた機能制限）
- Google Drive との統合（企業のセキュリティ標準に準拠）

### 💡 使用例

**営業担当者の1日**
```
朝：ダッシュボード開く → 今日のタスク確認
↓
顧客と面談 → 「活動履歴」に記録
↓
見積依頼受け取る → 「案件」に RFQ 登録
↓
昼：進捗をマネージャーに報告 → レポートで実績確認
↓
タスク完了 → ステータス更新
```

**マネージャーの報告**
```
朝：ダッシュボード確認 → チームの進捗把握
↓
レポート作成 → 月別売上・目標達成率を可視化
↓
目標管理 → 来月の目標を設定・更新
↓
チーム分析 → 営業ごとの実績を把握
```

### ⚡ 特徴

✨ **完全無料** - Google Workspace の契約内で追加料金なし
✨ **シンプル** - プログラミング知識不要でデプロイ可能
✨ **実績データ付き** - 初回セットアップで自動的にサンプルデータを作成
✨ **リアルタイム同期** - 複数人が同時にアクセス可能
✨ **レスポンシブ** - すべてのデバイスで最適な表示
✨ **拡張可能** - Code.gs を編集してカスタマイズ可能

### 🤔 よくある質問

**Q: 本当に無料ですか？**
A: はい。Google Workspace Business Standard に含まれる Google Sheets と Apps Script の範囲内で、完全に無料です。

**Q: データはどこに保存されますか？**
A: Google Sheets（スプレッドシート）に保存されます。Google Drive のクラウドストレージを使用するため、コンピュータのディスク容量は不要です。

**Q: 複数人で同時に使えますか？**
A: はい。同じ URL を複数人で開くと、リアルタイムで同期されます。

**Q: スマートフォンで見づらい場合は？**
A: ブラウザのズーム機能（ピンチ）で調整してください。自動的にレスポンシブ対応しています。

**Q: カスタマイズしたいです**
A: Code.gs を編集することで、カスタマイズ可能です。詳しくは TECHNICAL_DOCS.md を参照してください。

### 📞 サポート

問題が発生した場合：
1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) のトラブルシューティングを確認
2. Google Apps Script のログを確認（View → Logs）
3. ブラウザのコンソール（F12）でエラーを確認

### 🔄 次のステップ

1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) を読んでセットアップ
2. アプリをデプロイして初期化
3. サンプルデータで機能を試す
4. チームメンバーに URL を共有
5. 実際のデータを入力開始

---

## English

### Overview
A **completely free cloud CRM system** built with Google Apps Script. Works within your existing Google Workspace Business Standard contract - no additional costs.

**Trilingual support**: Instant switching between Japanese, English, and Thai via tabs.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Monthly sales, achievement rate, pipeline, overdue tasks |
| 🏢 **Customers** | Register, edit, delete, search customer information |
| 📝 **Activities** | Record meetings, calls, emails, visits |
| 💼 **Deals & RFQ** | Manage sales opportunities and quotes |
| ✅ **Tasks** | Set priorities, deadlines, track completion |
| 📈 **Reports** | Monthly sales, win rate, customer rankings |
| 🎯 **Sales Targets** | Set and monitor monthly/yearly goals |
| 👥 **User Management** | Admin controls permissions (Admin/Manager/Sales) |

### 💻 Device Support
- ✅ Desktop (Windows/Mac)
- ✅ Tablet (iPad/Android)
- ✅ Mobile (iPhone/Android)

Opens in one URL, automatically optimizes for any screen size.

### 🚀 Quick Start (5 Minutes)

1. Open Google Drive → Create → Google Apps Script
2. Copy 7 files into Apps Script
3. Deploy as Web App
4. Open deployed URL → Click "Create Spreadsheet"
5. Done! Start using immediately

### 📊 Database (Auto-Created)
- Customers
- Activities
- Deals
- Tasks
- SalesTargets
- Users

All stored in Google Sheets automatically.

### 👤 User Roles

| Role | Dashboard | Customers | Data Entry | Reports | Admin |
|------|:-:|:-:|:-:|:-:|:-:|
| **Sales/Purchasing** | ✅ | ✅ | ✅ | 📈 | ❌ |
| **Manager** | ✅ | 📋 | ❌ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

### 📖 Documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed step-by-step setup instructions (JA/EN/TH)
- **[TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)** - Architecture & development guide

### 🌍 Language Switching
Click "JA", "EN", or "TH" tabs at the top - entire interface changes instantly.

### ⚡ Highlights
✨ Completely Free
✨ No programming knowledge needed
✨ Sample data included
✨ Real-time multi-user access
✨ Mobile responsive
✨ Customizable via Code.gs

---

## ไทย

### ภาพรวม
ระบบ CRM แบบ **ฟรีทั้งหมด** ที่สร้างด้วย Google Apps Script ทำงานได้ในสัญญา Google Workspace ที่คุณใช้อยู่แล้ว - ไม่มีค่าใช้งานเพิ่มเติม

**รองรับ 3 ภาษา**: เปลี่ยนภาษาได้ทันทีระหว่างไทย อังกฤษ และญี่ปุ่น

### 🎯 คุณสมบัติหลัก

| คุณสมบัติ | รายละเอียด |
|---------|----------|
| 📊 **แดชบอร์ด** | ยอดขายเดือน, ความสำเร็จ, ไปป์ไลน์, งานเกินกำหนด |
| 🏢 **จัดการลูกค้า** | เพิ่ม แก้ไข ลบ ค้นหา ข้อมูลลูกค้า |
| 📝 **ประวัติกิจกรรม** | บันทึกการประชุม โทรศัพท์ อีเมล การเยี่ยมชม |
| 💼 **ดีล & RFQ** | จัดการโอกาสการขาย และใบขอราคา |
| ✅ **งาน** | ตั้งค่าลำดับความสำคัญ กำหนดส่ง ติดตามความคืบหน้า |
| 📈 **รายงาน** | ยอดขายรายเดือน อัตราชนะ อันดับลูกค้า |
| 🎯 **เป้าหมายการขาย** | ตั้งเป้าและติดตามผลลัพธ์ |
| 👥 **จัดการผู้ใช้** | ควบคุมสิทธิ์การใช้งาน |

### 💻 รองรับอุปกรณ์
- ✅ คอมพิวเตอร์ (Windows/Mac)
- ✅ แท็บเล็ต (iPad/Android)
- ✅ มือถือ (iPhone/Android)

เปิด URL เดียวกัน - อินเทอร์เฟซปรับตัวอัตโนมัติ

### 🚀 เริ่มใช้งาน (5 นาที)

1. Google Drive → สร้างใหม่ → Google Apps Script
2. คัดลอกไฟล์ 7 ไฟล์ เข้า Apps Script
3. ปรับใช้เป็น Web App
4. เปิด URL ที่สร้าง → คลิก "Create Spreadsheet"
5. เสร็จแล้ว! ใช้งานได้ทันที

### 📖 เอกสารประกอบ
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - คำแนะนำตั้งค่า (JA/EN/TH)
- **[TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)** - เอกสารเทคนิค

### 🌍 การเปลี่ยนภาษา
คลิกแท็บ "JA", "EN", หรือ "TH" ที่ด้านบน - เปลี่ยนภาษาได้ทันที

### ⚡ จุดเด่น
✨ ฟรีทั้งหมด
✨ ใช้งานง่าย ไม่ต้องรู้เขียนโปรแกรม
✨ มีข้อมูลตัวอย่าง
✨ หลายคนใช้พร้อมกันได้
✨ ตอบสนองต่อการเปลี่ยนขนาดหน้าจอ
✨ ปรับแต่งได้

---

## 📋 Deployment Summary

**已完成 / Completed:**
- ✅ 7 backend/frontend files (Code.gs, Database.gs, HTML files)
- ✅ Multilingual interface (Japanese, English, Thai)
- ✅ Full CRUD operations for all modules
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dashboard with KPIs
- ✅ User authentication & role-based access
- ✅ Google Sheets database integration
- ✅ Sample data generation

**Location:**
- 📍 `/home/user/CODECRM/` - Source code
- 📍 Repository: `auryu-cyber/CODECRM` branch `claude/multilingual-crm-system-BSPRS`
- 📍 Repository: `auryu-cyber/CRM` branch `claude/multilingual-crm-system-BSPRS`

**To Deploy to Cloud:**
1. Follow steps in [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Copy all `.gs` and `.html` files to Google Apps Script
3. Deploy as Web App
4. Run the setup to auto-create database

---

**Created**: 2026-04-24
**Version**: 1.0
**License**: Internal Use
