import { AlertIcon, ButtonText, CloseIcon, SlashIcon } from "@gluestack-ui/themed";
import { useEffect } from "react";
import { Pressable } from "react-native";
import tw from "twrnc";

const { Toast, useToast, Button, Icon, VStack, ToastTitle, ToastDescription, CheckIcon } = require("@gluestack-ui/themed");

export default function ToastMessage({ setShow, show, title, desc }) {
    const toast = useToast();
    const showToast = () => {
        toast.show({
            placement: 'top',
            render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                    <Toast bg='$error700' style={tw`w-96`} nativeID={toastId}>
                        <Icon as={SlashIcon} color='$white' mt='$1' mr='$3' />
                        <VStack space='xs' flex={1} style={tw`w-full`}>
                            <ToastTitle color='$textLight50' >{title}</ToastTitle>
                            <ToastDescription color='$textLight50'>{desc}</ToastDescription>
                        </VStack>
                        <Pressable mt='$1' onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color='$coolGray50' />
                        </Pressable>
                    </Toast>
                );
            },
        });
    }
    useEffect(() => {
        if (show == true) showToast()
        setShow(false)
    }, [show])

    return (
        <Pressable
            onPress={showToast}
        >
        </Pressable>
    );
};
