import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const {allProducts}= useSelector((state)=>state.products)
  const { id } = useParams();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const data =allProducts && allProducts.find((i) => i._id === id);
    setData(data);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id, allProducts]);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        data && <SuggestedProduct data={data}/>
      }
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
