/**
 * ProductEdit — 상품 등록·수정 폼.
 *
 * 사이트 타입에 따라 추가 필드가 conditionally 표시됨:
 *  - typeA (bell_cake): sizeId, flavorId
 *  - typeA (PARKHAD): time(분), tag
 *  - typeC (greenlight_art): age, per, weekly
 *
 * 이미지 업로드는 Storage 에 즉시 올리고, onImageFinalize Function 이
 * 200/400/800 변형 URL 을 product doc 에 자동 기입.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDoc } from "firebase/firestore";

import {
  Badge,
  Button,
  Card,
  FileUploader,
  FormField,
  TextField,
} from "@/components";
import { ChevronLeftIcon, TrashIcon } from "@/components/icons";
import { useConfirm } from "@/hooks/useConfirm";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";
import { getSite } from "@/lib/firestore/sites";
import {
  deleteProduct,
  productRef,
  upsertProduct,
} from "@/lib/firestore/products";
import {
  deleteStorageObject,
  previewSrc,
  uploadProductImage,
} from "@/lib/storage";
import { subscribeCategories } from "@/lib/firestore/categories";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import type { Category, Product, ProductImage, Site } from "@/types";

const schema = z.object({
  name: z.string().min(1, "상품명을 입력하세요."),
  price: z.number({ invalid_type_error: "숫자만 입력" }).int().min(0),
  desc: z.string().min(1, "설명을 입력하세요."),
  categoryId: z.string().min(1, "카테고리를 선택하세요."),
  visible: z.boolean(),
  sortOrder: z.number().int().min(0),
  status: z.enum(["draft", "live"]),
  // typeA bell_cake
  sizeId: z.string().optional(),
  flavorId: z.string().optional(),
  // typeA PARKHAD
  time: z
    .number({ invalid_type_error: "숫자만 입력" })
    .int()
    .min(0)
    .optional(),
  tag: z.string().optional(),
  // typeC greenlight_art
  age: z.string().optional(),
  per: z
    .number({ invalid_type_error: "숫자만 입력" })
    .int()
    .min(0)
    .optional(),
  weekly: z.string().optional(),
  sectionId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 40) || `p-${Date.now().toString(36)}`;
}

export function ProductEdit() {
  const navigate = useNavigate();
  const { productId: routeId } = useParams<{ productId?: string }>();
  const isNew = !routeId;
  const confirm = useConfirm();

  const siteId = useAuth((s) => s.claims?.siteId);
  const uid = useAuth((s) => s.user?.uid);

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<ProductImage | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const cats = useSubscribed<Category[]>(
    (onNext, onErr) =>
      siteId ? subscribeCategories(siteId, onNext, onErr) : () => {},
    [siteId]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: 0,
      desc: "",
      categoryId: "",
      visible: true,
      sortOrder: 10,
      status: "draft",
    },
  });

  // 사이트 메타 + (수정 모드면) 기존 product 로드
  useEffect(() => {
    if (!siteId) return;
    let mounted = true;
    (async () => {
      try {
        const s = await getSite(siteId);
        if (!mounted) return;
        setSite(s);
        if (isNew) {
          setLoading(false);
          return;
        }
        const snap = await getDoc(productRef(siteId, routeId!));
        if (!mounted) return;
        if (snap.exists()) {
          const p = snap.data() as Product;
          reset({
            name: p.name,
            price: p.price,
            desc: p.desc,
            categoryId: p.categoryId,
            visible: p.visible,
            sortOrder: p.sortOrder,
            status: p.status,
            sizeId: p.sizeId,
            flavorId: p.flavorId,
            time: p.time,
            tag: p.tag,
            age: p.age,
            per: p.per,
            weekly: p.weekly,
            sectionId: p.sectionId,
          });
          setImage(p.image);
        } else {
          toast.warning("상품을 찾을 수 없습니다.");
          navigate("/products", { replace: true });
        }
        setLoading(false);
      } catch (e) {
        toast.danger((e as Error).message);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [siteId, routeId, isNew, reset, navigate]);

  if (!siteId) {
    return (
      <Card>
        <p>사이트가 지정되지 않았습니다.</p>
      </Card>
    );
  }

  const onUploadFile = async (files: FileList) => {
    if (!uid) return;
    const f = files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.warning("10MB 이하 이미지만 업로드 가능합니다.");
      return;
    }
    const productId = routeId ?? slugify(watch("name") || "draft");
    setUploadProgress(0);
    try {
      const res = await uploadProductImage(siteId, productId, f, {
        onProgress: (pct) => setUploadProgress(pct),
      });
      const next: ProductImage = {
        storagePath: res.storagePath,
        thumb: null,
        large: null,
        originalUrl: res.downloadUrl,
        repoPath: `${siteId}/img/${res.storagePath.split("/").pop()}`,
      };
      setImage(next);
      toast.success("이미지 업로드 완료. 리사이즈는 백그라운드에서 진행됩니다.");
    } catch (e) {
      toast.danger(`업로드 실패: ${(e as Error).message}`);
    } finally {
      setUploadProgress(null);
    }
  };

  const onRemoveImage = async () => {
    if (!image) return;
    const ok = await confirm({
      title: "이미지를 삭제하시겠습니까?",
      tone: "danger",
      confirmText: "삭제",
    });
    if (!ok) return;
    try {
      await deleteStorageObject(image.storagePath);
      setImage(null);
      toast.success("이미지 삭제 완료.");
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!uid || !siteId) return;
    setSaving(true);
    try {
      const productId = routeId ?? slugify(values.name);
      const finalImage: ProductImage = image ?? {
        storagePath: "",
        thumb: null,
        large: null,
        originalUrl: null,
        repoPath: "",
      };

      await upsertProduct(siteId, uid, {
        productId,
        name: values.name,
        price: values.price,
        desc: values.desc,
        categoryId: values.categoryId,
        image: finalImage,
        sizeId: values.sizeId,
        flavorId: values.flavorId,
        time: values.time,
        tag: values.tag,
        age: values.age,
        per: values.per,
        weekly: values.weekly,
        sectionId: values.sectionId,
        visible: values.visible,
        sortOrder: values.sortOrder,
        status: values.status,
      } as unknown as Parameters<typeof upsertProduct>[2]);

      toast.success(isNew ? "상품 등록 완료." : "상품 수정 완료.");
      navigate("/products");
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (isNew || !routeId) return;
    const ok = await confirm({
      title: "상품을 삭제하시겠습니까?",
      message: "이 작업은 되돌릴 수 없습니다.",
      tone: "danger",
      confirmText: "삭제",
    });
    if (!ok) return;
    try {
      if (image?.storagePath) {
        try {
          await deleteStorageObject(image.storagePath);
        } catch {
          /* ignore */
        }
      }
      await deleteProduct(siteId, routeId);
      toast.success("상품 삭제 완료.");
      navigate("/products");
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  if (loading) {
    return <Card>불러오는 중…</Card>;
  }

  const siteType = site?.siteType;
  const isBellCake = siteId === "bell_cake";
  const isParkhad = siteId === "PARKHAD";
  const isGreenlightArt = siteType === "typeC";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 88 }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link to="/products">
          <Button variant="ghost" size="sm">
            <ChevronLeftIcon size={16} /> 목록
          </Button>
        </Link>
        <h1 style={{ font: "var(--text-heading-md)" }}>
          {isNew ? "상품 등록" : "상품 수정"}
        </h1>
        {!isNew && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void onDelete()}
            style={{ marginLeft: "auto", color: "var(--sm-status-error)" }}
          >
            <TrashIcon size={16} /> 삭제
          </Button>
        )}
      </header>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>대표 이미지</h2>
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          cameraCapture
          onFiles={(files) => void onUploadFile(files)}
          progress={uploadProgress}
        >
          {image && previewSrc(image) ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img
                src={previewSrc(image)}
                alt="현재 이미지"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <code style={{ font: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
                  {image.storagePath}
                </code>
                {image.thumb ? (
                  <Badge tone="success">리사이즈 완료</Badge>
                ) : (
                  <Badge tone="warning">리사이즈 대기 중</Badge>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void onRemoveImage()}
                >
                  이미지 제거
                </Button>
              </div>
            </div>
          ) : null}
        </FileUploader>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>기본 정보</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField label="상품명" required errorText={errors.name?.message}>
            <TextField {...register("name")} error={!!errors.name} placeholder="예: 코랄 로즈 꽃다발 (S)" />
          </FormField>

          <FormField label="가격 (원)" required errorText={errors.price?.message}>
            <TextField
              type="number"
              inputMode="numeric"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
            />
          </FormField>

          <FormField label="설명" required errorText={errors.desc?.message}>
            <TextField {...register("desc")} error={!!errors.desc} placeholder="예: 소형 · 코랄톤 장미 믹스" />
          </FormField>

          <FormField label="카테고리" required errorText={errors.categoryId?.message}>
            <select
              {...register("categoryId")}
              className="tf-input"
              aria-invalid={!!errors.categoryId}
            >
              <option value="">선택…</option>
              {(cats.data ?? []).map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="정렬 순서" helpText="작은 수가 먼저 노출됨">
            <TextField
              type="number"
              inputMode="numeric"
              {...register("sortOrder", { valueAsNumber: true })}
              error={!!errors.sortOrder}
            />
          </FormField>

          <FormField label="상태">
            <select {...register("status")} className="tf-input">
              <option value="draft">드래프트 (사이트 미노출)</option>
              <option value="live">발행 대상 (다음 발행에 포함)</option>
            </select>
          </FormField>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" {...register("visible")} />
            <span style={{ font: "var(--text-body-md)" }}>사이트에 노출</span>
          </label>
        </div>
      </Card>

      {(isBellCake || isParkhad || isGreenlightArt) && (
        <Card density="default">
          <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>사이트별 추가 필드</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {isBellCake && (
              <>
                <FormField label="사이즈 ID" helpText="예: type-1">
                  <TextField {...register("sizeId")} />
                </FormField>
                <FormField label="맛 ID" helpText="예: vanilla-lemon">
                  <TextField {...register("flavorId")} />
                </FormField>
              </>
            )}
            {isParkhad && (
              <>
                <FormField label="소요 시간 (분)">
                  <TextField
                    type="number"
                    inputMode="numeric"
                    {...register("time", { valueAsNumber: true })}
                  />
                </FormField>
                <FormField label="태그" helpText="BASIC, BEST, TREND, PREMIUM 중 하나">
                  <TextField {...register("tag")} />
                </FormField>
              </>
            )}
            {isGreenlightArt && (
              <>
                <FormField label="대상 연령">
                  <TextField {...register("age")} placeholder="예: 8세~12세" />
                </FormField>
                <FormField label="기수 (per)">
                  <TextField
                    type="number"
                    inputMode="numeric"
                    {...register("per", { valueAsNumber: true })}
                  />
                </FormField>
                <FormField label="주간 수업 일정">
                  <TextField {...register("weekly")} placeholder="예: 매주 화·목 16~17시" />
                </FormField>
              </>
            )}
            <FormField label="태그" helpText="옵션">
              <TextField {...register("tag")} />
            </FormField>
          </div>
        </Card>
      )}

      <div className="sticky-action-bar">
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate("/products")}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" size="md" loading={saving} disabled={!isDirty && !image}>
            {isNew ? "등록" : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
}

