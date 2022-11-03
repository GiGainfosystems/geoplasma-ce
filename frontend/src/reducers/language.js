import gb from '../components/header/navigation/languageswitch/gb.svg'
import de from '../components/header/navigation/languageswitch/de.svg'
import cz from '../components/header/navigation/languageswitch/cz.svg'
import pl from '../components/header/navigation/languageswitch/pl.svg'
import sk from '../components/header/navigation/languageswitch/sk.svg'
import si from '../components/header/navigation/languageswitch/si.svg'
import { CHANGE_LANGUAGE } from '../actions/types'

const initialState = {
  locale: 'en',
  availableLanguages: [
    { id: 1, language: cz, title: 'Czech', locale: 'cs'},
    { id: 2, language: gb, title: 'English', locale: 'en'},
    { id: 3, language: de, title: 'German', locale: 'de'},
    { id: 4, language: pl, title: 'Polish', locale: 'pl'},
    { id: 5, language: sk, title: 'Slovakian', locale: 'sk'},
    { id: 6, language: si, title: 'Slovenian', locale: 'sl'}
  ]
}

/**
 * Language reducer
 * @param  {} state=initialState
 * @param  {} action
 */
export const language = (state = initialState, action) => {
  switch(action.type) {
    case CHANGE_LANGUAGE:
      return {
        locale: action.language,
        availableLanguages: state.availableLanguages
      };

    default:
      return state;
  }
}
