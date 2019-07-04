import { GET_LAYERS_SUCCESS } from '../actions/types'

const initialState = {
    layers: [],
    area: undefined,
    bounds: undefined,
    activeLayer: undefined
};

/**
 * Reducer for the web gis state
 * @param  {} state=initialState
 * @param  {} action
 */
export const webgis = (state = initialState, action) => {
    switch (action.type) {

        case GET_LAYERS_SUCCESS:
            let layers = [];
            action.layers.map((layer, index) => {
                let active = layer.Abstract;
                let parent;
                let description = JSON.parse(layer.Abstract)


                let legend = layer.legend.filter(entry => entry.opacity !== "0.0");
                let temp = {
                    id: index,
                    name : layer.Title,
                    uri  : layer.Name,
                    active : description.default,
                    children: [],
                    parent: description.parent,
                    legend: legend,
                    height: description.height,
                    webgis: description.webgis,
                    report: description.report,
                    date: description.date,
                    filename: description.filename,
                    srs: description.srs,
                    conflicts: JSON.parse(description.conflict),
                    language1: description.language1,
                    language2: description.language2,
                    traffic_light_map_open_loop: description.traffic_light_map_open_loop,
                    traffic_light_map_closed_loop: description.traffic_light_map_closed_loop,
                    key: description.key,
                    group_key: description.group_key,
                    inspire: description.inspire,
                    short_description: {
                        [description.language1] : description.description_language1,
                        English : description.description_en,
                        [(description.language2 ? description.language2 : 'none')] : (description.language2 ? description.description_language2 : 'none'),
                    },
                    variable_type_of_cell_related_parameter: description.variable_type_of_cell_related_parameter,
                    unit_of_cell_related_parameter: description.unit_of_cell_related_parameter,
                    object_related_parameter_1: description.object_related_parameter_1,
                    unit_of_object_related_parameter_1: description.unit_of_object_related_parameter_1,
                    value_of_object_related_parameter_1: description.value_of_object_related_parameter_1,
                    object_related_parameter_2: description.object_related_parameter_2,
                    unit_of_object_related_parameter_2: description.unit_of_object_related_parameter_2,
                    data_type: description.data_type,
                    resource_format: description.resource_format,
                    author: description.author,
                    maintainer: description.maintainer,
                    maintainer_e_mail: description.maintainer_e_mail,
                    reference_system: description.reference_system,

                }

                if(temp.conflicts !== false) {
                    // Filter out legend entries that do not occur as a conflict on this layer
                    let filteredLegend = [];
                    temp.conflicts.map(conflict => {
                        temp.legend.map(entry => {
                            if(entry.quantity == conflict.category_on_the_conflict_map) {
                                filteredLegend.push(entry);
                            }
                        })
                        
                    })
                    if(layers.filter) {
                        temp.legend = filteredLegend;
                    }
                    temp.legend.map(entry => {
                        if(Number(entry.quantity) !== 0) {
                            entry.labels = {};
                            
                            let value = '';
                            let temparray = temp.conflicts.filter(conflict => conflict.category_on_the_conflict_map === Number(entry.quantity));
                            if(temparray.length > 0) {
                                value = temparray[0];
                            }

                            entry.labels.English = value.category_name_en;
                            entry.labels[temp.language1] = value.category_name_national_language_1;
                            if(temp.language2 !== null) {
                                entry.labels[temp.language2] = value.category_name_national_language_2;
                            }
                        }


                })
                }
                if((description.parent !== undefined) && (description.parent !== '')) {
                    if(layers.filter(layer => layer.name === description.parent).length > 0) {
                        let index = layers.indexOf(layers.filter(layer => layer.name === description.parent)[0]);
                        layers[index].children.push(temp);
                        if(temp.webgis) {
                            layers[index].webgis = true;
                        }
                        if(temp.active) {
                            layers[index].active = true;
                        }
                        layers[index].children.sort(function(a, b) {
                            return Number(a.height) - Number(b.height);
                        });
                    } else {

                        let newparent = {
                            id: index+100,
                            webgis: (description.webgis ? true : false),
                            name: description.parent,
                            uri: '',
                            group_key: description.group_key,
                            active : (temp.active ? true : false),
                            children: [
                                temp
                            ]
                        }
                        layers.push(newparent)
                    }
                } else {
                    layers.push(temp)
                }                
            })
            
            layers.map(layer => {
                let children = layer.children;
                children.map(child => {
                    const toBeGrouped = layer.children.filter(fil => (fil.key === child.key && fil.group_key !== "conflict_map"));
                    if(toBeGrouped.length > 1) {
                        const newparent = {
                            id: child.id+100,
                            name: child.parent,
                            key: child.key,
                            group_key: child.group_key,
                            children: toBeGrouped,
                            webgis: child.webgis,
                            active: false
                        }
                        let layersWithoutToBeGrouped = layer.children.filter(fil => fil.key !== child.key);
                        layersWithoutToBeGrouped.push(newparent);
                        layer.children = layersWithoutToBeGrouped
                    }
                })
            })
            return {
                layers: layers,
                area: state.area,
                bounds: state.bounds,
                activeLayer: state.activeLayer
            }
        case 'UPDATE_MAP_PROPS':
            return {
                layers: state.layers,
                area: action.area,
                bounds: action.bounds,
                activeLayer: action.selected_layer
            }
        default:
        return state;
    }
}
