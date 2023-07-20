FROM php:7.2-apache-stretch
CMD ["/bin/bash"]
# the following fixes some issues with GBA's proxy and firewall, c.f. https://askubuntu.com/a/809808/648883
RUN echo "Acquire::http::Pipeline-Depth 0;" >> /etc/apt/apt.conf.d/99fixbadproxy
RUN echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99fixbadproxy
RUN echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99fixbadproxy
RUN echo "Acquire::https::No-Cache true;" >> /etc/apt/apt.conf.d/99fixbadproxy
# GBA's firewall doesn't allow some access, so we tell the host where to look for it
RUN echo "portal.geoplasma-ce.eu" >> /etc/hosts
RUN echo "api.geoplasma-ce.eu" >> /etc/hosts
RUN apt-get update && apt-get install -y wget gnupg
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" >> /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get update && apt-get install -y \ 
    postgresql-server-dev-9.6 postgresql-9.6 postgresql-9.6-postgis-2.4 postgresql-9.6-postgis-2.4-scripts \
    unzip ssh rsync gdal-bin zlib1g-dev libpng-dev ant openjdk-8-jre-headless openjdk-8-jdk-headless \
    librsvg2-2 librsvg2-bin libshp2 \
    libboost-chrono1.62.0 \
    libboost-date-time1.62.0 \
    libboost-filesystem1.62.0 \
    libboost-iostreams1.62.0 \
    libboost-program-options1.62.0 \
    libboost-random1.62.0 \ 
    libboost-regex1.62.0 \
    libboost-serialization1.62.0 \
    libboost-system1.62.0 \ 
    libboost-thread1.62.0
RUN docker-php-ext-install pgsql pdo pdo_pgsql zip

RUN adduser --system --shell /bin/bash --gecos 'Tomcat Java Servlet and JSP engine' --group --disabled-password --home /home/tomcat tomcat
USER tomcat
RUN wget https://github.com/apache/tomcat/archive/8.5.32.tar.gz -O /tmp/tomcat.tar.gz
RUN cd /tmp && tar xvf tomcat.tar.gz
RUN mv /tmp/tomcat-8.5.32 /home/tomcat/tomcat
RUN echo "base.path=/home/tomcat/tomcat" > /home/tomcat/tomcat/build.properties
## FIX the dependency of tomcat
RUN sed -i -e 's/commons-daemon.version=1.1.0/commons-daemon.version=1.2.0/' /home/tomcat/tomcat/build.properties.default
RUN cd /home/tomcat/tomcat/ && ant

RUN wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.6.2/geoserver-2.6.2-war.zip -O /tmp/geoserver.zip
#RUN wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.11.0/geoserver-2.11.0-war.zip -O /tmp/geoserver.zip
RUN unzip -q /tmp/geoserver.zip -d /tmp
RUN mv /tmp/geoserver.war /home/tomcat/tomcat/output/build/webapps/

USER root
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

RUN echo "post_max_size=125M;" >> /usr/local/etc/php/conf.d/php.ini
RUN echo "upload_max_filesize=100M;" >> /usr/local/etc/php/conf.d/php.ini

RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2enmod proxy proxy_ajp proxy_http proxy_connect

RUN cd /usr/bin/ && wget https://dl.eff.org/certbot-auto && chmod +x certbot-auto
ARG ACTIVATE_SSL
RUN test -z "$ACTIVATE_SSL" || echo "17 0 * * * root /usr/bin/certbot-auto renew" >> /etc/crontab && :
RUN test -z "$ACTIVATE_SSL" || echo "17 12 * * * root /usr/bin/certbot-auto renew" >> /etc/crontab && :

ADD 001.api.geoplasma.dev.conf /etc/apache2/sites-available/
ADD 001.api.geoplasma.dev.ssl.conf /etc/apache2/sites-available/
ADD 002.frontend.geoplasma.dev.conf /etc/apache2/sites-available/
ADD 002.frontend.geoplasma.dev.ssl.conf /etc/apache2/sites-available/
ADD 003.api-stage.geoplasma.dev.conf /etc/apache2/sites-available/
ADD 004.frontend-stage.geoplasma.dev.conf /etc/apache2/sites-available/
ADD 006.downloads.geoplasma.conf /etc/apache2/sites-available/
ADD 006.downloads.geoplasma.ssl.conf /etc/apache2/sites-available/

