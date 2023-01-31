import "../../css/AccountProfile.css"
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import getApiProduct from "../../api/ProductAPI";
import shipApi from "../../api/ShipApi";
import { AccountContext } from "../../Context/AccountContext";

function AccountProfile() {
  const { currentAccount } = useContext(AccountContext)
  const id = currentAccount.accountId
  const [opt, setOpt] = useState(0);
  function handleOpt(opt) {
    setOpt(opt);
  }
  
  const [remakeInfo, setShowInfo] = useState(false) //update account profile
  const [remakePass, setNewPass] = useState(false)  //change password
  function setHigh(opt) {
    const navs = document.querySelectorAll('.sethigh')
    for (const nav of navs) {
      nav.classList.remove('active-myorder')
    }
    navs[opt].classList.add('active-myorder')
  }
  return (
    <>
      {remakeInfo ? <RemakeInfo setShowInfo={setShowInfo} id={id} /> : ""}
      {remakePass ? <RemakePassword setNewPass={setNewPass} id={id} /> : ""}
      <div className="fix-header"></div>
      <div className="my-profile-container">
        <div className="left-nav">
          <div className="profile-manager">Quản lý tài khoản</div>
          <div
            className="profile-nav sethigh active-myorder"
            onClick={() => {
              handleOpt(0);
              setHigh(0)
            }}
          >
            Thông tin cá nhân
          </div>
          <div
            className="profile-nav sethigh"
            onClick={() => {
              handleOpt(1);
              setHigh(1)
            }}
          >
            Địa chỉ nhận hàng
          </div>

          <div
            className="profile-nav sethigh"
            onClick={() => {
              handleOpt(2);
              setHigh(2)
            }}
          >
            Thêm địa chỉ nhận hàng
          </div>
        </div>
        <div className="right-profile-status">
          {currentAccount.accountId ? (
            opt === 0 ?
              <Profile setNewPass={setNewPass} setShowInfo={setShowInfo} />
              : opt === 1 ? <AccountShipContact />
                : <ShipContact  />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
function Profile({ setNewPass, setShowInfo }) {
  const { currentAccount } = useContext(AccountContext)
  const [accountProfile, setAccountProfile] = useState();
  useEffect(() => {
    profileApi()
  }, [])

  const profileApi = async () => {
    try {
      const accountProfileData = await getApiProduct.getProfile(currentAccount.accountId)
      
      setAccountProfile(accountProfileData);
    }
    catch (error) {
      console.log(error);
      alert("Fail to get account profile")
    }
  }

  return (
    <>
      {accountProfile ? (
        <div className="profile-container">
          <div className="fix-margin-left">
            <div className="accountDetail ">
              <span className="title">Tên: </span>
              <span className="detail">{accountProfile.accountUserName}</span>
            </div>
            <div className="accountDetail add-margin">
              <span className="title">Ngày sinh: </span>
              <span className="detail">{accountProfile.accountBirthday}</span>
            </div>
            <div className="accountDetail add-margin">
              <span className="title">Email: </span>
              <span className="detail">{accountProfile.accountEmail}</span>
            </div>
            <div className="remkeinfo-btn" onClick={() => {
              setShowInfo(true)
            }}>Thay Đổi Thông Tin</div>
            <div className="remkeinfo-btn" onClick={() => {
              setNewPass(true)
            }}>Đổi mật khẩu</div>
          </div>
        </div>
      ) : ""}

    </>
  );
}
function RemakePassword({ setNewPass, id }) {
  const oldPass = useRef(undefined)
  const newPass = useRef(undefined)
  const confirmPass = useRef(undefined)
  const error = useRef(undefined)
  function checkNullAndEmpty() {
    error.current.style.color = 'red'
    if (oldPass.current.value.trim().length === 0) {
      error.current.innerHTML = "Không được để trống!"
      return false
    }
    if (newPass.current.value.trim().length === 0) {
      error.current.innerHTML = "Không được để trống!"
      return false
    }
    if (confirmPass.current.value.trim().length === 0) {
      error.current.innerHTML = "Không được để trống!"
      return false
    }
    if (newPass.current.value.trim().length < 8) {
      error.current.innerHTML = "Mật khẩu lớn hơn 8 ký tự!"
      return false
    }
    if (!(newPass.current.value.trim() === confirmPass.current.value.trim())) {
      error.current.innerHTML = "Xác nhận không khớp!"
      return false
    }
    error.current.innerHTML = ''
    return true
  }
  async function remake() {
    if (!checkNullAndEmpty()) {
      return
    }
    const data = {
      accountId: id,
      oldPassword: oldPass.current.value.trim(),
      newPassword: newPass.current.value.trim()
    }
    try {
      await getApiProduct.remakepassword(data)
      error.current.innerHTML = ''
      alert("Cập nhật mật khẩu thành công")
    }
    catch (axiosError) {
      var resultCode = axiosError.response.data
      error.current.style.color = 'red'
      if (resultCode === -4) error.current.innerHTML = "Mật khẩu cũ nhập bị sai";
      else error.current.innerHTML = "Xảy ra lỗi, xin thử lại";
    }
  }
  return (
    <>
      <div className="full-device-pro5">
        <div className="remake-info-container">
          <div className="remake-info-title">
            <span className="remake-title-content">Thay đổi thông tin người dùng.</span>
          </div>
          <div className="remake-info-input-pass">
            <div className="input-content">
              <span>Mật khẩu cũ:</span>
              <input type="password" ref={oldPass} />
            </div>
            <div className="input-content">
              <span>Mật khẩu mới:</span>
              <input type="password" ref={newPass} />
            </div>
            <div className="input-content">
              <span>Xác nhận mật khẩu:</span>
              <input type="password" ref={confirmPass} />
            </div>
            <div ref={error} className="error-remake-info"></div>
          </div>
          <div className="remake-btn">
            <div className="remake-btn-content remake-btn-confirm" onClick={() => {
              remake()
            }}><span>Thay Đổi</span></div>
            <div className="remake-btn-content remake-btn-cancel" onClick={() => {
              setNewPass(false)
            }}><span>Hủy</span></div>
          </div>
        </div>
      </div></>
  )
}
function RemakeInfo({ setShowInfo, id }) {
  const [accountProfile, setAccountProfile] = useState();
  useEffect(() => {
    profileApi()
  }, [])

  const profileApi = async () => {
    try {
      const accountProfileData = await getApiProduct.getProfile(id)
      
      setAccountProfile(accountProfileData);
    }
    catch (error) {
      console.log(error);
      alert("Fail to get account profile")
    }
  }
  const name = useRef(undefined)
  const date = useRef(undefined)
  const email = useRef(undefined)

  const error = useRef(undefined)
  function checkNullAndEmpty() {
    error.current.style.color = 'red'
    if (name.current.value.trim().length === 0) {
      error.current.innerHTML = "Không được để trống họ tên!"
      return false
    }
    if (email.current.value.trim().length === 0) {
      error.current.innerHTML = "Không được để trống email!"
      return false
    }
    if (date.current.value.trim().length === 0) {
      error.current.innerHTML = "Chọn ngày tháng năm sinh!"
      return false
    }

    error.current.innerHTML = ''
    return true
  }
  async function remake() {
    if (!checkNullAndEmpty()) {
      return
    }
    const data = {
      accountId: id,
      accountEmail: email.current.value.trim(),
      accountBirthday: date.current.value.trim(),
      accountUserName: name.current.value.trim()
    }
    console.log("data sent to update profile: ",data)
    try {
      await getApiProduct.remakeAccountInfo(data)
      error.current.innerHTML = ''
      alert("Cập nhật thông tin thành công")
    }
    catch (axiosError) {
      var resultCode = axiosError.response.data
      error.current.style.color = 'red'
      if (resultCode === -1) error.current.innerHTML = "Username đã bị sử dụng";
      else if (resultCode === -2) error.current.innerHTML = "Email đã bị sử dụng";
      else if (resultCode === -5) error.current.innerHTML = "Ngày tháng sai định dạng";
      else error.current.innerHTML = "Xảy ra lỗi, xin thử lại";
    }
  }
  return (
    <>
      {accountProfile ? (
        <div className="full-device-pro5">
          <div className="remake-info-container">
            <div className="remake-info-title">
              <span className="remake-title-content">Thay đổi thông tin người dùng.</span>
            </div>
            <div className="remake-info-input">
              <div className="input-content">
                <span>Họ tên:</span>
                <input type="text" defaultValue={accountProfile.accountUserName} ref={name} />
              </div>
              <div className="input-content">
                <span>Ngày tháng năm sinh:</span>
                <input type="date" defaultValue={accountProfile.accountBirthday} ref={date} min={"1900-01-01"} />
              </div>
              <div className="input-content">
                <span>Email:</span>
                <input type="email" defaultValue={accountProfile.accountEmail} ref={email} />
              </div>

              <div ref={error} className="error-remake-info"></div>
            </div>
            <div className="remake-btn">
              <div className="remake-btn-content remake-btn-confirm" onClick={() => {
                remake()
              }}><span>Thay Đổi</span></div>
              <div className="remake-btn-content remake-btn-cancel" onClick={() => {
                setShowInfo(false)
              }}><span>Hủy</span></div>
            </div>
          </div>
        </div>
      ) : ""}
    </>
  )
}
function AccountShipContact() {
  const [accountContacts, setAccountContacts] = useState([]);
  const { currentAccount } = useContext(AccountContext)
  useEffect(() => {
    contactApi()
  }, [])
  const contactApi = async () => {
    try {
      const accountContactsData = await getApiProduct.getContacts(currentAccount.accountId)
      if(accountContactsData == 0)setAccountContacts([])
      setAccountContacts(accountContactsData);
    }
    catch (error) {
      console.log(error)
      const resultCode = error.response.data;
      if(resultCode == 0)setAccountContacts([])
      else(alert("Fail to load contacts data"))
    }
  }
  async function removeAccountShipContact(contactId) {
    await getApiProduct.removeAccountShipContact(contactId)
    contactApi()
  }
  return (
    <>
      {accountContacts.length > 0 ? accountContacts.map((contact, index) => {
        return (
          <div key={index} className="profile-container">
            <div className="fix-margin-left">
              <div className="accountDetail">
                <span className="title">Người nhận: </span>
                <span className="detail">{contact.receiverName}</span>
              </div>
              <div className="accountDetail add-margin">
                <span className="title">Địa chỉ nhận hàng: </span>
                <span className="detail">{contact.contactDetailAddress}</span>
                <br />
                <span className="detail">{contact.contactAreaDetail}</span>
              </div>
              <div className="accountDetail add-margin">
                <span className="title">Số điện thoại: </span>
                <span className="detail">{contact.contactPhoneNumber}</span>
              </div>
              {contact.isDefault ?
                (<div className="accountDetail add-margin accountDefault">
                  <span >Mặc định</span>
                </div>)
                : ""
              }
              <div className="delete-contact" onClick={() => {
                removeAccountShipContact(contact.accountShipContactID)
              }}>Xóa địa chỉ</div>
            </div>
          </div>
        )
      }) : <div className="emptyList">Hiện chưa có thông tin giao hàng</div>}

    </>
  );
}


function ShipContact() {
  const province = useRef(0)
  const district = useRef(0)
  const ward = useRef(0)
  const name = useRef(0)
  const sdt = useRef(0)
  const detail = useRef(0)
  const defaultContact = useRef(0)
  const [isDefault, setIsDefault] = useState(false)
  const [provinces, setProvinces] = useState(undefined)
  const [districts, setDistrists] = useState(undefined)
  const [wards, setWards] = useState(undefined)
  const {currentAccount}= useContext(AccountContext)
  useEffect(() => {
    const getProvince = async () => {
      const data = await shipApi.getProvince()
      setProvinces(data.data)
    }
    getProvince()
  }, [])
  async function getDistristByProvinceID(provinceID) {
    const getDistrist = async () => {
      const data = await shipApi.getDistrist(provinceID)
      setDistrists(data.data)
    }
    await getDistrist()
    getWardByProvinceID(districts[0]?.DistrictID)
  }
  async function getWardByProvinceID(districtID) {
    const getWard = async () => {
      const data = await shipApi.getWard(districtID)
      
      setWards(data.data)
    }
    getWard()
  }
  async function addNewShipContact() {
    error.current.style.color = 'red'
    error.current.innerHTML = ""
    if (district.current.value === '' || province.current.value === '' || ward.current.value === '') {
      error.current.innerHTML = 'Vui lòng chọn địa chỉ nhận hàng!'
      return
    }
    if (name.current.value.trim().length === 0 || sdt.current.value.trim().length === 0 || detail.current.value.trim().length === 0) {
      error.current.innerHTML = 'Không được để trống thông tin!'
      return
    }

    const sdtRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    //10 digit if has 0 first, else 9 digit total + VietName phone number rule

    if (!sdt.current.value.trim().match(sdtRegex)) {
      error.current.innerHTML = "SDT không hợp lệ!"
      return
    }
    const districtName = districts.find(x => x.DistrictID == district.current.value).DistrictName;
    const provinceName = provinces.find(x => x.ProvinceID == province.current.value).ProvinceName;
    const wardName = wards.find(x => x.WardCode == ward.current.value).WardName;
    const ContactAreaDetail = ` ${wardName}, ${districtName}, ${provinceName}`;
    let data = {
      accountId: currentAccount.accountId,
      contactDetailAddress: detail.current.value.trim(),
      contactAreaDetail: ContactAreaDetail,
      contactPhoneNumber: sdt.current.value,
      isDefault: isDefault,
      idDistrict: district.current.value,
      idProvince: province.current.value,
      receiverName: name.current.value,
      wardCode: ward.current.value
    }
    console.log(data)
    await getApiProduct.addNewShipContact(data)
    name.current.value = ""
    sdt.current.value = ''
    detail.current.value = ''
    district.current.value = ""
    province.current.value = ""
    ward.current.value = ""
    
    alert("Thêm thành công!")
  }
  const error = useRef(0)
  return (
    <>
      <div className='add-new-ship-contact-container-pro5'>
        <div className='add-new-ship-title'><h3>Thêm địa chỉ nhận hàng</h3></div>
        <div className='add-new-ship-cbb'>
          <select  ref={province} name="" id="" className='add-province-cbb' onChange={() => {
            getDistristByProvinceID(province.current.value)
          }}>
            <option value="" disabled selected hidden>Tỉnh/Thành Phố</option>
            {provinces ? provinces.map((item) => {
              return <option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</option>
            }) : ""}
          </select>

          <select ref={district} name="" id="" className='add-distrist-cbb' onChange={() => {
            getWardByProvinceID(district.current.value)
          }}>
            <option value="" disabled selected hidden>Quận/Huyện</option>
            {districts ? districts.map((item) => {
              return <option key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</option>
            }) : ""}
          </select>

          <select  ref={ward} name="" id="" className='add-ward-cbb'>
            <option value="" disabled selected hidden>Phường/Xã</option>

            {wards ? wards.map((item) => {
              return <option key={item.WardCode} value={item.WardCode}>{item.WardName}</option>
            }) : ""}
          </select>
          <div className='add-ship-contact-input-container'>
            <span className='add-contact-title-pro5'>Tên người nhận: </span>
            <input ref={name} type="text" className='add-contact-input-pro5' />
            <br/>
            <span className='add-contact-title-pro5'>SĐT người nhận: </span>
            <input ref={sdt} type="text" className='add-contact-input-pro5' />
            <br/>
            <span className='add-contact-title-pro5'>Số nhà, đường phố: </span>
            <input ref={detail} type="text" className='add-contact-input-pro5' />
            <input
              name="default"
              onChange={() => { setIsDefault(!isDefault) }}
              type="checkbox" ref={defaultContact} className="add-contact-input-pro5" />
            <label  className='add-contact-title-pro5' htmlFor="default" >Đặt làm mặc định</label>
          </div>
          <span ref={error}></span>
          <div className='add-ship-contact-btn-container'>

            <button className='btn-add-new-contact-pro5 add-btn-ship-contact' onClick={() => {
              addNewShipContact()
            }}>Thêm</button>
            <button onClick={() => {
            }} className='btn-add-new-contact-pro5 back-btn-ship-contact'>Trở Lại</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default AccountProfile;
