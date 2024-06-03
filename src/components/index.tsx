import { Button, Flex, Input, Card, Tag, Row, Col, Badge } from 'antd';
import { Link } from 'react-router-dom';

export const Index: React.FC = () => {
  return (
    <Flex vertical gap="middle">
      <Flex gap="small">
        <Input placeholder="搜索" />
        <Button type="primary">搜索</Button>
      </Flex>

      <Card title="搜索联想">
        <Row gutter={[6, 6]}>
          <Col span={6}>
            <Tag>
              Card content
            </Tag>
          </Col>
          <Col span={6}>
            <Tag>
              Card content
            </Tag>
          </Col>
          <Col span={6}>
            <Tag>
              Card content
            </Tag>
          </Col>
          <Col span={6}>
            <Tag>
              Card content
            </Tag>
          </Col>
          <Col span={6}>
            <Tag>
              Card content
            </Tag>
          </Col>
        </Row>
      </Card>
      <Card title="A-Z">
        <Row gutter={[6, 6]}>
          <Col span={6}>
            <Badge count={99}>
              <Link to="/wordPage/a">
                <Button>
                  a
                </Button>
              </Link>
            </Badge>
          </Col>
          <Col span={6}>
            <Badge count={99}>
              <Button>
                a
              </Button>
            </Badge>
          </Col>
          <Col span={6}>
            <Badge count={99}>
              <Button>
                a
              </Button>
            </Badge>
          </Col>
        </Row>
      </Card>
    </Flex>

  )
}