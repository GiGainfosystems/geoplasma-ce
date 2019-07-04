import getTranslation from '../i18n'

const initialState = {
    knowledge : {
        filters: [
            {
                label: getTranslation("forms.contentform.language.label"),
                title: 'language',
                field: 'languages',
                filter: [],
                single: true,
                additionalFilter: true
            },
            {
                label: getTranslation("forms.contentform.thematic_coverage.label"),
                title: 'topics',
                field: 'topics',
                filter: [],
                single: false
            }
        ],
        tags: []
    },
    profiles: [
        {
            label: getTranslation('userprofile.form.group.label'),
            title: 'occupation',
            field: 'professionalgroups',
            filter: [],
            single: true
        },
        {
            label: getTranslation('userprofile.form.country.label'),
            title: 'country',
            field: 'countries',
            filter: [],
            single: true
        }
    ],
    events: [
        {
            label: getTranslation('userprofile.form.country.label'),
            title: 'country',
            field: 'countries',
            filter: [],
            single: true
        }
    ]
}

/**
 * Reducer for the filters of the knowledge platform
 * @param  {} state=initialState
 * @param  {} action
 */
export const filter = (state = initialState, action) => {
  switch(action.type) {

      case 'TAG_SEARCH':
        return {
            knowledge: {
                filters: state.knowledge.filters,
                tags: action.tags
            },
            profiles: state.profiles,
            events: state.events
        }

    case 'UPDATE_KNOWLEDGE_FILTER':
      return {
          knowledge: {
              filters: action.filter,
              tags: state.knowledge.tags
          },
          profiles: state.profiles,
          events: state.events
      }

      case 'UPDATE_YELLOW_PAGES_FILTER':
        return {
            knowledge: state.knowledge,
            profiles: action.filter,
            events: state.events
        }

    default:
      return state;
  }
}
