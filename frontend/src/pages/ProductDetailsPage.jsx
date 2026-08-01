import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const {allProducts}= useSelector((state)=>state.products)
  const { name } = useParams();
  const [data, setData] = useState(null);
  const productName = name.replace(/-/g, " ");
  
  useEffect(() => {
    const data =allProducts && allProducts.find((i) => i.name.toLowerCase() === productName.toLowerCase());
    setData(data);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [productName, allProducts]);

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
