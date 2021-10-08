import React from "react";
import { Empty } from "antd";
import 'antd/dist/antd.css'

const EmptyPlaceholder = (props) => {
    const {description=''} = props
  return (
    <Empty description={description} />
  );
};

export default EmptyPlaceholder;
