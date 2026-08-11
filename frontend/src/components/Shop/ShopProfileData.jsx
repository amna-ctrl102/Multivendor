import { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
  }, [id, dispatch]);

  const [active, setActive] = useState(1);
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex gap-7">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${active === 1 ? "text-red-500" : "text-[#333]"} cursor-pointer`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${active === 2 ? "text-red-500" : "text-[#333]"} cursor-pointer`}
            >
              Running Events
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${active === 3 ? "text-red-500" : "text-[#333]"} cursor-pointer`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && isOwner ? (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} h-[42px]`}>
                  <span className="text-[#fff]">Go to Dashboard</span>
                </div>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/">
                <div className={`${styles.button} h-[42px]`}>
                  <span className="text-[#fff]">Back to Home</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
        {products &&
          products.map((i, index) => <ProductCard data={i} key={index} />)}
      </div>
      {products && products.length === 0 && (
        <h5 className="w-full text-center py-5 text-[18px]">
          No product have for this shop
        </h5>
      )}
    </div>
  );
};

export default ShopProfileData;
