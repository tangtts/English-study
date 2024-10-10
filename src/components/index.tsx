
import { Input } from 'antd';
import { alovaInstance } from '../api';

const { TextArea } = Input;
export const Index = () => {
  const onChangeChinese = (e: any) => {
    console.log(`change: ${e.target.value}`);
    alovaInstance.Post<string>(`/translate`, {
      sourceText: e.target.value,
      sourceLanguage:"zh",
      target:"en",
    }).then(res => {
      console.log(res)
    })
  };

  const onChangeEnglish = (e: any) => {
    console.log(`change: ${e.target.value}`);
  };


  return <div>
    <h1>快速翻译</h1>
    <div className='flex'>
      <TextArea className='flex-1' rows={6} placeholder="请输入中文"
        onChange={onChangeChinese} />
      <TextArea className='flex-1' rows={6} placeholder="请输入英文"
        onChange={onChangeEnglish} />
    </div>
  </div>
};