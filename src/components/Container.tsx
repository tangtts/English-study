import { Tabs } from "antd"
import { useNavigate } from "react-router-dom";

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const onChange = (key: string) => {
    if (key == "1") {
      navigate("/")
    } else {
      navigate("/wordIndex")
    }
  }

  return (
    <>
      <div className='bg-gray-700 h-screen py-3'>
        <div className='w-[800px] mx-auto bg-gray-200 h-full p-4 rounded-md flex'>
          <Tabs
            className="w-full"
            onChange={onChange}
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: '快速翻译',
                children: children,
              },
              {
                key: '2',
                label: '单词本',
                children: children,
              },
            ]} />
        </div>
      </div>
    </>
  )
}