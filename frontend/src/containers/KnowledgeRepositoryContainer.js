import { connect } from 'react-redux'
import KnowledgeRepository from '../components/knowledge/KnowledgeRepository'
import { tagSearch, updateFilter } from '../actions'
import { filterCategories, buildFilterbox } from '../components/filterbox/filterhelper'

const mapStateToProps = (state, ownProps) => {

    let contents = state.content

    // Filter the content based on the active filters and tags
    if(contents.length > 0) {
        contents = filterCategories(contents, state.filter.knowledge.filters)

        let results = [];
        state.filter.knowledge.tags.map((tag, index) => {
            if(index === 0) {
                results = contents.filter(content => content.tags.indexOf(tag) !== -1);
            } else {
                results = results.filter(content => content.tags.indexOf(tag) !== -1);

            }
            contents = results;
        })

        // Get the topic names for each topic ID
        contents.map((content) => {
            let topics = [];
            content.topics.map((topic, index) => {
                if(topic !== 0) {
                    let temp = state.topics.filter(tpic => tpic.id === topic);
                    if(temp.length > 0) {
                        topics.push(temp[0].title);
                    }

              }
          })
              content.categories = topics;
        })

    }

  return {
    user: state.user,
    contents: contents,
    languages: state.language.availableLanguages,
    topics:  state.topics,
    pages: state.pages,
    language: state.language,
    fetching: state.fetching,
    tags: state.tags,
    filter : state.filter.knowledge,
    page: Number(ownProps.match.params.page-1)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tagSearch: (tags) => {
      dispatch(tagSearch(tags))
  },
  updateFilter: (filter) => {
    dispatch(updateFilter(filter))
  }
  }
}

const KnowledgeRepositoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeRepository)

export default KnowledgeRepositoryContainer
