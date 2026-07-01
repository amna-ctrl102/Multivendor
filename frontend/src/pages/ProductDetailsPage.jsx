import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productData } from "../static/data";

const ProductDetailsPage = () => {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const productName = name.replace(/-/g, " ");
  
  useEffect(() => {
    const data = productData.find((i) => i.name === productName);
    setData(data);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [productName]);

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
