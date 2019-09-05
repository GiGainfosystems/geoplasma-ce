#!/bin/bash
branch=$1
ssh_auth_sock=/tmp/ssh-fY8WXoXn5yzr/agent.19604
alias docker='sudo docker'

if [ "$branch" == 'master' ]; then
    # remove the old image and kill all geoplasmas running
    # that might fail so we continue with true anyway
    docker rm $(docker kill geoplasma) || true

    # build a new image and save it as geoplasma:v1
    docker build --build-arg ACTIVATE_SSL=true -t geoplasma:v1 .
    # start a screen in detached state which is called geoplasa
    # in that screen start docker and run the container geoplasma:v1
    # name the run geoplasma and forward local port 80 and 443 to the docker
    #screen -dmS geoplasma /usr/bin/sudo
    docker run -h "geoplasma" -p 80:80 -p 443:443 --name geoplasma -d -v /var/geoplasma/data:/var/lib/postgresql/postgresqldata -v /var/geoplasma/uploadContent:/var/www/html/content -v /var/geoplasma/geoserver_data:/var/lib/geoserver_data -v /var/geoplasma/geoplasma/letsencrypt:/etc/letsencrypt -v $(pwd)/backend:/var/www/html/backend -v $(pwd)/frontend:/var/www/html/frontend -v /var/geoplasma/license:/etc/GiGa/license -v /var/geoplasma/gstdata:/var/lib/gstdata -v /var/geoplasma/backup:/public geoplasma:v1
elif [ "$branch" == 'stage' ]; then
    docker rm $(docker kill geoplasma-staging) || true

    # build a new image and save it as geoplasma:v2
    docker build -t geoplasma:v2 .
    docker build -t geoplasma:staging -f Dockerfile-staging .
    #docker run -p 8080:8080 -p 8081:8081 --name geoplasma-staging -d -v /var/geoplasma/data:/var/lib/postgresql/postgresqldata geoplasma:staging
    docker run -h "geoplasma-staging" -p 9000:9000 -p 9001:9001 --name geoplasma-staging -d -v $(dirname $ssh_auth_sock):$(dirname $ssh_auth_sock) -e SSH_AUTH_SOCK=$ssh_auth_sock -v /var/geoplasma/data_dev:/var/lib/postgresql/postgresqldata -v /var/geoplasma/uploadContent_dev:/var/www/html/content -v /var/geoplasma/geoserver_data_dev:/var/lib/geoserver_data -v $(pwd)/backend:/var/www/html/backend -v $(pwd)/frontend:/var/www/html/frontend -v /var/geoplasma/license:/etc/GiGa/license -v /var/geoplasma/gstdata_dev:/var/lib/gstdata geoplasma:staging
else
    echo "Usage $0 branch"
    exit 1
fi
