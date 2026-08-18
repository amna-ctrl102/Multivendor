import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const paymentSubmit = () => {
    navigate("/payment");
  };
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[85%] block 800px:flex">
        <div className="w-full 800px:w-[85%]">
          <ShippingInfo />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData />
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

const ShippingInfo = () => {
  const [country, setCountry] = useState("");

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
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input type="email" required className={`${styles.input} !p-3`} />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input type="number" required className={`${styles.input} !p-3`} />
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
            <select className="w-[95%] border p-3 rounded-[5px]">
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
              type="address"
              required
              className={`${styles.input} !w-[95%] !p-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input type="address" required className={`${styles.input} !p-3`} />
          </div>
        </div>

        <div></div>
      </form>
    </div>
  );
};

const CartData = () => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">$2610.00</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">-</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">-</h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">$2610.00</h5>
      <br />
      <form>
        <input
          type="text"
          className={`${styles.input} !p-3 pl-2`}
          placeholder="Coupoun code"
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
