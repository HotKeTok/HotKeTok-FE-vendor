import api from './client';

// 수리업체 등록
export async function apiVendorRegister({ data, file, images }) {
  const mainFile = file instanceof File ? file : file?.file instanceof File ? file.file : null;
  if (!mainFile || mainFile.size === 0) {
    throw new Error('사업자등록증 파일을 첨부해주세요.');
  }

  const isImageLike = f => {
    if (!(f instanceof File) || f.size === 0) return false;
    const mime = (f.type || '').toLowerCase();
    if (mime.startsWith('image/')) return true; // image/png, image/jpeg, image/svg+xml 등
    const name = (f.name || '').toLowerCase();
    return /\.(png|jpe?g|webp|gif|bmp|heic|heif|svg)$/.test(name);
  };

  const safeImages = (images || [])
    .map(img => (img instanceof File ? img : img?.file))
    .filter(isImageLike);

  if (safeImages.length === 0) {
    throw new Error('소개 이미지를 최소 1장 첨부해주세요.');
  }

  const form = new FormData();
  safeImages.forEach(f => form.append('images', f, f.name || 'image'));
  form.append('file', mainFile, mainFile.name || 'file');

  const json = JSON.stringify(data ?? {});
  form.append('data', new Blob([json], { type: 'application/json' }));

  const { data: res } = await api.post('/vendor-service/register', form);
  return res;
}
