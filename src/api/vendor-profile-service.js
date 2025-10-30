import client from './client.js';

/////////////////////// 프로필 관련

// GET 업체 정보 확인
export async function getVendorProfile() {
  const { data } = await client.get(`/vendor-service/profile/my`);
  return {
    success: data.success,
    data: data?.data ?? null,
  };
}

// PATCH 업체 프로필 관리
// profileData : 폼 텍스트 데이터
// profileFile : 프로필 이미지 파일
// introFiles : 소개 이미지 파일 배열
export async function patchVendorProfile(jsonData, profileFile, introFiles) {
  console.log('jsonData', jsonData);
  console.log('profileFile', profileFile);
  console.log('introFiles', introFiles);
  const formData = new FormData();

  // request append
  formData.append(
    'request',
    new Blob([JSON.stringify(jsonData)], {
      type: 'application/json',
    })
  );

  // 소개 이미지 따로 처리
  const isImageLike = f => {
    if (!(f instanceof File) || f.size === 0) return false;
    const mime = (f.type || '').toLowerCase();
    if (mime.startsWith('image/')) return true; // image/png, image/jpeg, image/svg+xml 등
    const name = (f.name || '').toLowerCase();
    return /\.(png|jpe?g|webp|gif|bmp|heic|heif|svg)$/.test(name);
  };

  // 프로필 이미지 append
  if (profileFile && isImageLike(profileFile.file)) {
    formData.append('profileImage', profileFile.file, profileFile.name, {
      headers: { 'Content-Type': undefined },
      transformRequest: [d => d], // 그대로 통과
    });
  }

  const safeImages = (introFiles || [])
    .map(img => (img instanceof File ? img : img?.file))
    .filter(isImageLike);

  // 소개 이미지는 따로 append
  if (safeImages && safeImages.length > 0) {
    safeImages.forEach((file, index) => {
      console.log('소개 이미지 파일 추가:', file);
      formData.append('introductionImages', file, file.name || `introductionImage_${index}`, {
        headers: { 'Content-Type': undefined },
        transformRequest: [d => d], // 그대로 통과
      });
    });
  }

  const { data } = await client.patch('/vendor-service/profile', formData);

  return {
    success: data.success,
    message: data?.message ?? '',
  };
}

// DELETE 업체 소개 이미지
export async function deleteVendorIntroImage(imageUrls) {
  const { data } = await client.delete('/vendor-service/profile', {
    introductionImages: imageUrls,
  });
  return {
    success: data.success,
    message: data?.message ?? '',
  };
}

/////////////////////// 소식 관련

// GET 업체 소식 조회
export async function getVendorNews(vendorId) {
  const { data } = await client.get(`/vendor-service/news?vendorId=${vendorId}`);
  return {
    success: data.success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}

// PATCH 업체 소식 수정
export async function patchVendorNews(newsData) {
  const { data } = await client.patch('/vendor-service/news', newsData);
  return {
    success: data.success,
    message: data?.message ?? '',
  };
}

// POST 업체 소식 등록
export async function postVendorNews(newsData) {
  const { data } = await client.post('/vendor-service/news', newsData);
  return {
    success: data.success,
    message: data?.message ?? '',
  };
}

// DELETE 업체 소식 삭제
export async function deleteVendorNews(newsId) {
  const { data } = await client.delete(`/vendor-service/news?newsId=${newsId}`);
  return {
    success: data.success,
    message: data?.message ?? '',
  };
}

/////////////////////// 리뷰 관련

// GET 업체 리뷰 조회
export async function getVendorReviews(vendorId) {
  const { data } = await client.get(`/review-service?vendorId=${vendorId}`);
  return {
    success: data.success,
    data: data?.data ?? null,
    message: data?.message ?? '',
  };
}
