import { language as reducer } from './language'
import gb from '../components/header/navigation/languageswitch/gb.svg'
import de from '../components/header/navigation/languageswitch/de.svg'
import cz from '../components/header/navigation/languageswitch/cz.svg'
import pl from '../components/header/navigation/languageswitch/pl.svg'
import sk from '../components/header/navigation/languageswitch/sk.svg'
import si from '../components/header/navigation/languageswitch/si.svg'

const initialState = {
  locale: 'en',
  availableLanguages: [
    { language: cz, title: 'Czech', locale: 'cs'},
    { language: gb, title: 'English', locale: 'en'},
    { language: de, title: 'German', locale: 'de'},
    { language: pl, title: 'Polish', locale: 'pl'},
    { language: sk, title: 'Slovakian', locale: 'sk'},
    { language: si, title: 'Slovenian', locale: 'sl'}
  ]
}


describe('language reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle CHANGE_LANGUAGE', () => {
    expect(
      reducer(initialState, {
        type: 'CHANGE_LANGUAGE',
        language: 'cs'
      })
    ).toEqual(
      {
        locale: 'cs',
        availableLanguages: initialState.availableLanguages
      }
    )


  })
})
