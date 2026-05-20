/**
 * TabBar — Spec: desgin_system/components/tab-bar.schema.json
 * 모바일 하단 고정 탭바. iOS·Android 친화. 안전 영역 패딩.
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
}

export interface TabBarProps {
  items: TabItem[];
  className?: string;
}

export function TabBar({ items, className }: TabBarProps) {
  return (
    <nav
      className={clsx("tabbar", className)}
      role="tablist"
      aria-label="주요 메뉴"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.active || undefined}
          className={clsx("tabbar-item", item.active && "tabbar-item--active")}
          onClick={item.onClick}
        >
          <span className="tabbar-icon">{item.icon}</span>
          <span className="tabbar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
