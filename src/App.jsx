import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./component/home";
import LoginPage from "./component/login";
import RegisterPage from "./component/ragistration";
import ProfilePage from "./component/profile";
import AddFoodPage from "./component/addfood";
import NotFoundPage from "./component/notfound";
import Product from "./component/product";
import OrderHistory from "./component/orderhostry";
import Faildpayment from "./component/faildpayment";  
import './App.css'
import Navbar from "./component/navbar";
import AllUsersOrders from "./component/allUsersOrders";
import Footer from "./component/futer";
function App() {

  return(
    <BrowserRouter>
    <Routes>
       <Route path="/" element={<MenuPage />} />
       <Route path="/login" element={<LoginPage />} />
       <Route path="/register" element={<RegisterPage />} />
       <Route path="/profile" element={<ProfilePage />} />
       <Route path="/addfood" element={<AddFoodPage />} />
       <Route path="/product" element={<Product />} />
       <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/faildpayment" element={<Faildpayment />} />
       <Route path="/allusersorders" element={<AllUsersOrders />} />
    {/*  <Route path="/upload/servide" element={<UploadService />} />
      <Route path="/upload/project" element={<ProjectUploadForm />} />
      <Route path="/upload/education" element={<EducationUploadForm />} />
      <Route path="/create/token" element={<Create_token/>}/>
      <Route path="/add/skill" element={<AddSkill />} />
      <Route path="*" element={<NoPage />} /> */}
    </Routes>
    
  </BrowserRouter>
)

}

export default App
