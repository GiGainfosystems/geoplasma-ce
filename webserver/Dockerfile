FROM php:7.2-apache-stretch

# the following fixes some issues with GBA's proxy and firewall, c.f. https://askubuntu.com/a/809808/648883
RUN echo "Acquire::http::Pipeline-Depth 0;" >> /etc/apt/apt.conf.d/99fixbadproxy &&\
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99fixbadproxy &&\
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99fixbadproxy &&\
    echo "Acquire::https::No-Cache true;" >> /etc/apt/apt.conf.d/99fixbadproxy
# GBA's firewall doesn't allow some access, so we tell the host where to look for it

# make sure to use the archives
# I don't know where that buser list is coming from
RUN rm -rf /etc/apt/sources.list.d/buster.list &&\
    sed -i \
    -e 's#stretch-updates#stretch-backports#g' /etc/apt/sources.list \
    -e 's#deb http://deb#deb http://archive#g' /etc/apt/sources.list \
    -e 's#deb http://security#deb http://archive#g' /etc/apt/sources.list

# make sure we can smoothly install libpq-dev, c.f. https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=863199
RUN mkdir -p /usr/share/man/man1 && mkdir -p /usr/share/man/man7

RUN echo "portal.geoplasma-ce.eu" >> /etc/hosts &&\
    echo "api.geoplasma-ce.eu" >> /etc/hosts

RUN apt-get update && apt-get install -y \ 
    gnupg libpq-dev wget certbot \
    libcurl4-gnutls-dev \
    unzip ssh rsync zlib1g-dev libpng-dev \
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

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" &&\
    php composer-setup.php &&\
    php -r "unlink('composer-setup.php');"

RUN echo "post_max_size=125M;" >> /usr/local/etc/php/conf.d/php.ini &&\
    echo "upload_max_filesize=100M;" >> /usr/local/etc/php/conf.d/php.ini

RUN a2enmod ssl rewrite proxy proxy_ajp proxy_http proxy_connect

ARG ACTIVATE_SSL
RUN test -z "$ACTIVATE_SSL" || echo "17 0 * * * root /usr/bin/certbot renew" >> /etc/crontab && :
RUN test -z "$ACTIVATE_SSL" || echo "17 12 * * * root /usr/bin/certbot renew" >> /etc/crontab && :

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
RUN touch /var/www/.ssh/known_hosts &&\
    chown -R www-data:www-data /var/www/.ssh &&\
    chmod 700 /var/www/.ssh &&\
    chmod 600 /var/www/.ssh/id_rsa &&\
    chmod 660 /var/www/.ssh/known_hosts

VOLUME ["/var/www/html/backend"]
VOLUME ["/var/www/html/frontend"]

VOLUME ["/var/www/html/content"]
VOLUME ["/etc/letsencrypt"]


EXPOSE 80 443 
ADD geoplasma-entry.sh /usr/local/bin/geoplasma-entry.sh
RUN chmod +x /usr/local/bin/geoplasma-entry.sh

CMD ["/usr/local/bin/geoplasma-entry.sh"]

RUN mkdir /gst/ && cd /gst &&\
    wget -O lib.tar.bz2 https://support.giga-infosystems.com/geoplasma/lib-3.3.tar.bz2 &&\
    tar -xjf lib.tar.bz2

RUN echo "/gst/lib/" >> /etc/ld.so.conf.d/gst.conf &&\
    echo "extension=/gst/lib/libphplib.so" >> /usr/local/etc/php/conf.d/gst.ini &&\
    ldconfig

