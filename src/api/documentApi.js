import api from "./axios";

const getImageDimensions = (file, device = "desktop") => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const originalWidth =
        img.naturalWidth || (device === "mobile" ? 214 : 660);
      const originalHeight =
        img.naturalHeight || (device === "mobile" ? 463 : 371);

      const targetWidth = device === "mobile" ? 214 : 660;
      const displayHeight = Math.round(
        (originalHeight / originalWidth) * targetWidth,
      );

      resolve({
        originalWidth,
        originalHeight,
        displayWidth: targetWidth,
        displayHeight,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        originalWidth: device === "mobile" ? 214 : 660,
        originalHeight: device === "mobile" ? 463 : 371,
        displayWidth: device === "mobile" ? 214 : 660,
        displayHeight: device === "mobile" ? 463 : 371,
      });
    };
    img.src = url;
  });
};

export const createDocument = (
  teamId,
  { name, language, version = 1, documentType = "STORYBOARD" },
) => {
  return api.post(`/api/teams/${teamId}/documents`, {
    name,
    language,
    version: Number(version),
    documentType,
  });
};

let _cachedUserLang = null;
const getUserLanguage = async () => {
  if (_cachedUserLang) return _cachedUserLang;
  const localLang = localStorage.getItem("userLanguage");
  if (localLang) {
    _cachedUserLang = localLang;
    return _cachedUserLang;
  }
  try {
    const res = await api.get("/api/users/me");
    const userData = res?.data?.data || res?.data || res;
    _cachedUserLang = userData?.language || null;
    return _cachedUserLang;
  } catch {
    return null;
  }
};

export const clearUserLangCache = () => {
  _cachedUserLang = null;
};

export const getDocumentDetail = async (documentId, version = 1, lang) => {
  let effectiveLang = lang;
  if (!effectiveLang) {
    effectiveLang = await getUserLanguage();
  }

  const cleanLang =
    effectiveLang && String(effectiveLang).toLowerCase().trim() !== "ko"
      ? String(effectiveLang).toLowerCase().trim()
      : undefined;

  const config = cleanLang ? { params: { lang: cleanLang } } : {};
  return api.get(`/api/documents/${documentId}/versions/${version}`, config);
};

export const addPage = (documentId, version, { screenName, screenId }) => {
  return api.post(`/api/documents/${documentId}/versions/${version}/pages`, {
    screenName,
    screenId,
  });
};

export const updatePage = (documentId, version, pageId, data) => {
  return api.put(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
    data,
  );
};

export const deletePage = (documentId, version, pageId) => {
  return api.delete(
    `/api/documents/${documentId}/versions/${version}/pages/${pageId}`,
  );
};

export const reorderPages = (documentId, version, pageIds) => {
  return api.patch(
    `/api/documents/${documentId}/versions/${version}/pages/reorder`,
    { pageIds },
  );
};

export const uploadWireframePipeline = async (
  pageId,
  file,
  device = "desktop",
) => {
  const fileType = file.type || "image/png";
  const fileName = file.name || `wireframe_${Date.now()}.png`;

  const dimensions = await getImageDimensions(file, device);

  const presignedRes = await api.post("/api/files/presigned-url", {
    fileName: fileName,
    contentType: fileType,
    imageType: "WIREFRAME",
    pageId: Number(pageId),
  });

  const resPayload = presignedRes?.data?.data || presignedRes?.data || {};
  const { presignedUrl, fileUrl } = resPayload;

  if (!presignedUrl) {
    throw new Error("Presigned URL 발급 실패");
  }

  try {
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: file,
    });

    if (!uploadRes.ok && uploadRes.status !== 200 && uploadRes.status !== 204) {
      throw new Error(`MinIO 업로드 실패: HTTP ${uploadRes.status}`);
    }
  } catch (uploadErr) {
    console.warn(
      "MinIO 업로드 응답 처리 안내 (메타데이터 등록 진행):",
      uploadErr,
    );
  }

  const metaRes = await api.post(`/api/pages/${pageId}/wireframe-images`, {
    imageType: "WIREFRAME",
    imageUrl: fileUrl,
    originalWidth:
      dimensions.originalWidth || (device === "mobile" ? 214 : 660),
    originalHeight:
      dimensions.originalHeight || (device === "mobile" ? 463 : 371),
    displayWidth: dimensions.displayWidth || (device === "mobile" ? 214 : 660),
    displayHeight:
      dimensions.displayHeight || (device === "mobile" ? 463 : 371),
  });

  const metaData = metaRes?.data?.data || metaRes?.data || {};
  return metaData.imageUrl || fileUrl;
};

export const deleteWireframeImage = (pageId, imageId) => {
  return api.delete(`/api/pages/${pageId}/wireframe-images/${imageId}`);
};

export const addPin = (pageId, data) => {
  return api.post(`/api/pages/${pageId}/pins`, data);
};

export const updatePinPosition = (pageId, pinId, data) => {
  return api.put(`/api/pages/${pageId}/pins/${pinId}`, data);
};

export const deletePin = (pageId, pinId) => {
  return api.delete(`/api/pages/${pageId}/pins/${pinId}`);
};

export const addRequirement = (pinId, data) => {
  return api.post(`/api/pins/${pinId}/requirements`, data);
};

export const updateRequirement = (pinId, reqId, data) => {
  return api.put(`/api/pins/${pinId}/requirements/${reqId}`, data);
};

export const deleteRequirement = (pinId, reqId) => {
  return api.delete(`/api/pins/${pinId}/requirements/${reqId}`);
};

export const saveDocument = (documentId, version, data) => {
  return api.put(`/api/documents/${documentId}/versions/${version}`, data);
};

export const autoSaveDocument = (documentId, version, data) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/auto-save`,
    data,
  );
};

export const getDocumentChanges = async (documentId, version) => {
  const lang = await getUserLanguage();
  const cleanLang =
    lang && String(lang).toLowerCase().trim() !== "ko"
      ? String(lang).toLowerCase().trim()
      : undefined;
  const config = cleanLang ? { params: { lang: cleanLang } } : {};
  return api.get(
    `/api/documents/${documentId}/versions/${version}/changes`,
    config,
  );
};

export const confirmChange = (documentId, version, changeId) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/changes/${changeId}/confirm`,
  );
};

export const confirmAllChanges = (documentId, version) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/changes/confirm-all`,
  );
};

export const getDocumentVersions = (documentId) => {
  return api.get(`/api/documents/${documentId}/versions`);
};

export const createNewVersion = (documentId, baseVersion) => {
  return api.post(`/api/documents/${documentId}/versions`, {
    baseVersion,
  });
};

export const deleteVersion = (documentId, version) => {
  return api.delete(`/api/documents/${documentId}/versions/${version}`);
};

export const requestTranslation = (documentId, version, translations) => {
  return api.post(
    `/api/documents/${documentId}/versions/${version}/translate`,
    { translations },
  );
};

export const getTranslationStatus = (jobId) => {
  return api.get(`/api/translations/${jobId}`);
};
