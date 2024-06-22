import { ButtonText, Button } from "@gluestack-ui/themed";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Platform } from "react-native";
import tw from "twrnc";
import { siteName } from "../../constants/META";
import { deleteDoc, doc } from "firebase/firestore";
import { data as db } from "../../firebaseConfig";
import * as Linking from 'expo-linking';

let StripeProvider;
let useStripe;
if (Platform.OS !== 'web') {
    StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
    useStripe = require('@stripe/stripe-react-native').useStripe;
}


export default function CheckoutScreen({ styles, cart, UID, setIsLoading }) {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [cartID, setCartID] = useState()
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

            const { paymentIntent, ephemeralKey, customer, cartID } = data;
            setCartID(cartID)

            return {
                paymentIntent,
                ephemeralKey,
                customer,
                cartID,
            };
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }

    };

    const initializePaymentSheet = async () => {
        setIsLoading(true)
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
            cartID,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: siteName,
            returnURL: Linking.createURL(`/orderSuccess?payment_intent={PAYMENT_INTENT_ID}&UID=${UID}`),
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
        await openPaymentSheet(cartID)
    };


    const openPaymentSheet = async (cartID) => {
        const { error } = await presentPaymentSheet();

        if (error) {
            deleteDoc(doc(db, 'Carts', cartID))
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
            urlScheme="boomtingz"
            threeDSecureParams={{
                returnUrl: "http://192.168.153:8081",
            }}
        >

            <Button
                style={tw`${styles} `}
                variant="primary"
                title="Checkout"
                onPress={async () => { await initializePaymentSheet() }}
            >
                <ButtonText>CheckOut</ButtonText>
            </Button>
        </StripeProvider>
    );
}