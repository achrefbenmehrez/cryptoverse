import React, { useState } from "react";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { Row, Col, Card, Typography, Avatar, Select } from "antd";
import moment from "moment";
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from "./Loader";

const { Text, Title } = Typography;
const { Option } = Select;

const demoImage =
  "https://v2.cimg.co/news/77937/189587/adobestock-347093745.jpeg";

const News = ({ simplified }) => {
  const count = simplified ? 6 : 12;
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");

  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory,
    count,
  });
  
  const { data } = useGetCryptosQuery(100);

  if (!cryptoNews?.value) return <Loader />;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="select a Cryptocurrency"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase())}
          >
            <Option value='Cryptocurrency'>
              Cryptocurrency
            </Option>
            {data?.data?.coins?.map((currency) => <Option value={currency.name}>{currency.name}</Option>)}
          </Select>
        </Col>
      )}
      {cryptoNews.value.map((news, i) => (
        <Col xs={12} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title level={5} className="news-title">
                  {news.name}
                </Title>
                <img
                  style={{
                    maxWidth: "200px",
                    maxHeight: "100px",
                  }}
                  src={news?.image?.thumbnail?.contentUrl || demoImage}
                  alt="news img"
                />
              </div>
              <p>
                {news.description > 100
                  ? `${news.description.substring(100)} ...`
                  : news.description}
              </p>
              <div className="provider-container">
                <div>
                  <Avatar
                    src={
                      news.provider[0]?.image?.thumbnail?.contentUrl ||
                      demoImage
                    }
                    alt="provider img"
                  />
                  <Text className="provider-name">
                    {news.provider[0]?.name}
                  </Text>
                </div>
                <Text>
                  {moment(news.datePublished).startOf("ss").fromNow()}
                </Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
