
let config;
let url = window.location.href;
if(url.indexOf("localhost") !== -1) {
     config = {
        "apiBaseUrl" : "http://localhost/backend/public/",
        "geoServerUrl": "http://localhost:80",
        "downloadUrl" : "http://localhost/backend/storage/"
    }
} else if(url.indexOf("stage") !== -1) {
     config = {
        "apiBaseUrl" : "http://api-stage.geoplasma-ce.eu/",
        "geoServerUrl": "http://api-stage.geoplasma-ce.eu",
        "downloadUrl" : "https://downloads.geoplasma-ce.eu/"
    }
}
else {
     config = {
        "apiBaseUrl" : "https://api.geoplasma-ce.eu/",
        "geoServerUrl" : "https://api.geoplasma-ce.eu",
        "downloadUrl" : "https://downloads.geoplasma-ce.eu/"
    }
}



export default config;
