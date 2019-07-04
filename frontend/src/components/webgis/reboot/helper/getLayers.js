/**
 * Order the layers that were received from the backend to the menu structure
 * @param  {} layers
 */
export const getLayers = (layers) => {
    let reportLayers = [], gisLayers = [];
    let activeLayer = {};

    const response = {
        reportLayers,
        gisLayers,
        activeLayer
    }

    if(layers.length > 0) {
        layers.map(layer => {
            if(layer.children.length === 0) {
                if(layer.active) {
                    activeLayer = layer;
                    gisLayers.push(layer);
                    if(layer.report) {
                        reportLayers.push(layer);
                    }
                } else {
                    if(layer.report) {
                        reportLayers.push(layer);
                    }
                    if(layer.webgis) {
                        gisLayers.push(layer);
                    }
                }
            } else {
                let reportChildren = layer.children.filter(child => child.report === true);
                reportChildren.map(child => {
                    reportLayers.push(child);
                })

                let gisChildren = layer.children.filter(child => child.webgis === true);

                if(layer.children.filter(fil => fil.children.length > 0).length > 0) {   
                     
                    let temp = [];
                    layer.children.map(child => {
                        if(child.children.length > 0) {
                            temp.push(child.children)
                            reportChildren = child.children.filter(fil => fil.report === true)
                            reportChildren.map(child => {
                                reportLayers.push(child);
                            })
                        }
                    })
                    temp.map(t => {
                        if(t.filter(fil => fil.active === true).length > 0) {
                            gisChildren = gisChildren.concat(t.filter(child => child.webgis === true));     
                        }
                    })
                    
                }
                let gisActive = gisChildren.filter(child => ((child.active === true) && (child.children.length === 0)));
                
                if(gisChildren.length > 0) {
                    layer.gisChildren = gisChildren;
                    gisLayers.push(layer);
                }
                if(gisActive.length === 1) {
                    activeLayer = gisActive[0];
                    
                }
            }
        })
        response.activeLayer = activeLayer
        return response;
    } else {
        return response;
    }
}