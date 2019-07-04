const initialState = {
    main: [
          { title: 'knowledgerepository.title', icon: 'book', description: 'knowledgerepository.teaser', linktitle: 'knowledgerepository.link', link : '/experts/knowledge-repository'},
          { title: 'yellowpages.title', icon: 'address-book', description: 'yellowpages.teaser', linktitle: 'yellowpages.link', link : '/experts/yellow-pages'},
          { title: 'events.title', icon: 'calendar-alt', description: 'events.teaser', linktitle: 'events.link', link : '/experts/events'}
      ],
  knowledgerepository: [
      { id: 1, title: "Literature" },
      { id: 2, title: "Guideline" },
  ]
}
/**
 * Categories reducer - Main categories for the knowledge platform
 * @param  {} state=initialState
 * @param  {} action
 */
export const categories = (state = initialState, action) => {
  switch(action.type) {
    default:
      return state;
  }
}
