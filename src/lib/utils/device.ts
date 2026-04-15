// lib/utils/device.ts
// モバイル判定（SSR セーフ・同期的）
// モーダル初期化時にパーティクル数をデバイスに応じて調整するためのヘルパー。

export const MOBILE_BREAKPOINT = 768;

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

// 粒子数のモバイル向けデフォルト。デスクトップ 15000 → モバイル 5000 に削減。
export function getDefaultParticleCount(): number {
  return isMobileDevice() ? 5000 : 15000;
}
