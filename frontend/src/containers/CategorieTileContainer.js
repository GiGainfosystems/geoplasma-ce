import { connect } from 'react-redux'
import BigTileThird from '../components/bigtile/BigTileThird'



const mapStateToProps = (state) => {
  return {
    categories: state.categories.main,
    pages: state.pages,
    language: state.language,
  }
}


const CategorieTileContainer = connect(
  mapStateToProps,
)(BigTileThird)

export default CategorieTileContainer
