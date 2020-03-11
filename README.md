SelfcareSystem
====
Web application to support Developmental Disabilities.

## Requirement
- ruby 2.6.5
    - rails 5.2.3

## For developer
```
# create and launch development environment
git clone https://github.com/srmtlab/SelfcareSystem.git
cd SelfcareSystem
docker-compose up -d
docker-compose exec rails bundle exec rails db:create
docker-compose exec rails bundle exec rails s -p 3000 -b '0.0.0.0'

# launch development environment
docker-compose up -d
docker-compose exec rails bundle exec rails s -p 3000 -b '0.0.0.0'

# railsコンテナに入る
docker-compose exec rails sh

# MySqlコンテナに入る
docker-compose exec mysql sh
```

### generate Controller
コントローラーを作成して，ルーティング（/config/routes.rb）を編集すれば使えるようになります．
```
# railsコンテナに入る
docker-compose exec rails sh

bundle exec rails generate controller コントローラ名
# 例
bundle exec rails generate controller Home
```

### make Model
```
# railsコンテナに入る
docker-compose exec rails sh

# モデルを作成する
# モデルが作成された際に、マイグレーションファイル（DBの設計図のようなもの）も作成されます
bundle exec rails generate model モデル名

# 例 : Avatorモデルの作成
bundle exec rails generate model Avator

# migrate（MySQLにマイグレーションファイルの内容を適応する）
bundle exec rails db:migrate

-----------------------------
# カラムを追加する
bundle exec rails generate migration Addカラム名Toテーブル名
# 例 : Userモデルにnameカラムを追加
bundle exec rails generate migration AddNameToUsers
# 例 : Userモデルに複数のカラムを追加
bundle exec rails generate migration AddBasicInfoToUsers

# カラムを削除する
bundle exec rails g migration Removeカラム名Fromテーブル名



# migrate（MySQLにマイグレーションファイルの内容を適応する）
bundle exec rails db:migrate

```

### seedデータ（初期データ）の作り方
```
docker-compose exec rails sh

# db/seeds.rbを編集 : 参考にすること
bundle exec rails db:seed

```

#### 参考
- [コントローラの作成と命名規則(命名規約)](https://www.javadrive.jp/rails/controller/index1.html)
- [Rails generate の使い方とコントローラーやモデルの命名規則](https://qiita.com/higeaaa/items/96c708d01a3dbb161f20)

### ブランチのきり方
```
# shimizuブランチが作成され，自身もブランチの先へ移行する
git checkout -b shimizu

# ブランチの切り替え
git checkout develop
```

# Authors
- Kento Yasuda
- Yota Shimizu
 - [清水が担当したファイル等の説明テキストファイル](https://github.com/srmtlab/research_YotaShimizu/blob/master/SelfcareSystem%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6.txt)
- S'lounge
- Akira Kamiya
  
# LICENCE
- The MIT LICENCE (MIT)
