import {Select} from 'antd';
import {getCollectionsByChain} from "@shared/helpers/collections";


function SearchCollections({setInputValue}) {
    const {Option} = Select;
    function onChange(value) {
        setInputValue(value);
    }

    return (
        <>
            <Select
                showSearch
                style={{
                    width: "1000px",
                    marginLeft: "20px"
                }}
                placeholder="Find a Collection"
                optionFilterProp="children"
                onChange={onChange}
            >
            </Select>

        </>
    )
}
export default SearchCollections;
