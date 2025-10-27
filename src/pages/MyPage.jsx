import { useEffect } from 'react';
import { useState } from 'react';
import MyPageTemplate from '../templates/MyPageTemplate';
import Toast from '../components/common/Toast';
import useAuthStore from '../store/useAuthStore';
import {
  getVendorNews,
  getVendorProfile,
  getVendorReviews,
  postVendorNews,
  patchVendorProfile,
  deleteVendorNews,
  patchVendorNews,
} from '../api/vendor-profile-service';

export default function MyPage() {
  const [loading, setLoading] = useState(false);
  const vendorId = useAuthStore(state => state.vendorId);
  const setVendorId = useAuthStore(state => state.setVendorId);

  const [myPageData, setMyPageData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  const [toast, setToast] = useState('');

  const [tab, setTab] = useState('home'); // 'home', 'news', 'review'

  // GET 프로필 정보
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await getVendorProfile();
      if (response.success) {
        setMyPageData(response.data);
        setVendorId(response.data.vendorId);
      } else {
        setMyPageData(null);
        throw new Error(response.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // GET 소식 정보
  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const response = await getVendorNews(vendorId);
      if (response.success) setNewsData(response.data);
      else {
        setNewsData([]);
        throw new Error(response.message || 'Failed to fetch news data');
      }
    } catch (error) {
      console.error('Failed to fetch vendor news:', error);
    } finally {
      setLoading(false);
    }
  };

  // GET 리뷰 정보
  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const response = await getVendorReviews(vendorId);
      if (response.success) setReviewData(response.data.reviews);
      else {
        setReviewData([]);
        throw new Error(response.message || 'Failed to fetch review data');
      }
    } catch (error) {
      console.error('Failed to fetch vendor reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: tab에 따라 다른 데이터 불러오기
  const fetchData = () => {
    switch (tab) {
      case 'home':
        fetchProfileData();
        break;
      case 'news':
        fetchNewsData();
        break;
      case 'review':
        fetchReviewData();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  // PATCH 프로필 정보 수정
  const fetchPatchProfileInfo = async (jsonData, profileFile, introFiles) => {
    try {
      const response = await patchVendorProfile(jsonData, profileFile, introFiles);
      return response.success;
    } catch (error) {
      console.error('Failed to patch vendor profile:', error);
    }
  };
  // POST 소식 등록
  const fetchPostNews = async data => {
    try {
      const response = await postVendorNews(data);
      return response.success;
    } catch (error) {
      console.error('Failed to post vendor news:', error);
    }
  };

  // PATCH 소식 수정
  const fetchPatchNews = async data => {
    try {
      const response = await patchVendorNews(data);
      return response.success;
    } catch (error) {
      console.error('Failed to patch vendor news:', error);
    }
  };

  // DELETE 소식 삭제
  const fetchDeleteNews = async newsId => {
    try {
      const response = await deleteVendorNews(newsId);
      return response.success;
    } catch (error) {
      console.error('Failed to delete vendor news:', error);
    }
  };

  // handler 프로필 정보 수정
  const handlePatchProfileInfo = updatedInfo => {
    const { profileImage, introductionImage, ...rest } = updatedInfo;
    if (fetchPatchProfileInfo(rest, profileImage, introductionImage)) {
      setToast('프로필이 수정되었어요.');
      setMyPageData(prevData => ({
        ...prevData,
        ...rest,
        image: profileImage.url,
        introductionImage,
      }));
      console.log('가져온 프로필 이미지: ', profileImage.url);
    }
  };

  // handler 소식 삭제
  const handleNewsDelete = newsId => {
    if (fetchDeleteNews(newsId)) {
      setNewsData(prevNewsData => prevNewsData.filter(news => news.newsId !== newsId));
      setToast('소식을 삭제했어요.');
    }
  };

  // handler 소식 등록 및 수정
  const handleNewsEdit = params => {
    if (params.newsId) {
      if (fetchPatchNews(params)) setToast('소식을 수정했어요.');
      setNewsData(prevNewsData =>
        prevNewsData.map(news =>
          news.newsId === params.newsId
            ? { ...news, title: params.title, content: params.content }
            : news
        )
      );
    } else {
      if (fetchPostNews(params)) setToast('소식을 등록했어요.');
      const newNews = {
        newsId: Date.now(), // 임시 ID
        title: params.title,
        content: params.content,
        createdAt: new Date().toISOString(),
      };
      setNewsData(prevNewsData => [newNews, ...prevNewsData]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MyPageTemplate
        myPageData={myPageData}
        newsData={newsData}
        reviewData={reviewData}
        tab={tab}
        setTab={setTab}
        onPatchProfileInfo={handlePatchProfileInfo}
        onNewsDelete={handleNewsDelete}
        onNewsEdit={handleNewsEdit}
      />
      <Toast message={toast} show={!!toast} onClose={() => setToast('')} />
    </>
  );
}
