import { useEffect, useState, useRef,useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import getApiProduct from '../../api/ProductAPI'
import {AccountContext} from '../../Context/AccountContext'
import adminApi from '../../api/AdminApi'
import "../../css/AppItem.css"

function AppItem() {
  const { id } = useParams();
  
  const [productDetail, setProductDetail] = useState();
  const [inforByColorIndex, setInforByColorIndex] = useState(0);
  const [sizeDetail,setSizeDetail]= useState("");
  const [colorDetail,setColorDetail]= useState("");

  const [stockNumber,setStockNumber]= useState(0);
  const {currentAccount} = useContext(AccountContext);
  const [colorData,setColorData]=useState({});
  const [sizeData,setSizeData]=useState({});

  const [productDataAdd2Cart,setProductDataAdd2Cart]= useState({
    accountId:currentAccount.accountId,
    productId:id,
    colorId:null,
    SizeId:null,
    quantity:1 
  })
  useEffect(() => {
    getProduct(id);
  }, []);
  useEffect(() => {
    getColorApi();
  }, []);
  useEffect(() => {
    getSizeApi();
  }, []);
  const getColorApi = async () => {
    try {
      setColorData(await adminApi.getColorData());
    }
    catch (error) { alert("Xảy ra lỗi khi load data màu") }
  }
  const getSizeApi = async () => {
    try {
      setSizeData(await adminApi.getSizeData());
    }
    catch (error) { alert("Xảy ra lỗi khi load data size") }
  }
  const getProduct = async (id) => {
    try{
      const data = await getApiProduct.getOneId(id);
      console.log("product detail data:",data);
      setProductDetail(data);
    }
    catch(error)
    {
      console.log(error)
      alert("Xin load lại")
    }
  };
  let currentPriceDisplay = productDetail? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(productDetail.currentPrice):""
  let originPriceDisplay = productDetail && productDetail.originPrice ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(productDetail.originPrice) : ""

  
  const handleChangeColor = (index) => {
    setInforByColorIndex(index)
    setProductDataAdd2Cart((prev)=>{
      return {
        ...prev,
        colorId:productDetail.inforByColor[index].colorId
      }
    })
    var newColorDetail = colorData.find(x=>x.colorId == productDetail.inforByColor[index].colorId)
    setColorDetail(newColorDetail.colorDetail)
  }
  const handleChangeSize = (sizeId) =>{
    setProductDataAdd2Cart((prev)=>{
      return {
        ...prev,
        SizeId:sizeId
      }
    })
    var newSizeDetail = sizeData.find(x=>x.sizeId == sizeId)
    setSizeDetail(newSizeDetail.sizeDetail)

    var attrList =productDetail.inforByColor[inforByColorIndex].productAttrList
    var attr = attrList.find(item=>item.sizeId == sizeId)
    setStockNumber(attr.stock)
  }

  function changQuantity(opt) {
    if (opt === 0) {
      if (quantityInput.current.value <= 0) {
        quantity0.current.style.color = 'red'
        quantity0.current.innerHTML = 'Số lượng không được nhỏ hơn 1!'
        return
      }
      quantityInput.current.value = Number(quantityInput.current.value) - 1
    }
    if (opt === 1) {
      quantityInput.current.value = Number(quantityInput.current.value) + 1
    }
  }
  const imgMain = useRef(0);
  function changImg(opt) {
    if (opt === 0) {
      imgMain.current.src =
        productDetail.inforByColor[inforByColorIndex].productImgBase64List[0];
    }
    if (opt === 1) {
      imgMain.current.src =
        productDetail.inforByColor[inforByColorIndex].productImgBase64List[1];
    }
  }
  const quantityInput = useRef(0);
  const quantity0 = useRef(0);
  function add2Bag() {
    
    if (currentAccount.accountId == null) {
      alert("Hãy đăng nhập để tiếp tục")
      return;
    }
    if (!quantityInput.current.value.match('^[0-9]+$')) {
      quantity0.current.style.color = 'red'
      quantity0.current.innerHTML = 'Hãy nhập số'
      return;
    }
    if (quantityInput.current.value <= 0) {
      quantity0.current.style.color = 'red'
      quantity0.current.innerHTML = 'Số lượng không được nhỏ hơn 0'
      return;
    }
    if (quantityInput.current.value > stockNumber) {
      quantity0.current.style.color = 'red'
      quantity0.current.innerHTML = 'Số lượng không đủ'
      return;
    }
    setProductDataAdd2Cart((prev)=>{
      return {
        ...prev,
        quantity:quantityInput.current.value
      }
    })
    //getApiProduct.addItem2Bag(productDataAdd2Cart);
    quantity0.current.innerHTML = ''
    console.log("data add to cart: ",productDataAdd2Cart)
    alert("Đã thêm vào giỏ hàng")
  }
  return (
    <>
      <div className="fix-header"></div>
      <div className="item-location">
        <span>trang chủ / </span>
        <span>
          {productDetail
            ?  productDetail.categoryType.categoryTypeDetail +
            " / " +
            productDetail.productName
            : ""}
        </span>
      </div>
      <div className="item-full-layout">
        <div className="half-width product-imgs">
          <div className="float-left list-img">
            <img
              className="img-0"
              src={
                productDetail
                  ? productDetail.inforByColor[inforByColorIndex].productImgBase64List[0]
                  : ""
              }
              alt="pic-1"
              onClick={function () {
                changImg(0);
              }}
            ></img>
            <img
              className="img-0"
              src={
                productDetail
                  ? productDetail.inforByColor[inforByColorIndex].productImgBase64List[1]
                  : ""
              }
              alt="pic-2"
              onClick={function () {
                changImg(1);
              }}
            ></img>
          </div>
          <div className="float-left current-img">
            <img
              ref={imgMain}
              className="imgMain"
              src={
                productDetail
                  ? productDetail.inforByColor[inforByColorIndex].productImgBase64List[0]
                  : ""
              }
              alt=""
            ></img>
          </div>
        </div>
        <div className="show-opt-and-add2bag">
          <div className="productName">
            {productDetail ? productDetail.productName : ""}
          </div>
          <div className="productPrice">
            <span>{currentPriceDisplay}</span>
            {originPriceDisplay?<del>{originPriceDisplay}</del>:""}
          </div>

          <div className="productProperty">
            Nước sản xuất :{" "}
            <span className="fix-property">
              {productDetail ? productDetail.producerDetail : ""}
            </span>
          </div>
          <div className="productProperty">
            Brand :{" "}
            <span className="fix-property">
              {productDetail ? productDetail.brandDetail : ""}
            </span>
          </div>

          <div className="productProperty">
            Color :{" "}
            <span className="fix-property">
              {colorDetail}
            </span>
          </div>
          {productDetail? productDetail.inforByColor.map((infor, index) => {
          return <ColorBtn key={infor.colorId} 
                           colorId={infor.colorId} 
                           index={index} 
                           handleChangeColor={handleChangeColor}  />
          }):""}
          
          <div className="productProperty">
            SIZE :{" "}
            <span className="fix-property">
              {productDetail ? sizeDetail : ""}
            </span>
          </div>
          <div className="size-btns-container">
          {productDetail? productDetail.inforByColor[inforByColorIndex].productAttrList.map((attr, index) => {
          return <SizeBtn key={index}
                          sizeId={attr.sizeId} 
                          stock={attr.stock} 
                          handleChangeSize ={handleChangeSize}
                          isChoosen={attr.sizeId === productDataAdd2Cart.SizeId} />
          }):""}
          </div>

          <div className="quantity-opt">
            <button
              className="btn-quantity-left btn"
              onClick={function () {
                changQuantity(0);
              }}
            >
              -
            </button>
            <input
              ref={quantityInput}
              type="number"
              readOnly
              className="quantity-input"
              defaultValue={1}
            ></input>
            <button
              disabled={quantityInput.current.value>=5}
              className="btn-quantity-right btn"
              onClick={function () {
                changQuantity(1);
              }}
            >
              +
            </button>
            <span className="quantity-online">
              {productDetail
                ? stockNumber + " sản phẩm có sẵn"
                : ""}
            </span>
          </div>
          <p ref={quantity0}></p>
          <div
            className="btn-add2bag"
            onClick={function () {
              add2Bag();
            }}
          >
            thêm vào giỏ hàng
          </div>
          <hr></hr>
          <div className="title-detail">Chi tiết</div>
          <div className="productDetail">
            {productDetail ? productDetail.productDetail : ""}
          </div>
          <hr></hr>
          <div className="title-detail">hướng dẫn bảo quản</div>
          <div className="productDetail"></div>
        </div>
      </div>
    </>
  );
}

function SizeBtn({ sizeId,stock, handleChangeSize ,isChoosen}) {
  const [sizeCode, setSizeCode] = useState("");
  const [isOutOfStock,setIsOutOfStock] = useState(false);
  useEffect(() => {
    getSizeApi();
  }, [])
  useEffect(()=>{
    if(stock === 0)
    {
      setIsOutOfStock(true);
    }
  },[])
  const getSizeApi = async () => {
    try {
      const sizeList = await adminApi.getSizeData();
      var size = sizeList.find((data) => data.sizeId === sizeId)
      setSizeCode(size.sizeCode)
    }
    catch (error) { alert("Xảy ra lỗi khi load data size") }
  }

  return (
    <>
      <button
        type="button"
        value={sizeId}
        onClick={(e) => handleChangeSize(e.target.value)}
        className={`size-btn  ${isOutOfStock?"out-stock":""} ${isChoosen?"choosen-size":""}`}
      >
        {sizeCode}
      </button>

    </>
  )
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
        type="button"
        value={index}
        onClick={(e) => handleChangeColor(e.target.value)}
        className={`product-color ${colorCode}`}
      >
      </button>

    </>
  )
}
export default AppItem;
