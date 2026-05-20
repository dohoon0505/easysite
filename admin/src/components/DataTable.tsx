/**
 * DataTable — Spec: desgin_system/components/data-table.schema.json
 * 데스크톱·태블릿용 데이터 테이블. 다중 선택 + 정렬.
 * 모바일에서는 ProductCard 리스트로 자동 전환 권장 (페이지에서 선택).
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  /** 셀 렌더 함수. */
  cell: (row: T) => ReactNode;
  /** 단축형 — 한 줄 텍스트일 때 사용. */
  width?: string;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (allSelected: boolean) => void;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
  className,
  emptyMessage = "데이터가 없습니다.",
}: DataTableProps<T>) {
  const selectable = !!selectedIds && !!onToggleRow;
  const allSelected =
    selectable && rows.length > 0 && rows.every((r) => selectedIds!.has(getRowId(r)));
  const someSelected =
    selectable && rows.some((r) => selectedIds!.has(getRowId(r)));

  return (
    <div className={clsx("dt", className)}>
      <table className="dt-table">
        <thead>
          <tr>
            {selectable && (
              <th className="dt-th dt-th-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={() => onToggleAll?.(allSelected)}
                  aria-label="전체 선택"
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.id}
                className={clsx("dt-th", c.align && `dt-align-${c.align}`)}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                className="dt-empty"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row) => {
            const id = getRowId(row);
            const isSelected = selectable && selectedIds!.has(id);
            return (
              <tr
                key={id}
                className={clsx("dt-row", isSelected && "dt-row--selected")}
              >
                {selectable && (
                  <td className="dt-td dt-th-check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRow!(id)}
                      aria-label="행 선택"
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    key={c.id}
                    className={clsx("dt-td", c.align && `dt-align-${c.align}`)}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
