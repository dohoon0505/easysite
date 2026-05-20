/**
 * TopAppBar — Spec: desgin_system/components/top-app-bar.schema.json
 *
 * 데스크톱·모바일 공통 상단 헤더. 좌측 로고 + 중앙 제목 + 우측 액션 슬롯.
 * 모바일에서 햄버거 메뉴 토글 버튼을 좌측에 표시할 수 있음.
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export interface TopAppBarProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function TopAppBar({
  title,
  subtitle,
  leading,
  trailing,
  className,
}: TopAppBarProps) {
  return (
    <header className={clsx("topbar", className)}>
      <div className="topbar-leading">{leading}</div>
      <div className="topbar-titles">
        <span className="topbar-title">{title}</span>
        {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
      </div>
      <div className="topbar-trailing">{trailing}</div>
    </header>
  );
}
