import React, { useEffect } from 'react';
import { useState } from 'react';
import MyPageTemplate from '../templates/MyPageTemplate';
import { DUMMY_MYPAGE_DATA, DUMMY_NEWS_DATA, DUMMY_REVIEW_DATA } from '../mocks/mypage';
import Toast from '../components/common/Toast';

export default function MyPage() {
  const [myPageData, setMyPageData] = useState(DUMMY_MYPAGE_DATA);
  const [newsData, setNewsData] = useState(DUMMY_NEWS_DATA);
  const [reviewData, setReviewData] = useState(DUMMY_REVIEW_DATA);

  const [toast, setToast] = useState('');

  const [tab, setTab] = useState('home'); // 'home', 'news', 'review'

  // TODO: tab에 따라 다른 데이터 불러오기
  const fetchData = () => {
    switch (tab) {
      case 'home':
        setMyPageData(DUMMY_MYPAGE_DATA);
        break;
      case 'news':
        setNewsData(DUMMY_NEWS_DATA);
        break;
      case 'review':
        setReviewData(DUMMY_REVIEW_DATA);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handlePatchProfileInfo = updatedInfo => {
    // todo: api 호출
    setToast('프로필이 수정되었어요.');
  };

  const handleNewsDelete = newsId => {
    // todo: api 호출
    setNewsData(prevNewsData => prevNewsData.filter(news => news.id !== newsId));
    setToast('소식을 삭제했어요.');
  };

  const handleNewsEdit = newsId => {
    // todo: api 호출
    if (newsId) {
      setToast('소식을 수정했어요.');
    } else {
      setToast('소식을 등록했어요.');
    }
  };

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
