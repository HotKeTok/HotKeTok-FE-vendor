import React, { useEffect } from 'react';
import { useState } from 'react';
import MyPageTemplate from '../templates/MyPageTemplate';
import { DUMMY_MYPAGE_DATA, DUMMY_NEWS_DATA, DUMMY_REVIEW_DATA } from '../mocks/mypage';

export default function MyPage() {
  const [myPageData, setMyPageData] = useState(DUMMY_MYPAGE_DATA);
  const [newsData, setNewsData] = useState(DUMMY_NEWS_DATA);
  const [reviewData, setReviewData] = useState(DUMMY_REVIEW_DATA);

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

  return (
    <MyPageTemplate
      myPageData={myPageData}
      newsData={newsData}
      reviewData={reviewData}
      tab={tab}
      setTab={setTab}
    />
  );
}
