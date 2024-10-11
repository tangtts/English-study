
import { Card, Input, List, message, Tag } from 'antd';
import { alovaInstance } from '../api';
import { useEffect, useState } from 'react';
import { debounce } from "lodash-es";
import  { CloseOutlined, CopyOutlined } from '@ant-design/icons';
const { TextArea } = Input;

interface HistoryItem {
  id: number,
  zhCh: string,
  en: string
}

export const Index = () => {
  const [english, setEnglish] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [searchHistoryListData, setSearchHistoryListData] = useState<HistoryItem[]>([])
  const onChangeChinese = (e: any) => {
    translate(e.target.value, "zh", "en").then(res => {
      setEnglish(res)
      alovaInstance.Post(`/setSearchHistory`, {
        en: res,
        zhCh: e.target.value
      }).then(getAllSearchHistory);
    })
  };

  
  const getAllSearchHistory = () => {
    alovaInstance.Get<HistoryItem[]>(`/getSearchHistoryList`).then(res => {
      setSearchHistoryListData(res)
    })
  }
  
  useEffect(() => {
    getAllSearchHistory()
  }, [])

  const translate = (sourceText: string, sourceLanguage: "zh" | "en", target: "zh" | "en") => {
    return alovaInstance.Post<string>(`/translate`, {
      sourceText,
      sourceLanguage,
      target,
    })
  }

  const onChangeEnglish = (e: any) => {
    setEnglish(e.target.value);
    translate(e.target.value, "en", "zh").then(res => {
      // setChinese(res)
    })
  };

  const copyEnglish = () => {
    navigator.clipboard.writeText(english).then(() => {
      messageApi.success('复制成功！');
    });
  }


  function deleteItem(item: HistoryItem) {
    alovaInstance.Post<string>(`/delSearchHistoryItem`, {
      id: item.id
    }).then(getAllSearchHistory)
  }

  return (<>
    {contextHolder}
    <div className='w-full'>
      <Card>
        <h1 className='text-lg mb-4'>快速翻译</h1>
        <div className='flex gap-4 relative'>
          <TextArea className='flex-1' rows={6} placeholder="请输入中文" onChange={debounce(onChangeChinese, 1000)}
          />
          <TextArea className='flex-1 ' disabled value={english} rows={6} placeholder="英文翻译"
            onChange={onChangeEnglish} />
          <CopyOutlined className='absolute right-2 bottom-2' onClick={copyEnglish} />
        </div>
      </Card>

      <Card className='mt-4'>
        <div >
          <h1 className='text-lg mb-4'>历史记录</h1>
          <List
            pagination={{ position: "bottom", align: "start" }}
            dataSource={searchHistoryListData}
            renderItem={(item) => (
              <List.Item>
                <div className='flex justify-between w-full'>
                  <Tag color="success">
                    {item.zhCh} / {item.en}
                  </Tag>
                  <CloseOutlined onClick={() => deleteItem(item)} />
                </div>
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  </>)
};