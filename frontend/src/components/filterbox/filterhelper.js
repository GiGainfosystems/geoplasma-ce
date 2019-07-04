import getTranslation from '../../i18n/'

export const filterCategories = (profiles, filters) => {
        
        let result = [];
        let nofilter = true;
        let noresult = false;
        filters.map(filter => {
            if(!noresult) {

                if(filter.filter.length > 0) {

                    nofilter = false;
                    let singleresult = [];
                    let empty = true;
                    let saved_results = [];
                    filter.filter.map(item => {
                        let temp;

                        if(!filter.single) {
                            if(result.length === 0) {

                                temp = profiles.filter(profile => profile[filter.title].indexOf(item) !== -1);
                            } else {
                                temp = result.filter(profile => profile[filter.title].indexOf(item) !== -1);
                            }

                        } else {
                            if(Array.isArray(profiles[0][filter.title])) {

                                temp = profiles.filter(profile => profile[filter.title].indexOf(item) !== -1);
                            } else {
                                temp = profiles.filter(profile => Number(profile[filter.title]) === item);

                            }

                        }


                          if(temp.length !== 0) {
                              temp.map(item => {
                                  let checkifdouble = saved_results.filter(saved => saved === item.id);
                                  if(checkifdouble.length === 0) {
                                      saved_results.push(item.id)
                                      singleresult = singleresult.concat(item)
                                  }


                              })

                              empty = false;
                          } else {
                              noresult = true;
                          }
                    })
                    if(empty) {
                        result = [];
                    } else {
                        result = singleresult;
                    }
                }
            }
        })
        if(!nofilter) {
            profiles = result;
        }

    return profiles;
}


export const buildFilterbox = (filteritems, fields) => {

    let filters = []
    let activefilters = filteritems.map((filter, index) => {
        let fieldname = filter.field;
        let temp = {};
        temp.id = index;
        temp.filter = [];
        temp.title = filter.label;
        temp.single = filter.single
        if(filter.fullLayout) {
            temp.fullLayout = true
        } else {
            temp.fullLayout = false
        }
        if(filter.additionalFilter) {
            temp.additionalFilter = true
        } else {
            temp.additionalFilter = false
        }
        if(fields) {
            fields[fieldname].map(field => {

                let filterobjects = {};
                filterobjects.id = field.id;
                if(fieldname === 'countries') {
                    filterobjects.label = getTranslation(field.label);
                } else if(fieldname === 'languages') {
                    filterobjects.label = field.title;
                } else if(fieldname === 'topics') {
                    filterobjects.label = getTranslation(field.title);
                } else {
                    filterobjects.label = getTranslation(field.name);
                }

                filterobjects.active = false;
                filter.filter.map(singleton => {
                    if(singleton === field.id) {
                        filterobjects.active = true;
                    }
                })
                temp.filter.push(filterobjects);
            })
            filters.push(temp);
        }

    })

    return filters;
}
