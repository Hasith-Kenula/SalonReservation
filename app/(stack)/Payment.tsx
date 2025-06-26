// frontend/PayHereScreen.js
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";

const PayHereScreen = () => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        const createPayment = async () => {
            const response = await fetch("https://salonreservationapi.up.railway.app/payments/pay-reservation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: "ORD12345",
                    amount: "1000.00",
                    first_name: "John",
                    last_name: "Doe",
                    email: "john@example.com",
                    phone: "0771234567",
                    address: "123 Street",
                    city: "Colombo",
                    items: "Test Product",
                }),
            });

            const paymentData = await response.json();
            console.log(paymentData)

            const formHtml = `
        <html>
          <body onload="document.forms[0].submit();">
            <form method="POST" action="https://sandbox.payhere.lk/pay/checkout">
                <input type="hidden" name="merchant_id" value="${paymentData.merchant_id}">    <!-- Replace your Merchant ID -->
                <input type="hidden" name="return_url" value="${paymentData.return_url}">
                <input type="hidden" name="cancel_url" value="${paymentData.cancel_url}">
                <input type="hidden" name="notify_url" value="${paymentData.notify_url}">  
                </br></br>Item Details</br>
                <input type="hidden" name="order_id" value="${paymentData.order_id}">
                <input type="hidden" name="items" value="${paymentData.items}">
                <input type="hidden" name="currency" value="${paymentData.currency}">
                <input type="hidden" name="amount" value="${paymentData.amount}">  
                </br></br>Customer Details</br>
                <input type="hidden" name="first_name" value="${paymentData.first_name}">
                <input type="hidden" name="last_name" value="${paymentData.last_name}">
                <input type="hidden" name="email" value="${paymentData.email}">
                <input type="hidden" name="phone" value="${paymentData.phone}">
                <input type="hidden" name="address" value="${paymentData.address}">
                <input type="hidden" name="city" value="${paymentData.city}">
                <input type="hidden" name="country" value="${paymentData.country}">
                <input type="hidden" name="hash" value="${paymentData.hash}">    <!-- Replace with generated hash -->
                <input type="submit" value="Buy Now">  
            </form>
          </body>
        </html>
      `;

            setHtmlContent(formHtml);
        };

        createPayment();

    }, []);

    console.log(htmlContent);

    return (

        <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            javaScriptEnabled={true}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn("WebView error: ", nativeEvent);
            }}
            onHttpError={({ nativeEvent }) => {
                console.warn("HTTP error: ", nativeEvent.statusCode);
            }}
        />
    );
};

export default PayHereScreen;
