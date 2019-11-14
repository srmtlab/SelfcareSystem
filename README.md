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
docker-compose exec rails bundle exec rails db:create
docker-compose exec rails bundle exec rails s -p 3000 -b '0.0.0.0'
```

# Authors
- Kento Yasuda
- Yota Shimizu
- S'lounge
- Akira Kamiya
  
# LICENCE
- The MIT LICENCE (MIT)
