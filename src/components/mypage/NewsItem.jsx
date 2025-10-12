import OptionsMenu from '../common/OptionsMenu';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';
import { Row } from '../../styles/flex';

export default function NewsItem({ news, onEdit, onDelete, style }) {
  const menuOptions = [
    { id: 1, label: '수정하기', onClick: onEdit },
    { id: 2, label: '삭제하기', onClick: onDelete },
  ];

  return (
    <Container style={style}>
      <Row $justify="space-between" align="center">
        <Title>{news.title}</Title>
        <Row $align="center" $gap={10}>
          <Date>{news.date}</Date>
          <OptionsMenu options={menuOptions} />
        </Row>
      </Row>
      <Content>{news.content}</Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 16px 0;
`;

const Title = styled.div`
  ${typo('subtitle1')}
  color: black;
`;

const Content = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;

const Date = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;
