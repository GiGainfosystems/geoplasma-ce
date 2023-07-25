FROM debian:bullseye-slim

LABEL maintainer GiGa infosystems <info@giga-infosystems.com>


RUN sed -i -e 's#http://deb.debian#http://ftp.de.debian#' /etc/apt/sources.list

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install \
    wget \
    gnupg \
    ca-certificates

RUN mkdir /gst/
RUN cd /gst/ && wget -O gst-server https://support.giga-infosystems.com/geoplasma/gst-server-3.3 && chmod +x gst-server

RUN mkdir -p /etc/GiGa/ssl
ADD config.toml /etc/GiGa/config.toml

RUN cd /etc/GiGa/ssl && openssl req -x509 -newkey rsa:4096 -keyout test.pem -out test_cert.pem -subj "/C=EU/ST=Geoplasma/L=Geoplasma/O=Geoplasma CE/OU=WPT1/CN=gst" -nodes -days 1095

RUN cd /etc/GiGa/ssl && openssl pkcs12 -export -inkey test.pem -in test_cert.pem -out server.p12 -password pass:G3opl4sma!

RUN cd /etc/GiGa/ssl && openssl x509 -inform PEM -in test_cert.pem -outform DER -out client.der

ADD https://support.giga-infosystems.com/updates/gst3/share/proj-6.3.0-share.tar.gz /usr/GiGa/share/
ADD https://support.giga-infosystems.com/updates/gst3/share/gdal-3.0.4-share.tar.gz /usr/GiGa/share/
RUN cd /usr/GiGa/share && tar -xf proj-6.3.0-share.tar.gz && tar -xf gdal-3.0.4-share.tar.gz

RUN adduser --system --group --no-create-home gst

RUN chown -R gst:gst /etc/GiGa/ /usr/GiGa/ /gst/gst-server

USER gst

CMD [ "/gst/gst-server", "--config", "/etc/GiGa/config.toml" ]