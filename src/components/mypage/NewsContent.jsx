import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import Button from '../common/Button';
import NewsItem from './NewsItem';
import { Column } from '../../styles/flex';

export default function NewsContent({ newsData, onEdit, onDelete }) {
  return (
    <Column>
      <RightBtn>
        <CustomButton>글 작성하기</CustomButton>
      </RightBtn>
      <Column>
        {newsData.map((news, index) => (
          <NewsItem
            key={index}
            news={news}
            onEdit={() => onEdit(news.id)}
            onDelete={() => onDelete(news.id)}
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
