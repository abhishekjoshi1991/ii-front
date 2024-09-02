import CustomNavbar from "./CustomsNavbar";

const Base = ({ title = "Welcome to Our Website", children }) => {
    return (
        <div>
           <CustomNavbar />
            {children}
        </div>
    )
}

export default Base;