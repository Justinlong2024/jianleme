/**
 * WeChat H5 utilities
 * 
 * For full WeChat JS-SDK sharing, you'll need:
 * 1. A verified WeChat Official Account (公众号)
 * 2. Configure JS安全域名 in the WeChat admin panel
 * 3. Backend endpoint to generate wx.config signature
 * 
 * This module provides the setup scaffolding and environment detection.
 */

/** Detect if running inside WeChat browser */
export const isWeChatBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

/** Detect if running inside WeChat Mini Program web-view */
export const isWeChatMiniProgram = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('miniprogram') || (window as any).__wxjs_environment === 'miniprogram';
};

/** Share config for WeChat JS-SDK (requires backend signature) */
export interface WeChatShareConfig {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}

/** Default share config */
export const defaultShareConfig: WeChatShareConfig = {
  title: '简了么 - 简法健康管理',
  desc: '记录你的简法旅程，辟谷轻断食健康管理',
  link: window.location.href,
  imgUrl: 'https://storage.googleapis.com/gpt-engineer-file-uploads/IYUDB23OaqcewivD7vtQuglibV72/social-images/social-1772770804464-简_logo_金.webp',
};

/**
 * Initialize WeChat JS-SDK sharing.
 * 
 * To enable this, you need to:
 * 1. Add <script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script> to index.html
 * 2. Create a backend endpoint that generates a signature using your AppSecret
 * 3. Call this function after wx.config succeeds
 */
export const setupWeChatShare = (config: Partial<WeChatShareConfig> = {}) => {
  const wx = (window as any).wx;
  if (!wx || !isWeChatBrowser()) return;

  const shareData = { ...defaultShareConfig, ...config };

  wx.ready(() => {
    // Share to friend
    wx.updateAppMessageShareData({
      title: shareData.title,
      desc: shareData.desc,
      link: shareData.link,
      imgUrl: shareData.imgUrl,
    });

    // Share to Moments (朋友圈)
    wx.updateTimelineShareData({
      title: shareData.title,
      link: shareData.link,
      imgUrl: shareData.imgUrl,
    });
  });
};
