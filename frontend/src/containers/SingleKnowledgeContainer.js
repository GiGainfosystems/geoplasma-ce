import { connect } from 'react-redux'
import SingleKnowledge from '../components/knowledge/SingleKnowledge'


const mapStateToProps = (state, ownProps) => {

    // Get the according result, depending on the ID in the URL
    let content = state.content.filter(content => content.id === Number(ownProps.match.params.id));

    // Check if result was found
    const notfound = ((content.length > 0) ? false : true)

    if(!notfound) {
        content = content[0]

        // Get the topic names based on their IDs that are given in the content
        let topics = [];
        content.topics.map((topic, index) => {
            if(topic !== 0) {
                let temp = state.topics.filter(tpic => tpic.id === topic);
                if(temp.length > 0) {
                    topics.push(temp[0].title);
                }
            }
            content.categories = topics;
        })
    }

  return {
    user: state.user,
    content: content,
    notfound: notfound,
    languages: state.language.availableLanguages,
    pages: state.pages,
    fetching: state.fetching,
    language: state.language,
    tags: state.tags
  }
}

const SingleKnowledgeContainer = connect(
  mapStateToProps,
)(SingleKnowledge)

export default SingleKnowledgeContainer
