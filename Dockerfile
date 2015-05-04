FROM node:0.12

RUN apt-get update; apt-get install -y nginx

ADD api /srv/cashflow-api
ADD deploy/config.json /srv/cashflow-api/config.json
ADD deploy/bperCredentials.json /srv/cashflow-api/bperCredentials.json
ADD web/dist /srv/cashflow-web
ADD deploy/nginx-site /etc/nginx/sites-enabled/default
ADD deploy/start.sh /start.sh

EXPOSE 80

CMD /start.sh
