/**
 * stream-http based logger
 */

import { logger } from '../utils/logger';
import http from 'stream-http';

const { performance } = window;

class StreamLoader {
  stats: any;
  req: any;
  destroy() {}

  abort() {
    var req = this.req;
    if (req) {
      req.abort();
    }
  }

  load(context, config, callbacks) {
    let stats: any = (this.stats = {
        trequest: performance.now(),
        retry: 0,
        loaded: 0,
        chunks: 0,
      }),
      headers: any = {};

    if (context.rangeEnd) {
      headers.Range =
        'bytes=' + context.rangeStart + '-' + (context.rangeEnd - 1);
    }

    this.req = http.get(
      {
        path: context.url,
        mode: 'allow-wrong-content-type',
        timeout: config.timeout,
      },
      function (res) {
        res.on('end', function () {
          stats.total = stats.loaded;
          stats.tload = Math.max(stats.tfirst, performance.now());
          callbacks.onSuccess(
            {
              url: context.url,
            },
            stats,
            context
          );
        });

        res.on('data', function (data) {
          stats.loaded += data.length;
          stats.chunks++;
          callbacks.onProgress(stats, context, data.buffer);
        });

        res.on('error', function (err) {
          callbacks.onError(
            {
              text: err.message,
            },
            context
          );
        });

        res.on('timeout', function () {
          logger.warn(`timeout while loading ${context.url}`);
          this.callbacks.onTimeout(stats, context, null);
        });
      }
    );
  }
}
export default StreamLoader;
