import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import Loader from "../../layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../../server";
import axios from "axios";
import { toast } from "react-toastify";

const AllCoupouns = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const getCoupouns = async () => {
      try {
        const res = await axios.get(
          `${server}/coupoun/get-coupoun/${seller._id}`,
          {
            withCredentials: true,
          },
        );
        setIsLoading(false);
        setCoupouns(res.data.coupounCode || []);
      } catch (error) {
        setIsLoading(false);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    };
    getCoupouns();
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/coupoun/delete-coupoun/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/coupoun/create-coupoun-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shop: seller,
        },
        {
          withCredentials: true,
        },
      );
      setOpen(false);
      console.log(res.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} mr-4`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupoun Code</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[50%] h-[97vh] bg-white rounded-lg shadow-md p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={25}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[25px] sm:text-[30px] font-Poppins text-center">
                  Create Coupoun Code
                </h5>
                <form onSubmit={handleSubmit}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your coupon code name..."
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      required
                      value={value}
                      className="mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your coupon code value..."
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your coupon code min amount..."
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your coupon code max amount..."
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected Products</label>
                    <select
                      className="w-full mt-2 border p-2 rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <button
                      type="submit"
                      className="text-sm mt-2 appearance-none block w-full p-2 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-[18px]"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupouns;
