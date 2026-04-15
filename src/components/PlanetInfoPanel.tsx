// components/PlanetInfoPanel.tsx
'use client';

import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function PlanetInfoPanel() {
  // 個別セレクタで購読（config/hoveredPlanet 等の変更で再レンダーしないように）
  const language = usePortfolioStore((s) => s.language);
  const showPlanetInfo = usePortfolioStore((s) => s.showPlanetInfo);
  const planetInfoData = usePortfolioStore((s) => s.planetInfoData);
  const setPlanetInfoData = usePortfolioStore((s) => s.setPlanetInfoData);
  const setShowAboutModal = usePortfolioStore((s) => s.setShowAboutModal);
  const setShowProjectModal = usePortfolioStore((s) => s.setShowProjectModal);
  const setShowServiceModal = usePortfolioStore((s) => s.setShowServiceModal);
  const setShowContactModal = usePortfolioStore((s) => s.setShowContactModal);
  const setIsTransitioning = usePortfolioStore((s) => s.setIsTransitioning);
  const setShowControls = usePortfolioStore((s) => s.setShowControls);

  const currentData = languageData[language];

  // パネルが開いたら設定パネルを閉じる（スマホのみ）
  useEffect(() => {
    if (showPlanetInfo && window.innerWidth <= 768) {
      setShowControls(false);
    }
  }, [showPlanetInfo, setShowControls]);

  if (!planetInfoData) return null;

  // グローエフェクトのクラス名を決定
  let glowClass = '';

  // 通常の惑星
  if (planetInfoData.link === '#about') glowClass = 'glow-about';
  else if (planetInfoData.link === '#projects') glowClass = 'glow-projects';
  else if (planetInfoData.link === '#services') glowClass = 'glow-services';
  else if (planetInfoData.link === '#contact') glowClass = 'glow-contact';

  // アクション惑星
  else if (planetInfoData.action === 'controls') glowClass = 'glow-controls';
  else if (planetInfoData.action === 'sns') glowClass = 'glow-sns';
  else if (planetInfoData.action === 'blog') glowClass = 'glow-blog';

  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // リンクに応じて適切なモーダルを開く
    switch (planetInfoData.link) {
      case '#about':
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowAboutModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#projects':
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowProjectModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#services':
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowServiceModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#contact':
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowContactModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      default:
        break;
    }
  };

  return (
    <div className={`planet-info-panel ${showPlanetInfo ? 'show' : ''} ${glowClass}`}>
      <h3>{planetInfoData.name}</h3>
      <p>{planetInfoData.description}</p>
      <div>
        {planetInfoData.isActionPlanet && planetInfoData.links ? (
          <>
            {planetInfoData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-button ${
                  planetInfoData.action === 'sns'
                    ? 'external-link-button'
                    : 'blog-link-button'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              className="nav-button close-button"
              onClick={() => setPlanetInfoData(null)}
            >
              {currentData.ui.close}
            </button>
          </>
        ) : (
          <a
            href={planetInfoData.link}
            className="nav-button"
            onClick={handleDetailClick}
          >
            {currentData.ui.viewDetails}
          </a>
        )}
      </div>
    </div>
  );
}
