/**
 * AccordionTree — Spec: desgin_system/components/accordion-tree.schema.json
 * 접고 펼침이 가능한 트리 구조. 카테고리 → 상품 그룹화 등에 사용.
 *
 * M3 는 비-드래그 시각 컴포넌트. CategoryManage 에서 dnd-kit 으로 감싸 드래그 정렬.
 */
import clsx from "clsx";
import { useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  defaultOpen?: boolean;
  content: ReactNode;
  trailing?: ReactNode;
}

export interface AccordionTreeProps {
  items: AccordionItem[];
  className?: string;
}

export function AccordionTree({ items, className }: AccordionTreeProps) {
  return (
    <div className={clsx("accordion-tree", className)}>
      {items.map((it) => (
        <AccordionRow key={it.id} item={it} />
      ))}
    </div>
  );
}

function AccordionRow({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(!!item.defaultOpen);
  return (
    <div className={clsx("accordion-row", open && "accordion-row--open")}>
      <button
        type="button"
        className="accordion-header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="accordion-chevron" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
        <span className="accordion-title">{item.title}</span>
        {item.trailing && (
          <span className="accordion-trailing" onClick={(e) => e.stopPropagation()}>
            {item.trailing}
          </span>
        )}
      </button>
      {open && <div className="accordion-content">{item.content}</div>}
    </div>
  );
}
