import config from '../config/index'
import __log from 'logfilename'


export const _log = (filename) => {
  return __log(filename, config.log)
}


