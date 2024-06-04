import { Button, Card, Checkbox, Flex, Form, FormProps, Input, Modal, Space, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from "react-router-dom";
import { alovaInstance } from "../api";
import { DataItem } from ".";
import { useEffect, useState } from "react";

type Add = Omit<DataItem, "id">

const addOrUpdate = (data: Add) => {
    return alovaInstance.Post(`/addOrUpdate`, data, {
        name: "all"
    });
};

export const WordPage = () => {
    const [form] = Form.useForm<DataItem>();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [translate, setTranslateText] = useState("")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const id = searchParams.get("id");
    useEffect(() => {
        if (id) {
            alovaInstance.Get<DataItem>(`/detail?id=${id}`).then(data => {
                form.setFieldsValue({
                    sourceText: data.sourceText,
                    transformText: data.transformText,
                    sourceOrigin: data.sourceOrigin,
                    examples: data.examples,
                    id: data.id
                });
            })
        }
    }, [])

    const onFinish: FormProps<Add>['onFinish'] = (values) => {
        addOrUpdate(values).then(() => {
            messageApi.success("添加成功");
            navigate("/");
        })
    };

    const onSearch = () => {
        const sourceText = form.getFieldValue("sourceText");
        if (!sourceText) return messageApi.warning("请输入英文");
        alovaInstance.Post<string>(`/translate`, {
            sourceText
        }).then(res => {
            setIsModalOpen(true);
            setTranslateText(res)
        })
    }
    return (
        <div>
            {messageContextHolder}
            <Modal title="查询结果" open={isModalOpen}
                cancelText="关闭" okText="确认"
                onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
                <p>{translate}</p>
            </Modal>
            <Card title={id ? "更新" : "新增"} extra={<Button type="primary" onClick={onSearch}> 查询 </Button>}>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ examples: [] }}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    <Form.Item<Add>
                        label="英文"
                        name="sourceText"
                        rules={[{ required: true, message: '请输入英文!' }]}
                    >
                        <Input className="h-12" />
                    </Form.Item>


                    <Form.Item<Add>
                        label="中文"
                        name="transformText"
                        rules={[{ required: true, message: '请输入中文翻译!' }]}
                    >
                        <Input className="h-12" />
                    </Form.Item>

                    <Form.Item<Add>
                        label="来源"
                        name="sourceOrigin"
                    >
                        <Input className="h-12" />
                    </Form.Item>


                    <Form.List
                        name="examples"
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        label={`例子${index + 1}`}
                                        key={field.key}
                                    >
                                        <Flex align="center">
                                            <div className="flex-1">
                                                <Form.Item
                                                    {...field} // 需要此属性进行表单提交
                                                    noStyle
                                                >
                                                    <Input.TextArea autoSize={{ minRows: 3 }} placeholder="请输入例子" />
                                                </Form.Item>
                                            </div>

                                            {fields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button w-[20px] h-[20px]"
                                                    onClick={() => remove(field.name)}
                                                />
                                            ) : null}
                                        </Flex>
                                    </Form.Item>
                                ))}
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        新增例子
                                    </Button>

                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    {/* <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>收藏</Checkbox>
                </Form.Item> */}

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button size="large" onClick={() => navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}