import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../css/Body.css";
import React, { useEffect, useRef, useState } from "react";
import getApiProduct from "../api/ProductAPI";
import adminApi from "../api/AdminApi";
import Paging from "./Paging";
import Loading from "./Loading";

function Body() {

  const [dataProduct, setDataProduct] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  
  const [categoryCode] = useSearchParams();
  const searchCode = categoryCode.get('c') ?? "";
  const navigate = useNavigate();

  const paramDefault = {
    categoryTypeCode: searchCode,
    PageNumber: 1,
    PageSize: 6,
  }
  //state param to send request changing page,search and fetch data at mounted
  const [param, setParam] = useState(paramDefault);
  //state pagination to store data pagination receive from response to used for changing page in <Paging/>
  const [pagination, setPagination] = useState({});
  useEffect(() => {
    if (searchCode.length === 0) { navigate('/', { replace: true }) }
  }, [])

  useEffect(() => {
    getProducts(param);
  }, [param]);

  useEffect(() => {
    getCategoryApi()
  }, [])

  const getProducts = async (param) => {
    try {
      const response = await getApiProduct.getAllProductForHome(param);
      setDataProduct(response.items);
      setPagination(response.pagination);
      setIsLoading(false);
      console.log("data products received: ", response);
    }
    catch (error) {
      console.log(error)
      alert("Xảy ra lỗi, xin load lại")
    }
  };
  const getCategoryApi = async () => {
    try {
      const data = await adminApi.getCategoryTypeData();

      setCategoryData(data);
    }
    catch (error) { alert("Xảy ra lỗi khi load data") }
  }
  const handleChangeCategory = (value) => {
    setIsLoading(true);
    setParam((prev) => {
      return {
        ...prev,
        categoryTypeCode: value
      }
    })

    navigate({
      pathname: "/",
      search: `?c=${value}`,
    })

  }


  return (
    <>
      <div className="main">
        <div className="container">
          <div className="main-column">
            <div className="row row-1"></div>
            <div className="row row-2">
              <div className="product-category">
                <div className="title-category">category</div>
                <div className="category-opt">
                  <button
                    key="all"
                    className="item-category hoverCategory"
                    onClick={() => {
                      setIsLoading(true);;
                      setParam(paramDefault)
                    }}
                  >
                    Tất cả sản phẩm
                  </button>
                  {categoryData.map((data) => {
                    return (
                      <button
                        key={data.categoryTypeId}
                        value={data.categoryTypeCode}
                        className="item-category hoverCategory"
                        onClick={(e) => { handleChangeCategory(e.target.value) }}
                      >
                        {data.categoryTypeDetail}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="product-list">
                <div className="title-product">{searchCode??"SHOP"}</div>
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
        </div>
      </div>
    </>
  );
}

function ProductItem({ item, productId }) {
  const [productImgsIndex, setProductImgsIndex] = useState(0);

  let currentPriceDisplay = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.currentPrice)
  let originPriceDisplay = item.originPrice ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.originPrice) : ""


  const handleMouseOver = (e) => {
    e.target.src = item.productImgs[productImgsIndex].productImgBase64List[0];
  }
  const handleMouseOut = (e) => {
    e.target.src = item.productImgs[productImgsIndex].productImgBase64List[1];
  }


  const handleChangeColor = (index) => {
    setProductImgsIndex(index)
  }
  return (
    <>
      <div
        className="product-item-container"

        id={item.productId}
      >
        <Link to={`/product-item/${productId}`}>
          <img
            className="product-image"
            src={item.productImgs[productImgsIndex].productImgBase64List[1]}
            alt={item.productName}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          ></img>
        </Link>

        <span className="product-price">{currentPriceDisplay}</span>
        {item.originPrice ? <del className="product-price origin-price">{originPriceDisplay}</del> : ""}
        <br></br>
        <span className="product-detail-name">{item.productName}</span>
        <br></br>
        {item.productImgs.map((item, index) => {
          return <ColorBtn key={item.colorId} 
          colorId={item.colorId} 
          index={index} 
          handleChangeColor={handleChangeColor}
          />
        })}

      </div>
    </>
  );
}

function ColorBtn({ colorId, index, handleChangeColor  }) {
  const [colorCode, setColorCode] = useState("");
  useEffect(() => {
    getColorApi();
  }, [])

  const getColorApi = async () => {
    try {
      const colorList = await adminApi.getColorData();
      var color = colorList.find((data) => data.colorId === colorId)
      setColorCode(color.colorCode);
    }
    catch (error) { alert("Xảy ra lỗi khi load data màu") }
  }

  return (
    <>
      <button
        title={colorCode}
        type="button"
        value={index}
        onClick={(e) => handleChangeColor(e.target.value)}
        className={`product-color ${colorCode}`}
      >
      </button>

    </>
  )
}

export { ProductItem, Body,ColorBtn };
