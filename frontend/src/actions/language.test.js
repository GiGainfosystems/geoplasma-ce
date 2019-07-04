import * as actions from './'
import { CHANGE_LANGUAGE } from './types'

describe('actions', () => {
  it('should create an action to change the language', () => {
    const language = {
      language: 'gb.svg',
      title: 'English'
    };

    const expectedAction = {
      type: CHANGE_LANGUAGE,
      language
    }
    expect(actions.changeLanguage(language)).toEqual(expectedAction)
  })
})
