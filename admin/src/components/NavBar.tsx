/**
 * NavBar — Spec: desgin_system/components/nav-bar.schema.json (sidebar variant)
 * 데스크톱·태블릿 좌측 사이드바.
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick: () => void;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface NavBarProps {
  groups: NavGroup[];
  className?: string;
}

export function NavBar({ groups, className }: NavBarProps) {
  return (
    <nav className={clsx("navbar", className)} aria-label="사이드 메뉴">
      {groups.map((group, gi) => (
        <div key={gi} className="navbar-group">
          {group.title && <div className="navbar-group-title">{group.title}</div>}
          <ul className="navbar-list">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={clsx(
                    "navbar-item",
                    item.active && "navbar-item--active"
                  )}
                  onClick={item.onClick}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.icon && <span className="navbar-icon">{item.icon}</span>}
                  <span className="navbar-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
