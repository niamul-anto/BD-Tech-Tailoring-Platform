import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {

    const navigate = useNavigate();

    return (

        <div
            style={{
                minHeight:"100vh",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                background:"#f5f7fa"
            }}
        >

            <div
                style={{
                    background:"white",
                    padding:"35px",
                    borderRadius:"12px",
                    textAlign:"center",
                    maxWidth:"420px",
                    width:"90%",
                    border:"1px solid #e5e7eb"
                }}
            >

                <h1>
                    Payment Successful
                </h1>

                <p>
                    Your bKash payment has been completed successfully.
                </p>

                <button
                    onClick={() =>
                        navigate("/customer/orders")
                    }
                >
                    View My Orders
                </button>

            </div>

        </div>

    );

};


export default PaymentSuccess;