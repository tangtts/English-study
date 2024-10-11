import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { alovaInstance } from "../api";
import { DataItem } from "./wordIndex";
import { Button, Card, Col, Empty, List, Row, Spin, Tag, Typography } from "antd";

export const AllByLetter = () => {

  let [searchParams] = useSearchParams();
  const navigate = useNavigate()
  let letter = searchParams.get("letter");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<DataItem[]>([]);
  const searchByLetter = () => {
    setLoading(true);
    alovaInstance.Get<DataItem[]>(`/searchByLetter?letter=${letter}`
    ).then(res => {
      setSearchData(res);
      setLoading(false);
    })
  }

  useEffect(() => {
    searchByLetter();
  }, [letter])


  return <div>
    <Card title="按字母查询" extra={<Button type="primary" onClick={() => navigate(-1)}>返回</Button>}>
      {
        loading ? <Spin className="mx-auto" /> :
          searchData.length ?
            <List itemLayout="horizontal" dataSource={searchData}
              renderItem={
                (item) => (
                  <List.Item
                    actions={
                      [
                        <Link to={`/wordPage?id=${item.id}`}>
                          <Button size="small" type="link" key="list-loadmore-more">
                            详情
                          </Button>
                        </Link>,
                        <Button danger size="small" type="text" key="list-loadmore-more"
                          onClick={() => {
                            alovaInstance.Get<DataItem[]>(`/delete?id=${item.id}`).then(() => {
                              searchByLetter()
                            })
                          }}
                        >删除</Button>]}>
                    <List.Item.Meta
                      title={ item.sourceText+ " / " + item.transformText}
                    />
                  </List.Item>
                )
              }
            >
            </List>
            : <Empty
              description="暂无数据"
              className='mx-auto'
              imageStyle={{ height: 80 }}
            >
              <Button type="primary" size="large">
                <Link to="/wordPage" >
                  创建
                </Link>
              </Button>
            </Empty>
      }

    </Card>
  </div>
}


