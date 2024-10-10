import { FilterOutlined, SwapOutlined } from "@ant-design/icons";
import { Select, Tree } from "antd";

const Filter = (props) => {
  const {
    autoExpandParent,
    selectedKeys,
    handleChange,
    expandedKeys,
    checkedKeys,
    onExpand,
    onSelect,
    treeData,
    onCheck,
    options,
    url
  } = props;

  return (
    <>
      {props &&
        <>
          <h2><SwapOutlined style={{ marginRight: '10px' }} />Sắp xếp theo</h2>
          <Select
            defaultValue={options[0].value}
            style={{
              width: "100%",
              marginTop: "10px"
            }}
            onChange={handleChange}
            options={options}
          />
          <br></br>
          <br></br>
          <br></br>
          {!url.includes('/products/search') && <h2><FilterOutlined style={{ marginRight: '10px' }} />Bộ lọc</h2>}
          <br></br>
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
          />
        </>}
    </>
  );
}

export default Filter;