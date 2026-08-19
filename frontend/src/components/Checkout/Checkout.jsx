import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userInfo, setUserInfo] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState({});
  const [discountPrice, setDiscountPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address1 === "" || zipCode === null || country === "" || city === "") {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        country,
        city,
        address1,
        address2,
        zipCode,
      };

      const orderData = {
        cart,
        user,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
      };
      localStorage.setItem("latesOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => {
    return item.discountPrice
      ? acc + item.qty * item.discountPrice
      : acc + item.qty * item.originalPrice;
  }, 0);

  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = couponCode.trim();
    if (!name) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const res = await axios.get(
        `${server}/coupoun/get-coupoun-value/${encodeURIComponent(name)}`,
        {
          withCredentials: true,
        },
      );

      const coupon = res.data?.couponCode;
      if (!coupon) {
        toast.error("Coupon code doesn't exits");
        setCouponCode("");
        return;
      }

      const shopId = coupon?.shop?._id;
      const couponCodeValue = Number(coupon?.value || 0);

      if (!shopId) {
        toast.error("Coupon code is invalid");
        setCouponCode("");
        return;
      }

      const validItems = cart?.filter((item) => item.shopId === shopId) || [];
      if (validItems.length === 0) {
        toast.error("Coupon code is not valid for this shop");
        setCouponCode("");
        return;
      }

      const eligiblePrice = validItems.reduce(
        (acc, item) =>
          item.discountPrice
            ? acc + item.qty * item.discountPrice
            : acc + item.qty * item.originalPrice,
        0,
      );

      const newDiscount = (eligiblePrice * couponCodeValue) / 100;
      const nextCouponData = {
        ...couponCodeData,
        [shopId]: { ...coupon, amount: newDiscount },
      };

      const nextDiscountPrice = Object.values(nextCouponData).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

      setCouponCodeData(nextCouponData);
      setDiscountPrice(nextDiscountPrice);
      setCouponCode("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const discountPercentage = Number(discountPrice || 0);
  const totalPrice =
    discountPercentage > 0
      ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
      : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[85%] block 800px:flex">
        <div className="w-full 800px:w-[85%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            cart={cart}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponCodeData={couponCodeData}
            setCouponCodeData={setCouponCodeData}
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice}
            subTotalPrice={subTotalPrice}
            shipping={shipping}
            handleSubmit={handleSubmit}
            discountPercentage={discountPercentage}
            totalPrice={totalPrice}
          />
        </div>
      </div>
      <div className="flex justify-center mt-8 mb-7" onClick={paymentSubmit}>
        <button
          className="w-full sm:w-[320px] h-12 flex items-center justify-center bg-[#3ad132] text-white rounded-lg uppercase font-semibold hover:opacity-95 hover:shadow-md transition disabled:opacity-80"
          type="submit"
        >
          Go to payment
        </button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  userInfo,
  setUserInfo,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              required
              value={user && user.name}
              readOnly
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              required
              value={user && user.email}
              readOnly
              className={`${styles.input} !p-3`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              readOnly
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !p-3`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border p-3 rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <select
              className="w-[95%] border p-3 rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input} !p-3`}
            />
          </div>
        </div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose from saved address
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div key={index} className="w-full flex mt-2">
                <input
                  type="checkbox"
                  className="mr-3"
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setCountry(item.country) ||
                    setCity(item.city) ||
                    setZipCode(item.zipCode)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  cart,
  couponCode,
  setCouponCode,
  couponCodeData,
  setCouponCodeData,
  discountPrice,
  setDiscountPrice,
  subTotalPrice,
  shipping,
  handleSubmit,
  discountPercentage,
  totalPrice,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentage ? "$" + discountPercentage.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} !p-3 pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
