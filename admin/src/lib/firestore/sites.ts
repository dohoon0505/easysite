import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Site, SiteType } from "@/types";

export function siteRef(siteId: string) {
  return doc(db, "sites", siteId);
}

export async function getSite(siteId: string): Promise<Site | null> {
  const snap = await getDoc(siteRef(siteId));
  return snap.exists() ? (snap.data() as Site) : null;
}

export async function listAllSites(): Promise<Site[]> {
  const q = query(collection(db, "sites"), orderBy("siteId"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Site);
}

export function subscribeSites(
  onNext: (sites: Site[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(collection(db, "sites"), orderBy("siteId"));
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Site)),
    onErr
  );
}

export interface CreateSiteInput {
  siteId: string;
  name: string;
  domain?: string;
  siteType: SiteType;
  ownerUid: string;
  github: Site["github"];
  brandColor?: string;
  fontFamily?: string;
}

export async function createSite(input: CreateSiteInput): Promise<void> {
  await setDoc(siteRef(input.siteId), {
    ...input,
    domain: input.domain ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastPublishedAt: null,
    lastPublishCommit: null,
  });
}

export async function updateSite(
  siteId: string,
  patch: Partial<Pick<Site, "name" | "domain" | "brandColor" | "fontFamily" | "github">>
): Promise<void> {
  await updateDoc(siteRef(siteId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
