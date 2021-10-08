import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, Divider, Message } from "semantic-ui-react";
import { authAxios } from "../../services/Api/authAxios";
import { SubscribeURL, stripePublishKey } from "../../constants";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasError, setHasError] = useState(null);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setLoading(true);
    setHasError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (error) {
      setHasError(result.error);
    } else {
      if (result.error) {
        console.log("[error]", result.error.message);
        setHasError(result.error);
      } else {
        authAxios
          .post(SubscribeURL, {
            stripeToken: result.token.id,
            payment_method_id: paymentMethod.id,
          })
          .then((res) => {
            setLoading(false);
            card.clear();
            setSuccess(true);
          })
          .catch((err) => {
            setHasError(err.response.data.message);
            setLoading(false);
          });
      }
    }
  };

  return (
    <React.Fragment>
      <Divider />
      <form onSubmit={handleSubmit}>
        {hasError && (
          <Message error header="There was an error" content={hasError} />
        )}
        {success && <Message success header="Payment Successful" />}
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <Button
          primary
          type="submit"
          style={{ marginTop: "10px" }}
          disabled={!stripe}
          loading={loading}
        >
          Pay
        </Button>
      </form>
    </React.Fragment>
  );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripePublishKey);

const SubscribeForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default SubscribeForm;
