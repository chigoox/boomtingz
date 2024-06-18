import { ButtonText, Button } from "@gluestack-ui/themed";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Platform } from "react-native";
import tw from "twrnc";
import { siteName } from "../../constants/META";

let StripeProvider;
let useStripe;
if (Platform.OS !== 'web') {
    StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
    useStripe = require('@stripe/stripe-react-native').useStripe;
}


export default function CheckoutScreen({ styles, cart, UID, setIsLoading }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const fetchPaymentSheetParams = async () => {
        try {
            const { data } = await axios.post(`${Platform.OS != 'web' ? 'http://192.168.1.153:8081/checkout' : 'http://localhost:8081/checkout'}`,
                {
                    cart: cart,
                    location: 'mobile',
                    UID: UID

                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }
        const { paymentIntent, ephemeralKey, customer } = data;

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        setIsLoading(true)
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: siteName,
            returnURL: __DEV__ ? 'http://localhost:8081:/orderSucess' : 'https://boomtingz.com/orderSucess',
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: 'Jane Doe',
            }
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            router.push('/orderSuccess')
        }
        setIsLoading(false)
    };


    useEffect(() => {
        ;
    }, []);

    return (
        <StripeProvider
            publishableKey="pk_test_51PHR6VLenbFU4c2Ha1rkyVqmQ3qhQKOI2Ud9NQfbSeJsZ056O1Wcr8YCkbTgEIPPmP4NEhW7QefVW94aehYijAr000qLipw1CQ"
            merchantIdentifier="merchant.com.stripe.react.native"
            urlScheme="myapp"
            threeDSecureParams={{
                returnUrl: "http://192.168.153:8081",
            }}
        >

            <Button
                style={tw`${styles} `}
                variant="primary"
                title="Checkout"
                onPress={async () => { await initializePaymentSheet(); await openPaymentSheet() }}
            >
                <ButtonText>CheckOut</ButtonText>
            </Button>
        </StripeProvider>
    );
}