RUN a2ensite 001.api.geoplasma.dev.conf
RUN a2ensite 001.api.geoplasma.dev.ssl.conf
RUN a2ensite 002.frontend.geoplasma.dev.conf
RUN a2ensite 002.frontend.geoplasma.dev.ssl.conf
RUN a2ensite 003.api-stage.geoplasma.dev.conf
RUN a2ensite 004.frontend-stage.geoplasma.dev.conf
RUN a2ensite 006.downloads.geoplasma.conf
RUN a2ensite 006.downloads.geoplasma.ssl.conf

RUN mkdir /var/www/.ssh
ADD id_rsa /var/www/.ssh/id_rsa
RUN touch /var/www/.ssh/known_hosts
RUN chown -R www-data:www-data /var/www/.ssh
RUN chmod 700 /var/www/.ssh
RUN chmod 600 /var/www/.ssh/id_rsa
RUN chmod 660 /var/www/.ssh/known_hosts

# make the data in database persiting, this will be handled by docker itself
VOLUME ["/var/www/html/backend"]
VOLUME ["/var/www/html/frontend"]
VOLUME ["/var/lib/postgresql/postgresqldata"]
VOLUME ["/var/www/html/content"]
VOLUME ["/etc/letsencrypt"]
VOLUME ["/var/lib/gstdata"]
ENV GEOSERVER_DATA_DIR /var/lib/geoserver_data
VOLUME ["/var/lib/geoserver_data"]
#EXPOSE 80 8080 8778 5432
EXPOSE 80 443 5432
ADD geoplasma-entry.sh /usr/local/bin/geoplasma-entry.sh
RUN chmod +x /usr/local/bin/geoplasma-entry.sh
#ENTRYPOINT ["/usr/local/bin/geoplasma-entry.sh"]
CMD ["/usr/local/bin/geoplasma-entry.sh"]
#CMD ["/bin/bash"]

## docker build -t geoplasma:v1 .
## docker run -p 80:80 -p 5432:5432 -p 8080:8080 -p 8778:8778 -it geoplasma:v1
## docker run -p 80:80 -p 5434:5432 -p 8080:8080 -p 8778:8778 -it -v /home/ubuntu/data/geoplasma/:/var/www/html/ geoplasma:v1
## docker run -p 80:80 -v /home/ubuntu/data/geoplasma/:/var/www/html/ geoplasma:v1

RUN ls
#RUN apt-get update && apt-get install -y cmake-curses-gui libboost-all-dev librsvg2-2 librsvg2-bin librsvg2-dev libshp2 libshp-dev libxerces-c-dev libsqlite3-dev libssl-dev libssl-doc sqlite3 vim build-essential default-libmysqlclient-dev libcurl4-openssl-dev

RUN mkdir /gst/
RUN cd /gst/ && wget -O gst-server https://support.giga-infosystems.com/geoplasma/gst-server-3.3 && chmod +x gst-server
RUN cd /gst && wget -O lib.tar.bz2 https://support.giga-infosystems.com/geoplasma/lib-3.3.tar.bz2
RUN cd /gst && tar -xjf lib.tar.bz2

RUN echo "/gst/lib/" >> /etc/ld.so.conf.d/gst.conf
RUN echo "extension=/gst/lib/libphplib.so" >> /usr/local/etc/php/conf.d/gst.ini
RUN ldconfig

RUN mkdir -p /etc/GiGa/ssl
ADD config.toml /etc/GiGa/config.toml

RUN cd /etc/GiGa/ssl && openssl req -x509 -newkey rsa:4096 -keyout test.pem -out test_cert.pem -subj "/C=EU/ST=Geoplasma/L=Geoplasma/O=Geoplasma CE/OU=WPT1/CN=localhost" -nodes -days 1095

RUN cd /etc/GiGa/ssl && openssl pkcs12 -export -inkey test.pem -in test_cert.pem -out server.p12 -password pass:G3opl4sma!

RUN cd /etc/GiGa/ssl && openssl x509 -inform PEM -in test_cert.pem -outform DER -out client.der