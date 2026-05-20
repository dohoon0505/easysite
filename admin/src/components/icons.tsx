/**
 * 미니 SVG 아이콘 세트. M3 임시 — M4+에서 asset-icon 으로 교체.
 * 모든 아이콘은 24×24, currentColor 로 색 상속.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function svg(d: string) {
  return function Icon({ size = 24, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...rest}
      >
        <path d={d} />
      </svg>
    );
  };
}

export const HomeIcon = svg("M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z");
export const PackageIcon = svg("M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12");
export const FolderIcon = svg("M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z");
export const ImageIcon = svg("M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm0 14l5-5 4 4 3-3 6 6");
export const UploadIcon = svg("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12");
export const UserIcon = svg("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z");
export const UsersIcon = svg("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75");
export const SettingsIcon = svg("M12 1l2.39 4.84L20 7l-3.91 3.82.92 5.36L12 13.77l-5.01 2.41.92-5.36L4 7l5.61-1.16zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z");
export const PlusIcon = svg("M12 5v14M5 12h14");
export const TrashIcon = svg("M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v4m4-4v4");
export const SearchIcon = svg("M21 21l-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0z");
export const ChevronLeftIcon = svg("M15 18l-6-6 6-6");
export const ChevronRightIcon = svg("M9 18l6-6-6-6");
export const CheckIcon = svg("M20 6L9 17l-5-5");
export const XIcon = svg("M18 6L6 18M6 6l12 12");
export const LogoutIcon = svg("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9");
export const SendIcon = svg("M22 2L11 13M22 2l-7 20-4-9-9-4z");
