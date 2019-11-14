FROM ruby:2.6.5-alpine3.10

LABEL maintainer="Kento Yasuda <yasuda0216@srmtlab.org>"

ENV APP_DIR /opt/SelfcareSystem

WORKDIR ${APP_DIR}
RUN apk update \
    && apk add nodejs build-base mariadb-dev tzdata

ADD ./Gemfile ${APP_DIR}/Gemfile
ADD ./Gemfile.lock ${APP_DIR}/Gemfile.lock
RUN bundle install
