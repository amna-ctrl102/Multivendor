import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../layout/Loader";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading]= useState(false);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true)
    const getShopInfo = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${id}`, {
          withCredentials: true,
        });
        setData(res.data.shop);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    };

    getShopInfo();
  }, [id]);

  console.log(data);

  const LogOutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex items-center justify-center">
              <img
                src={`${backend_url}${data?.avatar}`}
                alt="sellerImage"
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[15px] flex items-center">
              {data?.description}
            </p>
          </div>
          <div className="p-3 break-words">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6] whitespace-normal">
              {data.address}
            </h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">10</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <h4 className="text-[#000000a6]">4/5</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Joined on</h5>
            <h4 className="text-[#000000a6]">
              {data?.createdAt?.slice(0, 10)}
            </h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <div className={`${styles.button} !w-full !h-[42px]`}>
                <span className="text-white">Edit Shop</span>
              </div>
              <div
                className={`${styles.button} !w-full !h-[42px]`}
                onClick={LogOutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
