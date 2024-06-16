import { Button, ButtonText } from "@gluestack-ui/themed";
import tw from "twrnc";




export default function CheckoutScreen({ styles, cart }) {
    checkout = async () => {
        const { data } = await axios.post('/api/checkout',
            {
                cart: cart,
                location: 'web'

            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        window.location.assign(data)
    }
    return (

        <Button
            style={tw`${styles}`}
            variant="primary"
            disabled={false}
            title="Checkout"
            onPress={() => { }}
        >
            <ButtonText>CheckOut</ButtonText>
        </Button>
    );
}