
import { Button, Input, List, Tag } from 'antd';
import { alovaInstance } from '../api';
import { useEffect, useState } from 'react';
import { useWatcher } from 'alova';
import { debounce } from "lodash-es";
import Icon, { CloseOutlined, CopyOutlined } from '@ant-design/icons';
const { TextArea } = Input;

interface HistoryItem {
  id: number,
  zhCh: string,
  en: string
}

export const Index = () => {
  const [chinese, setChinese] = useState("")
  const [english, setEnglish] = useState("");


  const onChangeChinese = (e: any) => {
    setChinese(e.target.value);
    search(e.target.value, "zh", "en").then(res => {
      setEnglish(res)
      alovaInstance.Post(`/setSearchHistory`, {
        en: res,
        zhCh: e.target.value
      }).then(() => {
        getAllHistory();
        e.target.value = ""
      });
    })

  };

  const [data, setData] = useState<HistoryItem[]>([])
  const getAllHistory = () => {
    alovaInstance.Get<HistoryItem[]>(`/getSearchHistoryList`).then(res => {
      setData(res)
    })
  }
  useEffect(() => {
    getAllHistory()
  }, [])

  const search = (sourceText: string, sourceLanguage: "zh" | "en", target: "zh" | "en") => {
    return alovaInstance.Post<string>(`/translate`, {
      sourceText,
      sourceLanguage,
      target,
    })
  }

  const onChangeEnglish = (e: any) => {
    setEnglish(e.target.value);
    search(e.target.value, "en", "zh").then(res => {
      setChinese(res)
    })
  };

  const copyEnglish = () => {
    navigator.clipboard.writeText(english);
  }




  return <div className='w-full'>
    <h1 className='text-lg my-4'>快速翻译</h1>
    <div className='flex gap-4 relative'>
      <TextArea className='flex-1' rows={6} placeholder="请输入中文" onChange={debounce(onChangeChinese, 1000)}
      />
      <Button onClick={onChangeChinese}>搜索</Button>
      <TextArea className='flex-1' disabled value={english} rows={6} placeholder="英文"
        onChange={onChangeEnglish} />
      <CopyOutlined className='absolute right-2 bottom-2' onClick={copyEnglish} />
    </div>
    <div className='mt-4'>
      <h1 className='text-lg'>历史记录</h1>
      <List
        pagination={{ position: "bottom", align: "start" }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div className='flex justify-between w-full'>
              <Tag color="success">
                {item.zhCh} / {item.en}
              </Tag>
              <CloseOutlined />
            </div>

          </List.Item>
        )}
      />
    </div>
  </div>
};