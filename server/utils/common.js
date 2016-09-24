import config from '../../config'
import __log from 'logfilename'


export const _log = (filename) => {
  return __log(filename, config.log)
}


