import en from './en/en'
import de from './de/de'
import pl from './pl/pl'
import sk from './sk/sk'
import sl from './sl/sl'
import cs from './cs/cs'
import {store} from "../index";


export const getTranslation = (key, variable) => {
  const locale = store.getState().language.locale;
  let string;
  if(locale === 'en') { string = findString(key, en) }
  else if(locale === 'de') { string = findString(key, de) }
  else if(locale === 'cs') { string = findString(key, cs) }
  else if(locale === 'pl') { string = findString(key, pl) }
  else if(locale === 'sk') { string = findString(key, sk) }
  else if(locale === 'sl') { string = findString(key, sl) }
  else { string = findString(key, en) }

  if(string === null) {
      string = '';
  }

  if(variable) {
      string = string.replace("{variable}", variable);
  }

  string = string.split("###").join("</p><p>");

  return string;
}

const findString = (key, language) => {
    let string = language.filter(string => string.key === key);
    if(string.length > 0) {
        string = string[0].string;
    } else {
        let string_english = en.filter(string => string.key === key);
        if(string_english.length > 0) {
            string = string_english[0].string;
        } else {
            string = '#String error#';
        }
    }
    return string;
}

export default getTranslation
