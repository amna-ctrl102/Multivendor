import ShopCreate from "../components/Shop/ShopCreate";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ShopCreatePage = () => {
  const navigate=useNavigate();
  const {isSeller, seller}=useSelector((state)=>state.seller);
  useEffect(()=>{
    if(isSeller === true && seller?._id){
      navigate(`/shop/${seller._id}`)
    }
  },[isSeller, navigate, seller?._id])
  return (
    <div>
      <ShopCreate/>
    </div>
  )
}

export default ShopCreatePage
