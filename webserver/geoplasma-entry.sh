#!/bin/sh
docker-php-ext-install gd 
#DATADIR='/var/lib/postgresql/postgresqldata'
#export DATADIR=$DATADIR
#mkdir -p $DATADIR
#chown -R postgres:postgres $DATADIR
#su postgres -c '/usr/lib/postgresql/9.6/bin/initdb $DATADIR'
#sed -i "s#host    all             all             127.0.0.1/32            md5#host    all             all             127.0.0.1/32            trust#g" $DATADIR/pg_hba.conf
#su postgres -c '/usr/lib/postgresql/9.6/bin/pg_ctl start -w -l /var/log/postgresql/postgresql.log -D $DATADIR'
#su postgres -c "createuser geoplasma -s"
#su postgres -c "createuser gst -s"
#su postgres -c "createdb geoplasma"
#su postgres -c "createdb gst"
#su postgres -c "psql -d geoplasma -c \"CREATE EXTENSION postgis;\""
#/gst/gst-server --config /etc/GiGa/config.toml > /var/log/gst.log 2>&1 &
service apache2 start
service cron start
#su tomcat -c /home/tomcat/tomcat/output/build/bin/startup.sh
#touch $GEOSERVER_DATA_DIR/logs/geoserver.log
#chown -R tomcat:www-data $GEOSERVER_DATA_DIR
#chmod g+w $GEOSERVER_DATA_DIR
#chmod o+x /home/tomcat
#chmod o+x /home/tomcat/tomcat
#chmod o+x /home/tomcat/tomcat/output/build/webapps
#chmod o+x /home/tomcat/tomcat/output/build/webapps/geoserver
#chown tomcat:tomcat $GEOSERVER_DATA_DIR/logs/geoserver.log

cp /var/www/html/backend/.env-geoplasma /var/www/html/backend/.env
chown -R www-data:www-data /var/www/html
chgrp -R www-data /var/www/html/backend
chgrp -R www-data /var/www/html/frontend
chgrp -R www-data /var/www/html/content
chmod g+w /var/www/html/content
cd /var/www/html/backend/
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider"
../composer.phar install
../composer.phar update

tail -f /var/log/apache2/error.log
