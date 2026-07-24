import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct } from "../../../redux/actions/product";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(()=>{
    if(error){
        toast.error(error);
    }
    if(success){
        toast.success("Product created successfully!");
        navigate("/dashboard");
        window.location.reload();
    }
  }, [error,success,navigate])

  const handleImageChange = (e) => {
    e.preventDefault();

    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newForm= new FormData();

    images.forEach((image)=>{
        newForm.append("images", image);
    });
    newForm.append("name",name);
    newForm.append("description",description);
    newForm.append("category",category);
    newForm.append("tags",tags);
    newForm.append("originalPrice",originalPrice);
    newForm.append("discountPrice",discountPrice);
    newForm.append("stock",stock);
    newForm.append("shopId", seller._id);
    dispatch(createProduct(newForm));
  };

  return (
    <div className="w-[60%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[25px] sm:text-[30px] font-Poppins text-center">Create Product</h5>
      {/* Create Product Form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-3">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={name}
            className="mt-2 appearance-none block w-full p-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product name..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-3">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="8"
            type="text"
            name="description"
            required
            value={description}
            className="mt-2 appearance-none block w-full px-3 pt-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product description..."
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-3">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full mt-2 border p-3 rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-3">Tags</label>
          <input
            type="text"
            name="tags"
            required
            value={tags}
            className="mt-2 appearance-none block w-full p-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product tags..."
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-3">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            required
            value={originalPrice}
            className="mt-2 appearance-none block w-full p-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product price..."
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-3">Price (with Discount)</label>
          <input
            type="number"
            name="price"
            required
            value={discountPrice}
            className="mt-2 appearance-none block w-full p-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product price with discount..."
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-3">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            required
            value={stock}
            className="mt-2 appearance-none block w-full p-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product stock..."
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label className="pb-3">
            Upload Product Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="images"
            id="upload"
            required
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex items-center w-full flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={URL.createObjectURL(i)}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
        </div>
        <br />
        <div>
          <button
            type="submit"
            className="text-sm mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-[18px]"
          >Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
