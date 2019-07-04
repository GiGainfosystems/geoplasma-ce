/**
 * Search content of the knowledge repository based on tags
 * 
 * @param  {} tags - The tags
 */
export const tagSearch = (tags) => {
    return {
        type: 'TAG_SEARCH',
        tags: tags
    }
}

/**
 * Update the filters on the knowledge repository
 * 
 * @param  {} filter - The filter object with the status of the filters
 */
export const updateFilter = (filter) => {
    return {
        type: 'UPDATE_KNOWLEDGE_FILTER',
        filter: filter
    }
}

/** 
* Update the filters on the yellow pages
* 
* @param  {} filter - The filter object with the status of the filters
*/
export const updateYellowPagesFilter = (filter) => {
    return {
        type: 'UPDATE_YELLOW_PAGES_FILTER',
        filter: filter
    }
}

/** 
* Update the filters on the events page
* 
* @param  {} filter - The filter object with the status of the filters
*/
export const updateEventsFilter = (filter) => {
    return {
        type: 'UPDATE_EVENTS_FILTER',
        filter: filter
    }
}
