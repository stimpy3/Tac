import LoginForm from "./loginform";
import LoginVisual from "./loginvisual";

const LoginPage=()=>{
    return (
        <div className=" max-mobM:p-[10px]  w-screen box-border h-screen flex p-[20px] max-mobXL:flex-col max-mobXL:items-center">
        <LoginVisual></LoginVisual>
        <LoginForm/>
        </div>
    );
};
export default LoginPage;