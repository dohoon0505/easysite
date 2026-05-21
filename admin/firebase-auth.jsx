/* eslint-disable */
// 사용자 인증 hook + helper. 디자이너 page-login.jsx / app.jsx 에서 사용.

const useAuthSession = () => {
  const [state, setState] = React.useState({
    status: "loading", // "loading" | "signedIn" | "signedOut"
    user: null,
    claims: null,
  });

  React.useEffect(() => {
    if (!window.fbAuth) {
      setState({ status: "signedOut", user: null, claims: null });
      return;
    }
    const unsub = window.fbAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setState({ status: "signedOut", user: null, claims: null });
        return;
      }
      const result = await user.getIdTokenResult();
      const role = result.claims.role || "editor";
      const siteId = role === "super" ? null : (result.claims.siteId || null);
      setState({
        status: "signedIn",
        user,
        claims: { role, siteId },
      });
    });
    return unsub;
  }, []);

  return state;
};

const signInWithEmail = async (email, password) => {
  const cred = await window.fbAuth.signInWithEmailAndPassword(email, password);
  return cred.user;
};

const sendPasswordResetEmail = async (email) => {
  await window.fbAuth.sendPasswordResetEmail(email);
};

const signOutCurrent = async () => {
  await window.fbAuth.signOut();
};

const callPublishToGitHub = async ({ siteId, note }) => {
  const fn = window.fbFunctions.httpsCallable("publishToGitHub");
  const res = await fn({ siteId, note });
  return res.data; // { commitSha, snapshotId, filesChanged, noop }
};

const callSetSiteClaim = async ({ uid, siteId, role }) => {
  const fn = window.fbFunctions.httpsCallable("setSiteClaim");
  const res = await fn({ uid, siteId, role });
  return res.data;
};

// ── Storage: 상품 이미지 업로드 ───────────────────────────
// productId 없는 경우(신규 등록 중) "draft-" + 랜덤 ID 로 임시 업로드.
// 저장 시 productId 가 확정되면 그 폴더로 이동/복사 — 또는 신규 상품은
// 임시 productId 그대로 사용 가능.
const sanitizeFilename = (name) => {
  const dot = name.lastIndexOf(".");
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
  const safe = base
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";
  const stamp = Date.now().toString(36);
  return ext ? `${safe}-${stamp}.${ext}` : `${safe}-${stamp}`;
};

const uploadProductImage = (siteId, productId, file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!window.fbStorage) {
      reject(new Error("Firebase Storage 가 준비되지 않았습니다"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("10MB 이하 이미지만 업로드 가능합니다"));
      return;
    }
    const filename = sanitizeFilename(file.name);
    const path = `sites/${siteId}/products/${productId}/${filename}`;
    const ref = window.fbStorage.ref(path);
    // 다운로드 토큰을 포함시키기 위해 customMetadata 사용
    const token = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const task = ref.put(file, {
      contentType: file.type,
      customMetadata: {
        firebaseStorageDownloadTokens: token,
      },
    });

    task.on(
      "state_changed",
      (snap) => {
        const pct = snap.totalBytes > 0
          ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          : 0;
        onProgress && onProgress(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          // 즉시 사용 가능한 URL — 토큰 포함된 firebasestorage.googleapis.com URL
          const bucket = window.fbStorage.app.options.storageBucket;
          const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
          resolve({ storagePath: path, downloadUrl: url, filename });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

const uploadSectionImage = (siteId, sectionId, imageKey, file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!window.fbStorage) {
      reject(new Error("Firebase Storage 가 준비되지 않았습니다"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("10MB 이하 이미지만 업로드 가능합니다"));
      return;
    }
    const filename = sanitizeFilename(file.name);
    const path = `sites/${siteId}/homeSections/${sectionId}/${imageKey}-${filename}`;
    const ref = window.fbStorage.ref(path);
    const token = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const task = ref.put(file, {
      contentType: file.type,
      customMetadata: { firebaseStorageDownloadTokens: token },
    });

    task.on(
      "state_changed",
      (snap) => {
        const pct = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 0;
        onProgress && onProgress(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          const bucket = window.fbStorage.app.options.storageBucket;
          const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
          resolve({ storagePath: path, downloadUrl: url, filename });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

Object.assign(window, { uploadProductImage, uploadSectionImage, sanitizeFilename });

Object.assign(window, {
  useAuthSession,
  signInWithEmail,
  sendPasswordResetEmail,
  signOutCurrent,
  callPublishToGitHub,
  callSetSiteClaim,
});
