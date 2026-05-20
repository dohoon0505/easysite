/**
 * CategoryManage — 카테고리 CRUD + 순서 변경.
 *
 * M3 는 ↑↓ 버튼으로 순서 변경. dnd-kit 기반 드래그 정렬은 M6 향상으로 미룸 (모바일·접근성 안전성).
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  ResponsiveModal,
  TextField,
} from "@/components";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { useConfirm } from "@/hooks/useConfirm";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";
import {
  deleteCategory,
  reorderCategories,
  setCategoryVisibility,
  subscribeCategories,
  upsertCategory,
} from "@/lib/firestore/categories";
import type { Category } from "@/types";

const schema = z.object({
  categoryId: z
    .string()
    .min(1, "ID 를 입력하세요.")
    .regex(/^[a-z][a-z0-9_-]*$/, "영문 소문자/숫자/-_ 로만 구성"),
  name: z.string().min(1, "이름을 입력하세요."),
  blurb: z.string().min(1, "설명을 입력하세요."),
  sub: z.string().min(1, "영문 부제를 입력하세요."),
});
type FormValues = z.infer<typeof schema>;

export function CategoryManage() {
  const siteId = useAuth((s) => s.claims?.siteId);
  const uid = useAuth((s) => s.user?.uid);
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const cats = useSubscribed<Category[]>(
    (onNext, onErr) =>
      siteId ? subscribeCategories(siteId, onNext, onErr) : () => {},
    [siteId]
  );

  if (!siteId) {
    return <EmptyState title="사이트가 지정되지 않았습니다" />;
  }

  const list = cats.data ?? [];

  const swap = async (i: number, j: number) => {
    if (!uid || i < 0 || j < 0 || i >= list.length || j >= list.length) return;
    const next = list.slice();
    [next[i], next[j]] = [next[j], next[i]];
    try {
      await reorderCategories(
        siteId,
        uid,
        next.map((c) => c.categoryId)
      );
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  const onDelete = async (cat: Category) => {
    const ok = await confirm({
      title: `'${cat.name}' 카테고리를 삭제하시겠습니까?`,
      message: "이 카테고리에 속한 상품은 categoryId 가 남아 있어 별도 정리가 필요합니다.",
      tone: "danger",
      confirmText: "삭제",
    });
    if (!ok) return;
    try {
      await deleteCategory(siteId, cat.categoryId);
      toast.success("카테고리 삭제 완료.");
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ font: "var(--text-heading-md)" }}>카테고리 관리</h1>
        <Button variant="primary" size="md" onClick={() => setCreating(true)}>
          <PlusIcon size={16} /> 카테고리 추가
        </Button>
      </header>

      {cats.loading && <Card>불러오는 중…</Card>}

      {list.length === 0 && !cats.loading && (
        <EmptyState
          title="등록된 카테고리가 없습니다"
          description="상단 '카테고리 추가' 버튼으로 시작하세요."
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((c, idx) => (
          <Card key={c.categoryId} density="default">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong style={{ font: "var(--text-label-lg)" }}>{c.name}</strong>
                  <code
                    style={{
                      font: "var(--text-caption)",
                      color: "var(--sm-content-tertiary)",
                    }}
                  >
                    {c.categoryId}
                  </code>
                  {!c.visible && <Badge tone="warning">숨김</Badge>}
                </div>
                <p
                  style={{
                    font: "var(--text-body-sm)",
                    color: "var(--sm-content-secondary)",
                    marginTop: 4,
                  }}
                >
                  {c.blurb}
                </p>
                <small
                  style={{ font: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}
                >
                  영문 부제: {c.sub} · 정렬 {c.sortOrder}
                </small>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void swap(idx, idx - 1)}
                  disabled={idx === 0}
                  aria-label="위로"
                >
                  <ChevronLeftIcon size={16} style={{ transform: "rotate(90deg)" }} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void swap(idx, idx + 1)}
                  disabled={idx === list.length - 1}
                  aria-label="아래로"
                >
                  <ChevronRightIcon size={16} style={{ transform: "rotate(90deg)" }} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!uid) return;
                    void setCategoryVisibility(siteId, c.categoryId, uid, !c.visible);
                  }}
                >
                  {c.visible ? "숨김" : "노출"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(c)}>
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void onDelete(c)}
                  style={{ color: "var(--sm-status-error)" }}
                  aria-label="삭제"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CategoryFormModal
        open={creating || editing !== null}
        initial={editing}
        siteId={siteId}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        existingIds={list.map((c) => c.categoryId)}
        nextSortOrder={list.length * 10}
      />
    </div>
  );
}

function CategoryFormModal({
  open,
  initial,
  siteId,
  onClose,
  existingIds,
  nextSortOrder,
}: {
  open: boolean;
  initial: Category | null;
  siteId: string;
  onClose: () => void;
  existingIds: string[];
  nextSortOrder: number;
}) {
  const uid = useAuth((s) => s.user?.uid);
  const isEdit = initial !== null;
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: initial?.categoryId ?? "",
      name: initial?.name ?? "",
      blurb: initial?.blurb ?? "",
      sub: initial?.sub ?? "",
    },
    values: initial
      ? {
          categoryId: initial.categoryId,
          name: initial.name,
          blurb: initial.blurb,
          sub: initial.sub,
        }
      : undefined,
  });

  const onSubmit = async (values: FormValues) => {
    if (!uid) return;
    if (!isEdit && existingIds.includes(values.categoryId)) {
      toast.warning("이미 사용 중인 ID 입니다.");
      return;
    }
    setSaving(true);
    try {
      await upsertCategory(siteId, uid, {
        ...values,
        sortOrder: initial?.sortOrder ?? nextSortOrder,
        visible: initial?.visible ?? true,
        status: initial?.status ?? "draft",
      });
      toast.success(isEdit ? "카테고리 수정 완료." : "카테고리 등록 완료.");
      reset();
      onClose();
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      title={isEdit ? "카테고리 수정" : "카테고리 추가"}
      footer={
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button variant="ghost" size="md" onClick={onClose}>취소</Button>
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? "저장" : "등록"}
          </Button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <FormField
          label="카테고리 ID"
          required
          helpText="영문 소문자만 (예: bouquet, signature, course)"
          errorText={errors.categoryId?.message}
        >
          <TextField
            {...register("categoryId")}
            error={!!errors.categoryId}
            disabled={isEdit}
          />
        </FormField>
        <FormField label="이름" required errorText={errors.name?.message}>
          <TextField {...register("name")} error={!!errors.name} placeholder="꽃다발" />
        </FormField>
        <FormField label="설명" required errorText={errors.blurb?.message}>
          <TextField {...register("blurb")} error={!!errors.blurb} placeholder="마음을 전하는 꽃다발" />
        </FormField>
        <FormField label="영문 부제" required errorText={errors.sub?.message}>
          <TextField {...register("sub")} error={!!errors.sub} placeholder="BOUQUET" />
        </FormField>
      </form>
    </ResponsiveModal>
  );
}
