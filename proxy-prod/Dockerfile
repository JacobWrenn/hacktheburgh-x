FROM nginx:alpine

RUN mkdir -p /etc/letsencrypt

ADD /etc/letsencrypt/. /etc/letsencrypt/.
 
COPY nginx.conf /etc/nginx/nginx.conf