import LoginVisual from "./loginvisual";
import RegisterForm from "./registerform";

const RegisterPage = () => {
    return (
        <div className=" max-mobM:p-[10px]  w-screen box-border h-screen flex p-[20px] max-mobXL:flex-col max-mobXL:items-center">
        <LoginVisual></LoginVisual>
        <RegisterForm/>
        </div>
    );
};
export default RegisterPage;