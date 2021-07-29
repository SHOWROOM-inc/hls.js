/**
 * HTTP Loader
 * select best loader depending on browser capabilities
 * FetchLoader if fetch supported
 * XhrLoader otherwise
 */

import XhrLoader from '../utils/xhr-loader';
import FetchLoader from '../utils/fetch-loader';
import StreamLoader from './stream-loader';

class HTTPLoader {
  constructor(config, progressData = false) {
    if (progressData) {
      if (FetchLoader.isSupported()) {
        return new FetchLoader(config);
      } else {
        return new StreamLoader();
      }
    } else {
      return new XhrLoader(config);
    }
  }
}
export default HTTPLoader;
