import { Button, Flex, Input, Card, Tag, Row, Col, Badge, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { alovaInstance } from '../api';
import { useRequest, useWatcher } from 'alova';
import { ChangeEvent, useState } from 'react';
import { WordPage } from './wordPage';

interface a2z {
  [key: string]: {
    count: number;
    data: string[];
  }
}

export interface DataItem {
  id: number
  sourceText: string
  transformText: string
  sourceOrigin: string,
  examples: string[]
}

// 搜索联想
const search = (word: string) => {
  return alovaInstance.Post<DataItem[]>(`/search`, {
    word
  });
};
const getAllLetter = alovaInstance.Get('/all');
export const WordIndex: React.FC = () => {
  let a2zData: a2z = {};
  const { data } = useRequest(getAllLetter, {
    hitSource: 'all',
    initialData: {}
  })
  a2zData = data as a2z;

  const [word, setWord] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  }

  const {
    data: searchData = [],
  } = useWatcher(
    () => search(word),
    [word],
    {
      debounce: 500
    }
  );
  return (
    <Flex vertical gap="middle">
      <Flex gap="small" align='center'>
        <Input size='large' placeholder="搜索" defaultValue={word} onChange={onChange} />
        <Button size='large' type="primary" onClick={() => search(word)}>搜索</Button>
      </Flex>

      <Card title="搜索联想">
        <Row gutter={[6, 8]}>
          {
            searchData.length ?
              searchData.map(item => {
                return <Col span={6} key={item.id}>
                  <Tag color="processing" className='w-14 text-center'>
                    <Link type='primary' to={`/wordPage?id=${item.id}`}>
                      {item.sourceText}
                    </Link>
                  </Tag>
                </Col>
              }) : <Empty
                description="暂无数据"
                className='mx-auto'
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 80 }}
              >
                <Button type="primary" size="large">
                  <Link to="/wordPage" >
                    创建
                  </Link>
                </Button>
              </Empty>
          }
        </Row>
      </Card>
      <Card title="A-Z">
        <Row justify="center" gutter={[24, 20]} >
          {
            Object.keys(a2zData).map(key => {
              return (
                <Col span={5} key={key}>
                  <Badge count={a2zData[key].count} >
                    <Link to={`/letterPage?letter=${key}`}>
                      <Button size='large' className='w-20 mx-auto'>
                        {key}
                      </Button>
                    </Link>
                  </Badge>
                </Col>
              )
            })
          }
        </Row>
      </Card>
    </Flex>
  )
}