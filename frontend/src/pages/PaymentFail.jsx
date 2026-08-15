import { useNavigate } from "react-router-dom";

const PaymentFail = () => {

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
                    Payment Failed
                </h1>

                <p>
                    Your payment could not be completed.
                </p>

                <button
                    onClick={() =>
                        navigate("/customer/orders")
                    }
                >
                    Back to Orders
                </button>

            </div>

        </div>

    );

};


export default PaymentFail;