import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import { Column, Row } from '../../styles/flex';
import OptionsMenu from '../common/OptionsMenu';
import ModalImageSlider from '../common/ModalImageSlider';

import iconChevron from '../../assets/common/icon-arrow-down.svg';
import iconStarYellow from '../../assets/mypage/icon-star-yellow.svg';
import iconStarGray from '../../assets/mypage/icon-star-gray.svg';

export default function ReviewContent({ reviewData }) {
  const safeReviews = Array.isArray(reviewData) ? reviewData : [];
  const [selectedSort, setSelectedSort] = useState('최신순');

  // 리뷰별 이미지 확장 여부
  const [expandedMap, setExpandedMap] = useState({}); // { [reviewId]: boolean }

  // 라이트박스(모달) 상태
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
    title: '',
  });

  const sortOptions = [
    { label: '최신순', onClick: () => setSelectedSort('최신순') },
    { label: '별점 낮은 순', onClick: () => setSelectedSort('별점 낮은 순') },
    { label: '별점 높은 순', onClick: () => setSelectedSort('별점 높은 순') },
  ];

  const sortedReviews = useMemo(() => {
    try {
      const copied = [...safeReviews];
      switch (selectedSort) {
        case '별점 낮은 순':
          return copied.sort((a, b) => (a?.rate ?? 0) - (b?.rate ?? 0));
        case '별점 높은 순':
          return copied.sort((a, b) => (b?.rate ?? 0) - (a?.rate ?? 0));
        default:
          return copied.sort(
            (a, b) => new globalThis.Date(b?.date ?? 0) - new globalThis.Date(a?.date ?? 0)
          );
      }
    } catch (err) {
      console.error('[ReviewContent sort error]', err);
      return safeReviews;
    }
  }, [selectedSort, safeReviews]);

  const handleExpand = id => {
    setExpandedMap(prev => ({ ...prev, [id]: true }));
  };

  const openLightbox = (images, startIndex, title) => {
    setLightbox({
      isOpen: true,
      images: images,
      startIndex: startIndex,
      title: title || '상세 이미지',
    });
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <Container>
      {/* 상단 영역 */}
      <Row $justify={'space-between'} $align={'center'} style={{ marginBottom: '20px' }}>
        <ReviewCount>후기 {safeReviews.length}</ReviewCount>
        <Row $gap={6} $align={'center'}>
          <SortText>{selectedSort}</SortText>
          <OptionsMenu icon={iconChevron} iconSize={10} options={sortOptions} />
        </Row>
      </Row>

      {/* 후기 리스트 */}
      {safeReviews.length === 0 ? (
        <EmptyText>등록된 후기가 없습니다.</EmptyText>
      ) : (
        <Column>
          {sortedReviews.map((review, idx) => {
            if (!review) return null;

            const imgs = Array.isArray(review.reviewImages) ? review.reviewImages : [];
            const id = review.id ?? idx;
            const expanded = !!expandedMap[id];

            // 미확장 상태: 최대 4장까지만 보이게
            const visibleImages = expanded ? imgs : imgs.slice(0, 4);
            const hasMore = !expanded && imgs.length > 4;
            const moreCount = Math.max(0, imgs.length - 4);

            // 모달 제목: 리뷰어 이름 + (필드) 정도로 설정
            const title = review.reviewer
              ? review.field
                ? `${review.reviewer} · ${review.field}`
                : `${review.reviewer}`
              : '상세 이미지';

            return (
              <React.Fragment key={id}>
                <ReviewItem>
                  {/* 헤더 */}
                  <Row $justify={'space-between'} $align={'center'}>
                    <Row $gap={10} $align={'center'}>
                      <ProfileImg
                        src={review.profileImg || 'https://via.placeholder.com/32'}
                        alt="profile"
                      />
                      <Column>
                        <UserName>{review.reviewer || '익명 사용자'}</UserName>
                        <Row $gap={6} $align={'center'}>
                          <Row $gap={2.7}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <StarIcon
                                key={star}
                                src={star <= (review.rate ?? 0) ? iconStarYellow : iconStarGray}
                                alt="star"
                              />
                            ))}
                          </Row>
                          {review.field && <FieldBadge>{review.field}</FieldBadge>}
                        </Row>
                      </Column>
                    </Row>
                    <DateText>{review.date || '날짜 없음'}</DateText>
                  </Row>

                  {/* 본문 */}
                  <Comment>{review.content || '내용이 없습니다.'}</Comment>

                  {/* 이미지 그리드 */}
                  {imgs.length > 0 && (
                    <ImagesGrid>
                      {visibleImages.map((src, i) => {
                        const isFourth = i === 3; // 0-based index
                        const globalIndex = i; // 미확장 상태에서도 i는 0~3, 확장 상태에선 실제 인덱스
                        return (
                          <ImageCell
                            key={`${id}-${i}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => openLightbox(imgs, globalIndex, title)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openLightbox(imgs, globalIndex, title);
                              }
                            }}
                          >
                            <ReviewImage src={src} alt={`후기 이미지 ${i + 1}`} />
                            {/* 미확장 & 총 이미지가 5장 이상 & 지금이 4번째 셀일 때: 오버레이(확장만) */}
                            {hasMore && isFourth && (
                              <MoreOverlay
                                role="button"
                                aria-label="더보기"
                                onClick={e => {
                                  e.stopPropagation(); // 이미지 클릭으로 모달 열리는 것 방지
                                  handleExpand(id);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleExpand(id);
                                  }
                                }}
                              >
                                <MoreMainText>더보기</MoreMainText>
                                <MoreSubText>{`+${moreCount}`}</MoreSubText>
                              </MoreOverlay>
                            )}
                          </ImageCell>
                        );
                      })}
                    </ImagesGrid>
                  )}
                </ReviewItem>

                {/* 구분선 */}
                {idx !== sortedReviews.length - 1 && <DividingLine />}
              </React.Fragment>
            );
          })}
        </Column>
      )}

      {/* 이미지 라이트박스 모달 */}
      <ModalImageSlider
        title={'후기 사진'}
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        imageUrls={lightbox.images}
        startIndex={lightbox.startIndex}
      />
    </Container>
  );
}

/* ===============================
   Styled-components
   =============================== */
const GUTTER = 8; // 이미지 사이 간격

const Container = styled.div`
  width: 100%;
`;

const EmptyText = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.600')};
  text-align: center;
  margin-top: 40px;
`;

const ReviewCount = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.600')};
`;

const SortText = styled.div`
  ${typo('button2')}
  color: ${color('grayscale.600')};
  user-select: none;
`;

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.div`
  ${typo('button3')}
  color: ${color('black')};
`;

const FieldBadge = styled.div`
  display: flex;
  height: 22px;
  justify-content: center;
  align-items: center;
  padding: 10px 8px;
  border-radius: 30px;
  border: 0.5px solid ${color('brand.primary')};
  ${typo('caption2')}
  color: ${color('brand.primary')};
`;

const DateText = styled.div`
  ${typo('caption2')}
  color: ${color('grayscale.500')};
`;

const Comment = styled.div`
  ${typo('body2')}
  color: ${color('black')};
  white-space: pre-line;
`;

const StarIcon = styled.img`
  width: 14px;
  height: 14px;
`;

/* 4열 그리드: 4개면 꽉 차게, 더 많으면 다음 줄로 자동 개행 */
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${GUTTER}px;
`;

/* 각 셀은 정사각형 유지: aspect-ratio 사용 */
const ImageCell = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
`;

const ReviewImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* “더보기” 오버레이: 4번째 이미지 위에만 표시 (모달 대신 그리드 확장) */
const MoreOverlay = styled.button`
  all: unset;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.15s ease, transform 0.12s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.46);
    transform: translateY(-1px);
  }
`;

const MoreMainText = styled.div`
  ${typo('button2')}
  color: #fff;
`;

const MoreSubText = styled.div`
  ${typo('caption1')}
  opacity: 0.9;
`;

const DividingLine = styled.hr`
  margin: 12px 0;
  border: none;
  height: 1px;
  background-color: ${color('grayscale.500')};
`;
