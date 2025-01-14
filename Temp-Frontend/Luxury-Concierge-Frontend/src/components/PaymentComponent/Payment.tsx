import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Supplementaries from "../../SupplementaryClass";
import "./payment.css";

// Initialize Stripe with publishable key BY using test card
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx"); 

interface PaymentInput{
  amount : number;
  callBackToParentAfterSuccessfulPayment: ()=>void;
}

function PaymentForm({amount, callBackToParentAfterSuccessfulPayment} : PaymentInput){
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Create a payment intent on the server
      const response = await axios.post(Supplementaries.serverLink + "payments/create-payment-intent", {
        amount: amount * 100, // Convert dollars to cents
      },{headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }});

      const { clientSecret } = response.data;

      // Confirm the card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement not found");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("Payment successful!");
        callBackToParentAfterSuccessfulPayment();
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error processing payment");
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "25px", // Increase font size
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount (USD): {amount}</label>
        </div>
        <div>
          <CardElement options={cardStyle}/>
        </div>
        <button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? "Processing..." : "Pay"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

function StripePaymentForm ({amount, callBackToParentAfterSuccessfulPayment} : PaymentInput){
    return (
        <div className="elements-container">
            <Elements stripe={stripePromise}>
                <PaymentForm 
                amount={amount} 
                callBackToParentAfterSuccessfulPayment={callBackToParentAfterSuccessfulPayment}
                />
            </Elements>
        </div> 
    )
};

export default StripePaymentForm;
