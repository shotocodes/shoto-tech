// app/page.tsx
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ThreeCanvas from '@/components/ThreeCanvas';
import CustomCursor from '@/components/CustomCursor';
import LeftInfo from '@/components/LeftInfo';
import RightInfo from '@/components/RightInfo';
import ControlPanel from '@/components/ControlPanel';
import PlanetInfoPanel from '@/components/PlanetInfoPanel';
import SideNavigation from '@/components/SideNavigation';
import RightSideNavigation from '@/components/RightSideNavigation';
import { usePortfolioStore } from '@/store/usePortfolioStore';

// モーダルは初回表示に不要なので動的 import でバンドル分離
// (各モーダルは Three.js パーティクル系で重いため、実際に開かれるまで読み込まない)
const AboutModal = dynamic(() => import('@/components/AboutModal'), { ssr: false });
const ProjectModal = dynamic(() => import('@/components/ProjectModal'), { ssr: false });
const ServiceModal = dynamic(() => import('@/components/ServiceModal'), { ssr: false });
const ContactModal = dynamic(() => import('@/components/ContactModal'), { ssr: false });

export default function Home() {
  const {
    showPlanetInfo,
    setPlanetInfoData,
    hoveredPlanet,
    showAboutModal,
    setShowAboutModal,
    showProjectModal,
    setShowProjectModal,
    showServiceModal,
    setShowServiceModal,
    showContactModal,
    setShowContactModal,
    isTransitioning
  } = usePortfolioStore();

  // モーダル・パネルが開いてる時にbodyにクラスを追加
  useEffect(() => {
    const hasModal = showAboutModal || showProjectModal || showServiceModal || showContactModal;

    if (hasModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    if (showPlanetInfo) {
      document.body.classList.add('panel-open');
    } else {
      document.body.classList.remove('panel-open');
    }

    return () => {
      document.body.classList.remove('modal-open', 'panel-open');
    };
  }, [showAboutModal, showProjectModal, showServiceModal, showContactModal, showPlanetInfo]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!showPlanetInfo) return;

      const target = e.target as HTMLElement;
      const planetInfoPanel = document.querySelector('.planet-info-panel');
      const controlPanel = document.querySelector('.control-panel');

      if (hoveredPlanet) {
        return;
      }

      const isClickingPlanetPanel = planetInfoPanel?.contains(target);
      const isClickingControlPanel = controlPanel?.contains(target);
      const isClickingRightSideButton = target.closest('.right-side-icon-button');
      const isClickingSideButton = target.closest('.side-icon-button');
      const isClickingLanguageToggle = target.closest('.language-toggle');
      const isClickingLeftInfo = target.closest('.left-info');
      const isClickingRightInfo = target.closest('.right-info');

      if (!isClickingPlanetPanel &&
          !isClickingControlPanel &&
          !isClickingRightSideButton &&
          !isClickingSideButton &&
          !isClickingLanguageToggle &&
          !isClickingLeftInfo &&
          !isClickingRightInfo) {
        setPlanetInfoData(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPlanetInfo, setPlanetInfoData, hoveredPlanet]);

  return (
    <>
      {!showAboutModal && !showProjectModal && !showServiceModal && !showContactModal && !isTransitioning && <CustomCursor />}

      {/* 条件付きレンダリングではなく、visibilityで制御 */}
      <div style={{
        visibility: (showAboutModal || showProjectModal || showServiceModal || showContactModal || isTransitioning) ? 'hidden' : 'visible',
        pointerEvents: (showAboutModal || showProjectModal || showServiceModal || showContactModal || isTransitioning) ? 'none' : 'auto'
      }}>
        <ThreeCanvas />
      </div>

      <div className="ui-overlay">
        <ControlPanel />
        <PlanetInfoPanel />
        <LeftInfo />
        <RightInfo />
        <SideNavigation />
        <RightSideNavigation />
      </div>

      {/* モーダルは開いた時だけマウント（dynamic import と合わせて初回ロード軽減） */}
      {showAboutModal && (
        <AboutModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {showServiceModal && (
        <ServiceModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
        />
      )}

      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  );
}
