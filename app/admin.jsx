
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Button, ButtonText, Center, CloseIcon, HStack, Heading, Image, Input, InputField, InputSlot, KeyboardAvoidingView, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Progress, ProgressFilledTrack, SafeAreaView, Text, VStack, View } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Platform } from 'react-native';
import tw from "twrnc";
import Loading from '../components/Loading.jsx';
import useFetchData from '../hooks/useFetchData.js';
import useSetDocument from '../hooks/useSetDocument.js';
import { formatNumber } from '../constants/Utils.js';
import { Modal } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { CameraView, Camera } from "expo-camera";
import { router } from 'expo-router';
function Admin() {


    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ points: 0, uid: '' })
    const [PointType, setPointType] = useState('issue')
    const menus = ['Points']
    const [currentMenu, setCurrentMenu] = useState(menus[0])

    const [userData, setUserData] = useState({})
    useFetchData('Users', formData.uid, setUserData)

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
    };



    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setFormData(old => ({ ...old, uid: data }))
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };




    const name = userData?.name || ''
    const email = userData?.email || ''
    const avatar = userData?.avatar || ''
    const points = Math.floor(userData?.loyaltyPoints) || 0
    const formPoints = Math.floor(formData.points)
    const level = Math.floor(userData?.level) || 0
    const exp = Math.floor(userData?.exp) || 0
    const expToLv = Math.floor(userData?.expToLv) || 0
    const rate = (4 * level) / 100

    const [showModal, setShowModal] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const ref = useRef(null)
    const ref2 = useRef(null)

    const managePoints = async () => {
        setShowModal(true)

        const gainedXP = formPoints;
        let expCarry = (exp + gainedXP) - expToLv;
        expCarry = expCarry < 0 ? 0 : expCarry;
        const carryLvs = Math.floor(expCarry / expToLv);



        if (PointType == 'issue') {
            await useSetDocument('Users', formData.uid, {
                loyaltyPoints: Number(points + (formPoints * rate)),
                exp: expCarry > 0 ? expCarry % expToLv : exp + gainedXP,
                level: level >= 100 ? 100 : level + (expCarry > 0 ? carryLvs + 1 : 0),
                expToLv: expToLv + (25 * (carryLvs + 1))
            })
        } else if (PointType == 'redeem' && points - formData.points >= 0) {
            await useSetDocument('Users', formData.uid, {
                loyaltyPoints: Number(points - formPoints),
            })
        } else {
            Alert.alert('Check Points', 'Not enough points')

        }
    }



    return (
        <View style={'bg-black h-full'}  >
            <SafeAreaView style={tw`h-full bg-black`}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Button style={tw`rounded-none bg-green-500 `} onPress={() => router.back()}>
                        <Ionicons name='caret-back' size={24} color={'white'} />
                        <ButtonText>Go back</ButtonText>
                    </Button>
                    <View>
                        <View style={tw`h-12 w-full bg-black my-12 p-4`}>
                            {menus.map((i) => {
                                return (
                                    <Button onPress={() => { setCurrentMenu(i) }} key={i} style={tw`w-32 h-12 rounded-none ${currentMenu == i ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                        <ButtonText>{i}</ButtonText>
                                    </Button>
                                )
                            })}
                        </View>
                        <Center
                            style={tw` border  border-dashed border-opacity-50 border-gray-400   p-2  h-full w-full bg-black text-white `}>
                            {isLoading && <Loading />}
                            {currentMenu == 'Points' && <View style={tw`p-4   border-white h-full w-full`}>
                                <HStack style={tw`items-center justify-center my-2 gap-2`}>
                                    <Button onPress={() => { setPointType('issue') }} style={tw`${PointType == 'issue' ? 'bg-yellow-600' : 'bg-green-600'}`}>
                                        <ButtonText>Issue Points</ButtonText>
                                    </Button>
                                    <Button onPress={() => { setPointType('redeem') }} style={tw`${PointType == 'redeem' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                        <ButtonText>Redeem Points</ButtonText>
                                    </Button>
                                </HStack>
                                <Center style={tw`h-96 gap-2`}>
                                    <Center style={tw`h-24 border-white  w-full`}>
                                        <HStack space='md'>
                                            <Image style={tw`h-24 w-16 border-dashed border border-green-500 rounded-2xl`} source={{ uri: avatar }} alt='User' />
                                            <VStack>
                                                <VStack space=''>
                                                    <Text style={tw`text-2xl text-white font-bold`}>{name}</Text>
                                                    <Text style={tw`text-white mb-2`}>{email}</Text>
                                                    <HStack space='lg' style={tw`font-bold`}>
                                                        <Text style={tw`text-white bg-green-700 rounded-full p-2 font-bold`}>Lv: {formatNumber(level)}</Text>
                                                        <Text style={tw`text-white bg-green-700 rounded-full p-2 font-bold`}>Pt: {formatNumber(Number(points))}</Text>
                                                        <Text style={tw`text-white bg-green-700 rounded-full p-2 font-bold`}>NX: {formatNumber(Number(exp))} / {formatNumber(Number(expToLv))}</Text>
                                                    </HStack>
                                                </VStack>
                                                <Progress value={(exp / expToLv) * 100} my={'$2'} w="$full" h="$2" size="sm">
                                                    <ProgressFilledTrack bg="$amber600" />
                                                </Progress>

                                            </VStack>
                                        </HStack>

                                    </Center>
                                    <Center style={tw`border-white  w-full`}>
                                        <VStack style={tw`border-white  w-full items-center justify-center gap-4`}>
                                            <Input style={tw`h-12 border-0  ${Platform.OS == 'web' ? 'w-[40%]' : 'w-full'}`}>
                                                <InputSlot >
                                                    <Button ref={ref2} onPress={() => { getCameraPermissions(); setShowScanner(true); }} style={tw`h-12 rounded-r-none bg-green-500 rounded-l-3xl`}>
                                                        <AntDesign name='camera' size={20} color={'white'} />
                                                    </Button>

                                                    <Modal
                                                        isOpen={showScanner}
                                                        onClose={() => {
                                                            setShowScanner(false)
                                                        }}

                                                    >
                                                        <ModalBackdrop />
                                                        <ModalContent>
                                                            <ModalHeader style={tw`bg-black`}>
                                                                <Heading style={tw`text-white`} size="lg">{'scan'.toLocaleUpperCase()}</Heading>
                                                                <ModalCloseButton>
                                                                    <Icon as={CloseIcon} />
                                                                </ModalCloseButton>
                                                            </ModalHeader>
                                                            <ModalBody style={tw`bg-black`}>
                                                                <VStack style={tw`items-center gap-4 rounded-3xl overflow-hidden  h-130  border-white justify-center`}>
                                                                    {scanned ? <Text style={tw`font-extrabold text-xl`}>{formData.uid}</Text> : <CameraView
                                                                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                                                                        barcodeScannerSettings={{
                                                                            barcodeTypes: ["qr", "pdf417"],
                                                                        }}
                                                                        style={tw`flex-1  rounded-3xl flex-col border-white h-96 w-96 justify-center`}
                                                                    />}

                                                                    <HStack style={tw`justify-center border-2 p-2 border-green-500 border-dashed rounded-2xl gap-2 items-center`}>
                                                                        <Image style={tw` bg-gray-200 w-18 rounded-2xl`} source={{ uri: avatar }} alt={name} />
                                                                        <VStack style={tw` h-24  justify-center`} w={'$40%'}>
                                                                            <Text style={tw`font-bold text-white`} >{name || '???'}</Text>
                                                                            <Text style={tw` text-white text-xs`}>{email || '???'}</Text>
                                                                        </VStack>
                                                                    </HStack>

                                                                </VStack>
                                                            </ModalBody>
                                                            <ModalFooter style={tw`bg-black`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    action="secondary"
                                                                    mr="$3"
                                                                    onPress={() => {
                                                                        setShowScanner(false)
                                                                    }}
                                                                >
                                                                    <ButtonText>Cancel</ButtonText>
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    action="secondary"
                                                                    mr="$3"
                                                                    onPress={() => {
                                                                        setScanned(false)
                                                                        setFormData(o => ({ ...o, uid: '' }))
                                                                    }}
                                                                >
                                                                    <ButtonText>Rescan</ButtonText>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    action="positive"
                                                                    borderWidth="$0"
                                                                    onPress={() => {

                                                                        setShowScanner(false)
                                                                    }}
                                                                >
                                                                    <ButtonText >Done</ButtonText>
                                                                </Button>
                                                            </ModalFooter>
                                                        </ModalContent>
                                                    </Modal>
                                                </InputSlot>
                                                <InputField onChangeText={(v) => { setFormData(old => ({ ...old, uid: v })) }} value={formData.uid} style={tw`border-black border-0 font-bold border-0 bg-white rounded-r-3xl w-3/4`} placeholder='User ID' type='text' />
                                            </Input>

                                            <Input style={tw`h-12 border-0 w-full rounded-3xl h-32 w-32 `}>
                                                <InputField onChangeText={(v) => { setFormData(old => ({ ...old, points: v })) }} value={formData.points} style={tw`border-black text-3xl font-bold border-0 bg-white text-center`} maxLength={4} placeholder='100' type='text' />
                                            </Input>
                                        </VStack>
                                    </Center>

                                    <Button ref={ref} onPress={() => { setShowModal(true) }} style={tw`h-16 w-1/2 font-bold bg-green-500 text-white text-3xl`}>
                                        <ButtonText>{PointType}</ButtonText>
                                    </Button>

                                    <Modal
                                        isOpen={showModal}
                                        onClose={() => {
                                            setShowModal(false)
                                        }}
                                    >
                                        <ModalBackdrop />
                                        <ModalContent>
                                            <ModalHeader>
                                                <Heading size="lg">{PointType.toLocaleUpperCase()}</Heading>
                                                <ModalCloseButton>
                                                    <Icon as={CloseIcon} />
                                                </ModalCloseButton>
                                            </ModalHeader>
                                            <ModalBody>
                                                <HStack states={tw`items-center justify-center `}>
                                                    <Text style={tw`${PointType == 'issue' ? 'text-green-600' : 'text-red-600'}   w-1/2 m-auto  text-5xl font-extrabold`}> {PointType == 'issue' ? '+' : '-'}{formPoints} PT(S)</Text>
                                                    <Text style={tw`text-3xl h-full w-1/2 text-black font-bold`}>
                                                        Are you sure you want to {PointType == 'issue' ? 'give' : 'take'} points?
                                                    </Text>
                                                </HStack>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    action="secondary"
                                                    mr="$3"
                                                    onPress={() => {
                                                        setShowModal(false)
                                                    }}
                                                >
                                                    <ButtonText>Cancel</ButtonText>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    bgColor={PointType == 'issue' ? '$green500' : '$red500'}
                                                    action="positive"
                                                    borderWidth="$0"
                                                    onPress={() => {
                                                        managePoints()
                                                        setShowModal(false)
                                                    }}
                                                >
                                                    <ButtonText >{PointType == 'issue' ? 'Give' : 'Take'}</ButtonText>
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>

                                </Center>
                            </View>}
                        </Center>
                    </View>
                </KeyboardAvoidingView >
            </SafeAreaView >
        </View >
    )
}

export default Admin
