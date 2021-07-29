/**
 * SHOWROOM固有のHLS config
 */

import XhrLoader from './utils/xhr-loader';
import HTTPLoader from './loader/http-loader';
const chromeOrFirefox = /chrome|firefox/.test(
  navigator.userAgent.toLowerCase()
);
// SHOWROOM固有の設定 (通常のHLSの再生の設定)
export const normalLiveConfig = {
  loader: XhrLoader,
  liveSyncDurationCount: 1,
  liveMaxLatencyDurationCount: 2,
  // force2LatestBuffer: false,
  forceStartLoad: false,
  enableLowLatencyPlayback: false,
  maxBufferLength: 10,
};

// SHOWROOM固有の設定 (低遅延HLSの再生の設定)
export let lowLatencyLiveConfig = {
  loader: HTTPLoader,
  liveSyncDurationCount: 1,
  liveMaxLatencyDurationCount: 2,
  // hls.js 内でブラウザにより自動で設定されるため外側からの指定は不要.
  // enableLowLatencyPlaybackをtrueにしない限りはtrueにならない.
  // force2LatestBuffer: false,
  // used by stream-controller, hls.js
  // 低遅延の再生機能を有効/無効の切り替え, hls.jsの初期化をする側で指定する必要がある.
  forceStartLoad: true,
  enableLowLatencyPlayback: true,
  maxBufferLength: 1,
};

if (!chromeOrFirefox) {
  lowLatencyLiveConfig = {
    loader: HTTPLoader,
    liveSyncDurationCount: 2,
    liveMaxLatencyDurationCount: 10,
    forceStartLoad: true,
    enableLowLatencyPlayback: true,
    maxBufferLength: 30,
  };
}
