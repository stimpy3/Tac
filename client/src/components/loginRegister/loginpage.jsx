import LoginForm from "./loginform";
import LoginVisual from "./loginvisual";

const LoginPage=()=>{
    return (
        <div className="bg-white w-screen box-border h-screen flex p-[10px] max-mobXL:flex-col max-mobXL:items-center 
        max-mobXL:p-0 max-mobXL:bg-gradient-to-b from-accent0 to-gray-200  ">
        <LoginVisual></LoginVisual>
        <LoginForm/>
        </div>
    );
};
export default LoginPage;