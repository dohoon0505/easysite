/**
 * ProductCard — 모바일·태블릿용 상품 카드.
 *
 * 썸네일 + 이름 + 가격 + 카테고리 + visible 토글 + 선택 체크박스.
 * Spec: desgin_system/components/card.schema.json + list-item.schema.json 합성.
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export interface ProductCardProps {
  thumb?: string | null;
  name: string;
  price: number;
  categoryLabel?: string;
  badges?: ReactNode;
  visible: boolean;
  selected?: boolean;
  onSelectChange?: (next: boolean) => void;
  onClick?: () => void;
  onToggleVisible?: (next: boolean) => void;
}

const won = new Intl.NumberFormat("ko-KR");

export function ProductCard({
  thumb,
  name,
  price,
  categoryLabel,
  badges,
  visible,
  selected = false,
  onSelectChange,
  onClick,
  onToggleVisible,
}: ProductCardProps) {
  return (
    <article
      className={clsx("pcard", selected && "pcard--selected")}
      role="listitem"
    >
      <div className="pcard-thumb-wrap">
        {thumb ? (
          <img className="pcard-thumb" src={thumb} alt="" loading="lazy" />
        ) : (
          <div className="pcard-thumb pcard-thumb--placeholder" aria-hidden>
            ◯
          </div>
        )}
        {onSelectChange && (
          <input
            type="checkbox"
            className="pcard-check"
            checked={selected}
            onChange={(e) => onSelectChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`${name} 선택`}
          />
        )}
      </div>

      <button
        type="button"
        className="pcard-body"
        onClick={onClick}
      >
        <div className="pcard-name">{name}</div>
        <div className="pcard-meta">
          <span className="pcard-price">{won.format(price)}원</span>
          {categoryLabel && (
            <span className="pcard-cat" aria-hidden>
              · {categoryLabel}
            </span>
          )}
        </div>
        {badges && <div className="pcard-badges">{badges}</div>}
      </button>

      {onToggleVisible && (
        <label className="pcard-visible">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => onToggleVisible(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <span>{visible ? "노출 중" : "숨김"}</span>
        </label>
      )}
    </article>
  );
}
