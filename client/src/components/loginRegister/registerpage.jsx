import LoginVisual from "./loginvisual";
import RegisterForm from "./registerform";

const RegisterPage = () => {
    return (
        <div className="bg-white w-screen p-[10px] box-border h-screen flex max-mobXL:flex-col max-mobXL:items-center
         max-mobXL:p-0 max-mobXL:bg-gradient-to-b from-accent0 to-gray-200">
        <LoginVisual></LoginVisual>
        <RegisterForm/>
        </div>
    );
};
export default RegisterPage;