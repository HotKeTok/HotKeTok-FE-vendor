import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import Button from '../common/Button';
import NewsItem from './NewsItem';
import { Column } from '../../styles/flex';
import { useState } from 'react';
import ModalNewsRegister from './ModalNewsRegister';
import ModalConfirm from '../common/ModalConfirm';

export default function NewsContent({ newsData, onEdit, onDelete }) {
  const [modal, setModal] = useState(null); // null | 'register' | 'delete'
  const [selectedNewsId, setSelectedNewsId] = useState(null); // 삭제/수정시 선택된 뉴스 ID
  const [newsInput, setNewsInput] = useState({ title: '', content: '' });

  // 삭제 모달 오픈
  const handleDeleteBtnClick = newsId => {
    setSelectedNewsId(newsId);
    setModal('delete');
  };

  // 실제 삭제
  const handleDeleteConfirm = () => {
    if (selectedNewsId) {
      onDelete(selectedNewsId);
    }
    // todo: toast 추가
    handleModalClose();
  };

  // 수정 모달 오픈
  const handleEditBtnClick = newsId => {
    setSelectedNewsId(newsId);
    setNewsInput(newsData.find(item => item.id === newsId) || { title: '', content: '' });
    setModal('register');
  };

  // 실제 등록/ 수정
  const handleRegisterBtnClick = () => {
    onEdit(selectedNewsId);
    // 수정이라면 id, 등록이라면 null
    handleModalClose();
  };

  const handleModalClose = () => {
    setNewsInput({ title: '', content: '' });
    setSelectedNewsId(null);
    setModal(null);
  };

  return (
    <Column>
      {modal === 'register' && (
        <ModalNewsRegister
          isOpen={modal === 'register'}
          onClose={handleModalClose}
          isEdit={!!selectedNewsId}
          initialData={
            newsData.find(item => item.id === selectedNewsId) || { title: '', content: '' }
          }
          editData={newsData.find(item => item.id === selectedNewsId)}
          newsInput={newsInput}
          setNewsInput={setNewsInput}
          onRegister={handleRegisterBtnClick}
        />
      )}
      {modal === 'delete' && (
        <ModalConfirm
          isOpen={modal === 'delete'}
          title="소식 삭제"
          description="소식을 삭제하시겠어요?"
          confirmText="삭제하기"
          onClose={handleModalClose}
          onConfirm={handleDeleteConfirm}
        />
      )}
      <RightBtn>
        <CustomButton onClick={() => setModal('register')}>글 작성하기</CustomButton>
      </RightBtn>
      <Column>
        {newsData.map((news, index) => (
          <NewsItem
            key={index}
            news={news}
            onEdit={() => handleEditBtnClick(news.id)}
            onDelete={() => handleDeleteBtnClick(news.id)}
            style={{ borderBottom: index === newsData.length - 1 ? 0 : '1px solid #eee' }}
          />
        ))}
      </Column>
    </Column>
  );
}

const RightBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CustomButton = styled.button`
  ${typo('button3')}
  color: #fff;
  background-color: ${color('brand.primary')};
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
