import { Button, Flex, Input, Card, Tag, Row, Col, Badge, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { alovaInstance } from '../api';
import { useRequest, useWatcher } from 'alova';
import { ChangeEvent, useEffect, useState } from 'react';
import { WordPage } from './wordPage';
import { debounce } from 'lodash-es';

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



export const WordIndex: React.FC = () => {
  const [a2zListData, setA2zListData] = useState<a2z>({});
  const getAllSearchHistory = () => {
    alovaInstance.Get<a2z>(`/wordbook/allLetter`).then(res => {
      setA2zListData(res)
    })
  }

  useEffect(getAllSearchHistory, [])


  const [word, setWord] = useState('');
  const [searchData, setSearchData] = useState<DataItem[]>([]);

  const search = (word: string) => {
    return alovaInstance.Post<DataItem[]>(`/wordbook/search`, {
      word
    }).then(res => {
      setSearchData(res)
    })
  }
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value)
    return search(e.target.value)
  }

  return (
    <Flex vertical gap="middle">
      <Flex gap="small" align='center'>
        <Input size='large' placeholder="搜索历史记录" onChange={debounce(onChange, 500)} />
        <Button size='large' type="primary" onClick={() => search(word)}>搜索</Button>
      </Flex>

      <Card title="历史记录联想">
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
        <Row justify="center" gutter={[20, 10]} >
          {
            Object.keys(a2zListData).map(key => {
              return (
                <Col span={5} key={key}>
                  <Badge count={a2zListData[key].count} >
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