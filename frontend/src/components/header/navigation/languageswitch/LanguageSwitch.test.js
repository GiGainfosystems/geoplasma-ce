import React from 'react';
import { shallow } from 'enzyme';
import LanguageSwitch from './LanguageSwitch';
import gb from './gb.svg'
import de from './de.svg'
import cz from './cz.svg'
import pl from './pl.svg'
import sk from './sk.svg'
import si from './si.svg'

const languages = {
  activeLanguage: gb,
  activeLanguageTitle: 'English',
  availableLanguages: [
    { language: gb, title: 'English'},
    { language: cz, title: 'Czech'},
    { language: de, title: 'German'},
    { language: pl, title: 'Polish'},
    { language: sk, title: 'Slovakian'},
    { language: si, title: 'Slovenian'}
  ]
}

const languageSwitch = shallow(
  <LanguageSwitch language={languages} />
);

test('Submenu appears when active language is clicked', () => {



  expect(languageSwitch.state().submenu).toEqual(false);
  expect(languageSwitch.find('span').hasClass('not-turned')).toEqual(true);
  expect(languageSwitch.find('span').hasClass('turned-turned')).toEqual(false);

  languageSwitch.find('.language-switch-toggle').simulate('click');

  expect(languageSwitch.state().submenu).toEqual(true);
  expect(languageSwitch.find('span').hasClass('not-turned')).toEqual(false);
  expect(languageSwitch.find('span').hasClass('turned')).toEqual(true);

})
