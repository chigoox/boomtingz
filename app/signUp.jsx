import { AntDesign } from '@expo/vector-icons';
import { Button, ButtonText, Center, CheckIcon, Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel, EyeIcon, EyeOffIcon, FormControl, HStack, Heading, Input, InputField, InputIcon, InputSlot, KeyboardAvoidingView, VStack } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Keyboard, Platform, Pressable, Text, TurboModuleRegistry, View } from 'react-native';
import tw from 'twrnc';
import Logo from '../components/Logo';
import { auth, data } from '../firebaseConfig';
import Loading from '../components/Loading.jsx';
import ToastMessage from '../components/Toast.jsx';





export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [register, setRegister] = useState(false)
    const [loginInfo, setLoginInfo] = useState({})

    const [isLoading, setIsLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastInfo, setToastInfo] = useState({ title: '', desc: '' })
    const toast = (title, desc) => {
        setToastInfo({ title: title, desc: desc })
        setShowToast(true)
    }
    const handleState = () => {
        setShowPassword((showState) => {
            return !showState
        })
    }
    const createAccount = async () => {
        if (loginInfo.password != loginInfo.passwordMatch) {
            toast('Error', 'Password dosen\'t match')
            return
        }
        setIsLoading(true)
        try {
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
            if (!loginInfo?.email) toast('Error', 'No email')
            if (!loginInfo?.name) toast('Error', 'No name')
            if (!loginInfo?.password) toast('Error', 'No password')
            if (!loginInfo?.passwordMatch) toast('Error', 'Retype password')
            toast('Error', error.message)
            setIsLoading(false)
            console.log(error.message)
        }
    }
    const signin = async () => {
        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
            router.push('/')
        } catch (e) {

            toast('Login Error', 'Invalid email and password combo!')
            setIsLoading(false)

        }
    }

    const forgotPassword = async () => {
        setIsLoading(true)
        try {
            console.log(loginInfo)
            await sendPasswordResetEmail(auth, loginInfo.email)
            setIsLoading(false)

        } catch (error) {
            if (!loginInfo?.email) toast('Error', 'Enter Email')
            toast('Error', error.message)
            setIsLoading(false)

        }
    }
    return (
        <Pressable style={tw`h-full`} onPress={() => { (Platform.OS != "web") ? Keyboard.dismiss() : null }}>
            {isLoading && <Loading />}
            <Center style={tw`bg-yellow-500 relative h-full`}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <View style={tw`absolute -top-10 left-0 h-40  w-[15rem]`}>
                        <Logo />
                    </View>
                    <ToastMessage setShow={setShowToast} show={showToast} title={toastInfo.title} desc={toastInfo.desc} />
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
                                <Checkbox aria-label='check' onChange={(v) => { setRegister(v) }} size="md" isInvalid={false} isDisabled={false}>
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
        </Pressable>
    )
}





