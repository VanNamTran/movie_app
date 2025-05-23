// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import QRCode from 'react-qr-code';

// const QRCodePage = () => {
//   const navigate = useNavigate();
//   const [paymentInfo, setPaymentInfo] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [movieName, setMovieName] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   useEffect(() => {
//     const storedPaymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
//     const storedUser = JSON.parse(localStorage.getItem("currentUser")); 
//     if (!storedPaymentInfo || !storedUser) {
//       alert("Thiếu thông tin thanh toán hoặc người dùng. Vui lòng quay lại trang xác nhận.");
//       navigate("/checkout");
//     } else {
//       setPaymentInfo(storedPaymentInfo);
//       setCurrentUser(storedUser);
//       setMovieName(storedPaymentInfo.title);
//       setSelectedSeats(storedPaymentInfo.seats || []);
//     }
//   }, [navigate]);

//   const saveBooking = (userObj) => {
//     const email = userObj?.email;
//     if (!email || !movieName || selectedSeats.length === 0) {
//       alert("Thiếu thông tin đặt vé, không thể lưu booking.");
//       return;
//     }

//     const allBookings = JSON.parse(localStorage.getItem('bookedSeatsByUser')) || {};
//     const movieBookings = allBookings[movieName] || {};
//     const userBooking = movieBookings[email] || { seats: [] };

//     const newSeats = [...userBooking.seats, ...selectedSeats];
//     movieBookings[email] = { seats: newSeats };
//     allBookings[movieName] = movieBookings;

//     localStorage.setItem('bookedSeatsByUser', JSON.stringify(allBookings));
//     console.log("✅ Đã lưu thông tin đặt ghế vào localStorage:", allBookings);
//   };

//   const handlePaymentSuccess = () => {
//     alert("Thanh toán thành công!");
//     saveBooking(currentUser);

//     localStorage.removeItem("paymentInfo");
//     navigate("/");
//   };

//   if (!paymentInfo) {
//     return <div className="text-center mt-10">Đang tải...</div>;
//   }

//   const paymentURL = `https://your-payment-gateway.com/pay?amount=${paymentInfo.amount}&seats=${paymentInfo.seats.join(",")}&movie=${paymentInfo.title}`;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Thanh toán qua mã QR</h2>

//       <div className="bg-white rounded-lg shadow p-6 space-y-4">
//         <div>
//           <strong>🎬 Tên phim:</strong> {paymentInfo.title}
//         </div>
//         <div>
//           <strong>🎟 Ghế đã chọn:</strong> {paymentInfo.seats.join(", ")}
//         </div>
//         <div>
//           <strong>💰 Tổng tiền:</strong> <span className="text-green-600 font-bold">{paymentInfo.amount.toLocaleString()} đ</span>
//         </div>

//         <div className="mt-6 text-center">
//           <QRCode value={paymentURL} size={256} />
//           <p className="mt-4 text-lg text-blue-600">Quét mã QR để thanh toán</p>
//         </div>

//         <button
//           className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//           onClick={handlePaymentSuccess}
//         >
//           Xác nhận thanh toán (Test)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QRCodePage;
