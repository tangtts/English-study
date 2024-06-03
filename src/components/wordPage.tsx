import { Button, Checkbox, Flex, Form, FormProps, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

type FieldType = {
    source?: string;
    target?: string;
    examples?: string[];
    remember?: boolean;
};
const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export const WordPage = () => {

    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item<FieldType>
                    label="英文"
                    name="source"
                    rules={[{ required: true, message: '请输入英文!' }]}
                >
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="中文"
                    name="target"
                    rules={[{ required: true, message: '请输入中文翻译!' }]}
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
                <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>收藏</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Space>
                        <Button size="large" type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button size="large">
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}