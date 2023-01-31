import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../css/Body.css'
import getApiProduct from "../api/ProductAPI";
import { ProductItem } from "./Body";
import Paging from "./Paging";
import Loading from "./Loading";

function SearchResult() {
    const [searchParam] = useSearchParams();
    const [dataProduct, setDataProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchKeywords = searchParam.get('q') ?? "";
    const paramDefault = {
        keywords: searchKeywords,
        PageNumber: 1,
        PageSize: 3,
    }
    //state param to send request changing page,search and fetch data at mounted
    const [param, setParam] = useState(paramDefault);

    //state pagination to store data pagination receive from response to used for changing page in <Paging/>
    const [pagination, setPagination] = useState({});


    useEffect(() => {
        if (searchKeywords.length === 0) { navigate('/', { replace: true }) }
    }, [])

    useEffect(() => {
        getProducts(param);
    }, [searchKeywords,param.PageNumber]);

    const getProducts = async (param) => {
        try {
            const response = await getApiProduct.getAllProductForHome(param);
            console.log("data products received: ", response);
            setDataProduct(response.items);
            setPagination(response.pagination);
            setIsLoading(false);
        }
        catch (error) {
            console.log(error)
            alert("Xảy ra lỗi, xin load lại")
        }
    };

    return (
        <>
            <div className="main">
                <div className="container-search">
                    <div className="result-number">
                        {isLoading?"":`Có ${pagination.totalCount} kết quả cho từ khóa ${searchKeywords}`}
                    </div>
                    <div className="result-display">
                        <div className="product-list-container">
                            {isLoading ? <Loading /> : dataProduct.map((x, index) => {
                                return (
                                    <ProductItem key={x.productId} item={x} productId={x.productId} />
                                )
                            })}
                        </div>
                        <Paging pagination={pagination} setParam={setParam} setIsLoading={setIsLoading} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchResult;