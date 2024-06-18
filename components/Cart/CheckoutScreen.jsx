import { Button, ButtonText } from "@gluestack-ui/themed";
import axios from "axios";
import tw from "twrnc";




export default function CheckoutScreen({ styles, cart, UID, setIsLoading }) {
    checkout = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.post('/checkout',
                {
                    cart: cart,
                    location: 'web',
                    UID: UID

                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.assign(data)
        } catch (error) {
            console.error(error.message)
            setIsLoading(false)
        }
    }
    return (

        <Button
            style={tw`${styles}`}
            variant="primary"
            disabled={false}
            title="Checkout"
            onPress={checkout}
        >
            <ButtonText>CheckOut</ButtonText>
        </Button>
    );
}