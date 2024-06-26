
import { Ionicons } from '@expo/vector-icons';
import { AddIcon, Button, ButtonText, Center, ChevronDownIcon, CloseIcon, HStack, Heading, Icon, Input, InputField, KeyboardAvoidingView, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Progress, ProgressFilledTrack, SafeAreaView, ScrollView, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Text, TrashIcon, VStack, View } from "@gluestack-ui/themed";
import { router } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Image, Platform } from 'react-native';
import tw from "twrnc";
import Scanner from '../components/Admin/Scanner.jsx';
import Loading from '../components/Loading.jsx';
import ToastMessage from '../components/Toast.jsx';
import { EXPRATE } from '../constants/META.js';
import { formatNumber } from '../constants/Utils.js';
import { useFetchDocsPresist } from '../hooks/useFetchDocs.js';
import useSetDocument from '../hooks/useSetDocument.js';
import { DeleteDoc } from '../scripts/DeleteDoc.js';
import fetchDoc from '../scripts/fetchDoc.js';
import WeedMenuItem from '../components/Admin/WeedMenuItem.jsx';

function Admin() {

    const [showToast, setShowToast] = useState(false)
    const [toastInfo, setToastInfo] = useState({ title: '', desc: '' })
    const toast = (title, desc, type) => {
        setToastInfo({ title: title, desc: desc, type: type })
        setShowToast(true)
    }

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ points: 0, uid: '' })
    const [weedInfo, setWeedInfo] = useState({ name: '', price: '', type: '' })
    const [PointType, setPointType] = useState('issue')
    const menus = ['Points', 'Claims', 'Menu']
    const [currentMenu, setCurrentMenu] = useState(menus[0])
    const [menuData, setMenuData] = useState()
    const [userData, setUserData] = useState()
    const [claims, setClaims] = useState()
    useEffect(() => {
        const run = async () => {
            if (formData.uid) await fetchDoc('Users', formData.uid, setUserData)
            if (formData.claims) {

                const claim = await fetchDoc('Claims', formData.claims, setClaims)
                await fetchDoc('Users', claim.user, setUserData)
            }
        }
        run()
    }, [formData])

    useEffect(() => {
        useFetchDocsPresist('Menu', 'name', '!=', '', 'price', setMenuData)
        console.log('first')
    }, [])






    const name = userData?.name || ''
    const email = userData?.email || ''
    const avatar = userData?.avatar || 'test'
    const points = userData?.loyaltyPoints || 0
    const formPoints = Math.floor(formData.points)
    const level = Math.floor(userData?.level) || 0
    const exp = Math.floor(userData?.exp) || 0
    const expToLv = Math.floor(userData?.expToLv) || 0
    const rate = EXPRATE(level)
    const redeemedItem = claims?.item
    const redeemedCost = claims?.cost



    const [showModal, setShowModal] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const [showAddMenu, setShowAddMenu] = useState(false)

    const ref = useRef(null)

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
                expToLv: (expCarry > 0 || carryLvs > 0) ? expToLv + (25 * (carryLvs + 1)) : expToLv
            })
            toast('Success!', 'Points added!', 'success')
        } else if (PointType == 'redeem' && points - formData.points >= 0) {
            await useSetDocument('Users', formData.uid, {
                loyaltyPoints: Number(points - formPoints),
            })
            toast('Success!', 'Points removed!', 'success')
        } else {
            toast('Error!', 'Not enough points')

        }
    }

    const fulfillClaim = async () => {
        setIsLoading(true)
        try {
            await DeleteDoc('Claims', formData.claims)
            toast('Success!', 'Claim fulfilled', 'success')


        } catch (error) {

            toast('Error!', error.message)
        }
        setIsLoading(false)
    }

    return (
        <View style={tw`bg-black h-full`}  >
            <SafeAreaView style={tw`h-full bg-black`}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ToastMessage type={toastInfo.type} setShow={setShowToast} show={showToast} title={toastInfo.title} desc={toastInfo.desc} />

                    <Button style={tw`rounded-none bg-green-500 `} onPress={() => router.back()}>
                        <Ionicons name='caret-back' size={24} color={'white'} />
                        <ButtonText>Go back</ButtonText>
                    </Button>
                    <View style={tw`h-full`}>
                        <HStack style={tw`h-12 w-full bg-black my-12 p-4`}>
                            {menus?.map((i) => {
                                return (
                                    <Button onPress={() => { setCurrentMenu(i) }} key={i} style={tw`w-32 h-12 rounded-none ${currentMenu == i ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                        <ButtonText>{i}</ButtonText>
                                    </Button>
                                )
                            })}
                        </HStack>
                        <Center
                            style={tw` border  border-dashed border-opacity-50 border-gray-400   p-2  h-full w-full bg-black text-white `}>
                            {isLoading && <Loading />}
                            {currentMenu == 'Points' &&
                                <View style={tw`p-4   border-white h-full w-full`}>
                                    <HStack style={tw`items-center justify-center my-2 gap-2`}>
                                        <Button onPress={() => { setPointType('issue') }} style={tw`${PointType == 'issue' ? 'bg-yellow-600' : 'bg-green-600'}`}>
                                            <ButtonText>Issue Points</ButtonText>
                                        </Button>
                                        <Button onPress={() => { setPointType('redeem') }} style={tw`${PointType == 'redeem' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            <ButtonText>Redeem Points</ButtonText>
                                        </Button>
                                    </HStack>
                                    <Center style={tw`h-96 top-8 gap-2`}>
                                        <Center style={tw`h-24 border-white  w-full`}>
                                            <HStack space='md' style={tw` border-white `}>
                                                <Image style={tw`h-24 w-16 border-dashed border border-green-500 rounded-2xl`} source={{ uri: avatar }} alt='User' />
                                                <VStack>
                                                    <VStack space=''>
                                                        <Text style={tw`text-2xl text-white font-bold`}>{name}</Text>
                                                        <Text style={tw`text-white mb-2`}>{email}</Text>
                                                        <HStack space='sm' style={tw`font-bold`}>
                                                            <Text style={tw`text-white bg-green-700 w-18 rounded-full p-2 font-bold`}>Lv: {formatNumber(level)}</Text>
                                                            <Text style={tw`text-white bg-green-700 w-25 rounded-full p-2 font-bold`}>Pt: {formatNumber(Number(points.toFixed(2)))}</Text>
                                                            <Text style={tw`text-white bg-green-700 w-25  rounded-full p-2 text-xs  font-bold`}>XP: {formatNumber(Number(exp))} / {formatNumber(Number(expToLv))}</Text>
                                                        </HStack>
                                                    </VStack>
                                                    <Progress value={(exp / expToLv) * 100} my={'$2'} w="$full" h="$2" size="sm">
                                                        <ProgressFilledTrack bg="$amber600" />
                                                    </Progress>

                                                </VStack>
                                            </HStack>

                                        </Center>
                                        <Center style={tw`border-white top-2 my-2  w-full`}>
                                            <VStack style={tw`border-white  w-full items-center justify-center gap-4`}>
                                                <Scanner
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    showScanner={showScanner}
                                                    setShowScanner={setShowScanner}
                                                    name={name}
                                                    email={email}
                                                    avatar={avatar}
                                                />

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
                            {currentMenu == 'Claims' &&
                                <View style={tw`w-full h-full  border-white items-center p-2`}>
                                    <HStack style={tw`h-32 gap-1 justify-between gap-1 w-full  rounded my-4`} >
                                        <View style={tw`p-3 w-2/3 bg-white rounded`}>
                                            <Text style={tw`text-black text-xl font-bold`}>{redeemedItem}</Text>
                                            <Text style={tw`text-black`}>Cost:{redeemedCost}</Text>
                                            <Text style={tw`text-black`}>Owner: {name}</Text>
                                            <Text style={tw`text-black`}>ID: {formData.claims}</Text>
                                        </View>
                                        <View style={tw`p-2 w-1/3 h-full border bg-black border-dashed border-green-500`}>
                                            {avatar && <Image style={tw`h-full rounded-3xl`} alt='avatar' source={{ uri: avatar }} />}
                                        </View>
                                    </HStack>
                                    <Scanner
                                        formData={formData}
                                        setFormData={setFormData}
                                        showScanner={showScanner}
                                        setShowScanner={setShowScanner}
                                        name={name}
                                        email={email}
                                        avatar={avatar}
                                        type='claims'
                                        item={redeemedItem}
                                        cost={redeemedCost}
                                    />

                                    <Button onPress={fulfillClaim} size='sm' style={tw`my-4`}>
                                        <ButtonText>Fulfull claim</ButtonText>
                                    </Button>
                                </View>}

                            {currentMenu == 'Menu' &&
                                <View style={tw`w-full h-full  border-white items-center p-2`}>
                                    <View>{['Add New'].map((item) => {
                                        return (
                                            <Button key={item} onPress={() => { setShowAddMenu(true) }}>
                                                <Icon color='$white' as={AddIcon} />
                                                <ButtonText>{item}</ButtonText>
                                            </Button>
                                        )
                                    })}

                                        <Modal
                                            isOpen={showAddMenu}
                                            onClose={() => {
                                                setShowAddMenu(false)
                                            }}
                                        >
                                            <ModalBackdrop />
                                            <ModalContent>
                                                <ModalHeader>
                                                    <Heading size="lg">{'Add New Item'.toLocaleUpperCase()}</Heading>
                                                    <ModalCloseButton>
                                                        <Icon as={CloseIcon} />
                                                    </ModalCloseButton>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Input>
                                                        <InputField value={weedInfo.name} onChangeText={(v) => { setWeedInfo(old => ({ ...old, name: v })) }} placeholder={'name'} />
                                                    </Input>
                                                    <Input>
                                                        <InputField value={weedInfo.price} onChangeText={(v) => { setWeedInfo(old => ({ ...old, price: v })) }} placeholder={'price'} />
                                                    </Input>


                                                    <Select onValueChange={(v) => { setWeedInfo(old => ({ ...old, type: v })) }}>
                                                        <SelectTrigger variant="outline" size="md">
                                                            <SelectInput placeholder="Select option" />
                                                            <SelectIcon mr="$3">
                                                                <Icon as={ChevronDownIcon} />
                                                            </SelectIcon>
                                                        </SelectTrigger>
                                                        <SelectPortal>
                                                            <SelectBackdrop />
                                                            <SelectContent>
                                                                <SelectDragIndicatorWrapper>
                                                                    <SelectDragIndicator />
                                                                </SelectDragIndicatorWrapper>
                                                                {['Indica', 'Hybrid', 'Sativa'].map(item => {
                                                                    return (
                                                                        <SelectItem key={item} label={item} value={item} />
                                                                    )
                                                                })}
                                                            </SelectContent>
                                                        </SelectPortal>
                                                    </Select>


                                                </ModalBody>
                                                <ModalFooter>

                                                    <Button
                                                        size="sm"
                                                        bgColor={PointType == 'issue' ? '$green500' : '$red500'}
                                                        action="positive"
                                                        borderWidth="$0"
                                                        onPress={async () => {
                                                            try {
                                                                setIsLoading(true)
                                                                await useSetDocument('Menu', weedInfo.name, {
                                                                    name: weedInfo.name,
                                                                    price: weedInfo.price,
                                                                    type: weedInfo.type
                                                                })
                                                                toast('Success!', 'Added item', 'success')
                                                                setIsLoading(false)
                                                                setShowAddMenu(false)
                                                            } catch (error) {
                                                                toast('Error!', error.message)

                                                            }
                                                        }}
                                                    >
                                                        <ButtonText>Add</ButtonText>
                                                    </Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>


                                        <ScrollView style={tw`w-96  border-white h-96`}>
                                            {menuData?.map(item => {
                                                return <WeedMenuItem
                                                    key={item.name}
                                                    toast={toast}
                                                    item={item} />
                                            })}
                                        </ScrollView>



                                    </View>


                                </View>}
                        </Center>
                    </View>
                </KeyboardAvoidingView >
            </SafeAreaView >
        </View >
    )
}

export default Admin
