// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const SEAT_PRICE = 45000;

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [userInfo, setUserInfo] = useState({});
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const currentUserStr = localStorage.getItem("currentUser");
//   const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

//   const storedMovie = JSON.parse(localStorage.getItem("selectedMovie"));
//   const storedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

//   const queryParams = new URLSearchParams(location.search);
//   const querySeats = queryParams.get("seats")?.split(",").filter(Boolean) || [];

//   if (!currentUser) {
//     alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
//     navigate("/login");
//     return
//   }
//   // Gọi API để lấy thông tin người dùng
//   const fetchUserInfo = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Không lấy được thông tin user");
//       }
//       const data = await response.json();
//       setUserInfo(data);
//     } catch (error) {
//       console.error("Lỗi khi lấy thông tin user:", error);
//       alert("Không lấy được thông tin người dùng. Vui lòng đăng nhập lại.");
//       navigate("/login");
//     }
//   };
//   fetchUserInfo();
//   setUserInfo(currentUser); 
//   setSelectedMovie(storedMovie);
//   setSelectedSeats(querySeats.length > 0 ? querySeats : storedSeats);


//   setLoading(false);
// }, [navigate, location]);


//   const total = selectedSeats.length * SEAT_PRICE;

//   const handlePayment = () => {
//     // Lưu thông tin thanh toán vào localStorage
//     const paymentInfo = {
//       title: selectedMovie.title,
//       seats: selectedSeats,
//       amount: total,  // Tổng tiền
//     };
//     localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

//     // Chuyển hướng đến trang QR Code
//     navigate("/qr-code");
//   };

//   if (loading || !userInfo || !selectedMovie) {
//     return <div className="text-center mt-10">Đang tải...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Xác nhận thanh toán</h2>

//       <div className="bg-white rounded-lg shadow p-4 space-y-4">
//         <div>
//           <strong>🎬 Tên phim:</strong> {selectedMovie.title}
//         </div>
//         <div>
//           <strong>🗓️ Ngày chiếu:</strong> {selectedMovie.showDate || "Chưa rõ"}
//         </div>
//         <div>
//           <strong>🕒 Lịch chiếu:</strong> {selectedMovie.showTime || "Chưa rõ"}
//         </div>
//         <div>
//           <strong>🎟 Ghế đã chọn:</strong> {selectedSeats.join(", ")}
//         </div>
//         <div>
//           <strong>💰 Tổng tiền:</strong>{" "}
//           <span className="text-green-600 font-bold">{total.toLocaleString()} đ</span>
//         </div>

//         <div className="border-t pt-4">
//           <h3 className="font-bold text-blue-600 mb-2">Thông tin người đặt:</h3>
//           <p><strong>👤 Họ tên:</strong> {userInfo.fullName || "Chưa có"}</p>
//           <p><strong>📅 Ngày sinh:</strong> {userInfo.dateOfBirth || "Chưa có"}</p>
//           <p><strong>🏠 Địa chỉ:</strong> {userInfo.address || "Chưa có"}</p>
//           <p><strong>📞 Số điện thoại:</strong> {userInfo.phone || "Chưa có"}</p>
//         </div>

//         <button
//           className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//           onClick={handlePayment}
//         >
//           Xác nhận thanh toán
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SEAT_PRICE = 45000;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserStr = localStorage.getItem("currentUser");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    const storedMovie = JSON.parse(localStorage.getItem("selectedMovie"));
    const storedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

    const queryParams = new URLSearchParams(location.search);
    const querySeats = queryParams.get("seats")?.split(",").filter(Boolean) || [];

    if (!currentUser) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Không lấy được thông tin user");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        alert("Không lấy được thông tin người dùng. Vui lòng đăng nhập lại.");
        navigate("/login");
      }
    };

    fetchUserInfo();
    setSelectedMovie(storedMovie);
    setSelectedSeats(querySeats.length > 0 ? querySeats : storedSeats);
    setLoading(false);
  }, [navigate, location]);

  const total = selectedSeats.length * SEAT_PRICE;

  const handlePayment = async () => {
    try {
      const currentUserStr = localStorage.getItem("currentUser");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

      if (!currentUser || !currentUser.token) {
        alert("Bạn cần đăng nhập để thanh toán.");
        navigate("/login");
        return;
      }

      const paymentRequest = {
        amount: total,
        seats: selectedSeats,
        movieTitle: selectedMovie.title,
        userId: currentUser.id,
        orderDescription: `Thanh toán vé phim: ${selectedMovie.title} - Ghế: ${selectedSeats.join(", ")}`
      };

      const response = await fetch("http://localhost:8080/api/vnpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!response.ok) {
        throw new Error("Không thể thực hiện thanh toán.");
      }

      const { paymentUrl } = await response.json();

      // Chuyển hướng tới trang thanh toán VNPAY
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    }
  };

  if (loading || !userInfo || !selectedMovie) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Xác nhận thanh toán</h2>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <strong>🎬 Tên phim:</strong> {selectedMovie.title}
        </div>
        <div>
          <strong>🗓️ Ngày chiếu:</strong> {selectedMovie.showDate || "Chưa rõ"}
        </div>
        <div>
          <strong>🕒 Lịch chiếu:</strong> {selectedMovie.showTime || "Chưa rõ"}
        </div>
        <div>
          <strong>🎟 Ghế đã chọn:</strong> {selectedSeats.join(", ")}
        </div>
        <div>
          <strong>💰 Tổng tiền:</strong>{" "}
          <span className="text-green-600 font-bold">{total.toLocaleString()} đ</span>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold text-blue-600 mb-2">Thông tin người đặt:</h3>
          <p><strong>👤 Họ tên:</strong> {userInfo.fullName || "Chưa có"}</p>
          <p><strong>📅 Ngày sinh:</strong> {userInfo.dateOfBirth || "Chưa có"}</p>
          <p><strong>🏠 Địa chỉ:</strong> {userInfo.address || "Chưa có"}</p>
          <p><strong>📞 Số điện thoại:</strong> {userInfo.phone || "Chưa có"}</p>
        </div>

        <button
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={handlePayment}
        >
          Xác nhận thanh toán qua VNPAY
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
