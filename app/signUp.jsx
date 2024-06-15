import { AntDesign } from '@expo/vector-icons';
import { Button, ButtonText, Center, CheckIcon, Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel, EyeIcon, EyeOffIcon, FormControl, HStack, Heading, Input, InputField, InputIcon, InputSlot, KeyboardAvoidingView, VStack } from '@gluestack-ui/themed';
import { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import tw from 'twrnc';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, createUserWithEmailAndPassword, updateCurrentUser, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth, data } from '../firebaseConfig';
import { addToDocumentCollection } from '../constants/Utils';
import { router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { View } from 'react-native';





export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [register, setRegister] = useState(false)
    const [loginInfo, setLoginInfo] = useState({})
    console.log(loginInfo)

    const handleState = () => {
        setShowPassword((showState) => {
            return !showState
        })
    }
    const createAccount = async () => {
        if (loginInfo.password != loginInfo.passwordMatch) return
        try {
            console.log('trying...')
            const { user } = await createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
            await sendEmailVerification(user)
            const UID = user.uid
            await setDoc(doc(data, 'Users', UID), {
                uid: UID,
                name: loginInfo.name,
                email: loginInfo.email,
                role: 'User',
                level: 1,
                loyaltyPoints: 0,
                exp: 0,
                expToLv: 100,
                cart: {
                    lineItems: [],
                    total: 0
                }
            })
            router.push('/')

        } catch (error) {
            console.log(error.message)
        }
    }
    const signin = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
            router.push('/')
        } catch (e) {
            console.log(e.message)
        }
    }

    const forgotPassword = async () => {
        try {
            await sendPasswordResetEmail(loginInfo.email)
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Center style={tw`bg-yellow-500 h-full`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <FormControl
                        p="$4"
                        borderWidth="$1"
                        borderRadius="$lg"
                        borderColor="$borderRed300"
                        $dark-borderWidth="$1"
                        $dark-borderRadius="$lg"
                        $dark-borderColor="$borderDark800"
                        style={tw`mt-40 w-[15rem]`}
                    >
                        <VStack space="3xl ">
                            <Heading style={tw``} color="$text900" lineHeight="$md">
                                <Center style={tw`w-full  relative border border-red-500 p-4 gap-2`}>
                                    <Text>Login with</Text>
                                    <HStack space='sm'>
                                        <Button onPress={() => { }} bgColor='$green700' style={tw`w-20`}>
                                            <AntDesign color={'white'} size={32} name='google' />
                                        </Button>
                                        <Button bgColor='$green700' style={tw`w-20`}>
                                            <AntDesign color={'white'} size={32} name='apple1' />
                                        </Button>
                                    </HStack>
                                </Center>
                            </Heading>
                            <View>
                                <VStack space="xs">
                                    <Text color="$text500" lineHeight="$xs">
                                        Email
                                    </Text>
                                    <Input style={tw`border-black`}>
                                        <InputField onChangeText={(value) => { setLoginInfo(prvState => ({ ...prvState, email: value })) }} type="text" />
                                    </Input>
                                </VStack>
                                {register && <VStack space="xs">
                                    <Text color="$text500" lineHeight="$xs">
                                        Full Name
                                    </Text>
                                    <Input style={tw`border-black`}>
                                        <InputField onChangeText={(value) => { setLoginInfo(prvState => ({ ...prvState, name: value })) }} type="text" />
                                    </Input>
                                </VStack>}
                                <VStack space="xs">
                                    <Text color="$text500" lineHeight="$xs">
                                        Password
                                    </Text>
                                    <Input style={tw`border-black`} textAlign="center">
                                        <InputField onChangeText={(value) => { setLoginInfo(prvState => ({ ...prvState, password: value })) }} type={showPassword ? "text" : "password"} />
                                        <InputSlot pr="$3" onPress={handleState}>
                                            {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                                            <InputIcon
                                                as={showPassword ? EyeIcon : EyeOffIcon}
                                                color="$darkBlue500"
                                            />
                                        </InputSlot>
                                    </Input>

                                </VStack>
                                {register && <VStack space="xs">
                                    <Text color="$text500" lineHeight="$xs">
                                        Confirm Password
                                    </Text>
                                    <Input style={tw`border-black`} textAlign="center">
                                        <InputField onChangeText={(value) => { setLoginInfo(prvState => ({ ...prvState, passwordMatch: value })) }} type={showPassword ? "text" : "password"} />
                                        <InputSlot pr="$3" onPress={handleState}>
                                            {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                                            <InputIcon
                                                as={showPassword ? EyeIcon : EyeOffIcon}
                                                color="$darkBlue500"
                                            />
                                        </InputSlot>
                                    </Input>
                                </VStack>}
                            </View>
                            <HStack style={tw`mt-4`}>
                                <Checkbox onChange={(v) => { setRegister(v) }} size="md" isInvalid={false} isDisabled={false}>
                                    <CheckboxIndicator mr="$2">
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                    <CheckboxLabel>Register</CheckboxLabel>
                                </Checkbox>
                                <Button
                                    bgColor='$green700'
                                    ml="auto"
                                    onPress={register ? createAccount : signin}
                                >
                                    <ButtonText color="$white">{register ? 'Register' : 'Login'}</ButtonText>
                                </Button>
                            </HStack>
                            <VStack>
                                <Button onPress={forgotPassword} variant='link'>
                                    <ButtonText color='$green700' style={`text-green-600`}>Forgot password?</ButtonText>
                                </Button>
                            </VStack>
                        </VStack>
                    </FormControl>
                </KeyboardAvoidingView>
            </Center >
        </TouchableWithoutFeedback>
    )
}





