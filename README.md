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
docker-compose exec rails bundle exec rails generate controller コントローラ名
# 例
docker-compose exec rails bundle exec rails generate controller Home
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
- S'lounge
- Akira Kamiya
  
# LICENCE
- The MIT LICENCE (MIT)
