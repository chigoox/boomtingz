import Loading from '@/components/Loading.jsx';
import ToastMessage from '@/components/Toast.jsx';
import QR from '@/components/User/QR';
import Claims from '@/components/User/Claims.jsx';
import Settings from '@/components/User/Settings';
import { auth } from '@/firebaseConfig';
import useCheckSignedIn from '@/hooks/useCheckSignedIn';
import useFetchData from '@/hooks/useFetchData';
import useFetchDocs, { useFetchDocsPresist } from '@/hooks/useFetchDocs';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Avatar, AvatarFallbackText, AvatarImage, Button, ButtonIcon, ButtonText, Card, Center, EditIcon, HStack, Heading, KeyboardAvoidingView, Progress, ProgressFilledTrack, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import UtilClass from 'codeby5/Support/UtilsClass';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Image, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import RedeemPoints from '../../components/User/RedeemPoints.jsx';
import { EXPRATE } from '../../constants/META.js';
const { formatNumber } = new UtilClass


export default function HomeScreen({ }) {
  //check if logged in if not push to loginScreen
  const [showSettings, setShowSettings] = useState(false)
  const [showRedeemPoints, setShowRedeemPoints] = useState(false)
  const [showClaims, setShowClaims] = useState(false)

  const user = useCheckSignedIn(true)
  const uid = user?.uid
  const [userData, setUserData] = useState()
  const [orders, setOrders] = useState()
  const [claims, setClaims] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastInfo, setToastInfo] = useState({ title: '', desc: '' })
  const toast = (title, desc, type) => {
    setToastInfo({ title: title, desc: desc, type: type })
    setShowToast(true)
  }


  useFetchData('Users', uid, setUserData)
  useEffect(() => {
    const run = async () => {
      if (!uid) return
      const _orders = await useFetchDocs('Orders', 'user', '==', uid, 'dateServer')
      useFetchDocsPresist('Claims', 'user', '==', uid, 'time', setClaims)
      console.log(_orders)
      if (!orders) setOrders(_orders)

    }
    run()

  }, [uid, showRedeemPoints])

  const exp = userData?.exp
  const expToLv = userData?.expToLv
  const level = userData?.level
  const loyaltyPoints = userData?.loyaltyPoints.toFixed(2)
  const avatar = userData?.avatar
  const role = userData?.role
  const name = userData?.name
  const rate = EXPRATE(level)
  const ref = useRef(null)

  const logOut = async () => {
    await signOut(auth)
    router.replace('/signUp')
  }









  return (
    <View style={tw`bg-black h-full`}>
      <SafeAreaView style={tw`flex-1`}>
        <KeyboardAvoidingView
          style={tw`flex-1`}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80} // Adjust this offset as needed
        >
          <ToastMessage setShow={setShowToast} show={showToast} title={toastInfo.title} desc={toastInfo.desc} type={toastInfo.type} />
          {isLoading && <Loading />}
          <RedeemPoints
            setIsLoading={setIsLoading}
            toast={toast}
            showRedeemPoints={showRedeemPoints}
            setShowRedeemPoints={setShowRedeemPoints}
            points={loyaltyPoints}
            uid={uid}
          />
          <Claims
            setIsLoading={setIsLoading}
            toast={toast}
            showClaims={showClaims}
            setShowClaims={setShowClaims}
            uid={uid}
            claims={claims}
          />
          <Settings
            setIsLoading={setIsLoading}
            setShowSettings={setShowSettings}
            showSettings={showSettings}
            refDom={ref}
            name={name}
            uid={uid}
          />
          <Center>
            <View style={tw`h-40 border-white p-4  mt-12 bg-black flex-row`}>

              <HStack space="md">
                <Avatar style={tw`border-4 border-gray-300`} size='2xl'>
                  <AvatarFallbackText>{name}</AvatarFallbackText>
                  <AvatarImage
                    alt={name}
                    source={avatar || ''}


                  />
                </Avatar>
                <VStack style={tw`justify-center`}>
                  <Heading style={tw``} color='white' size="xl">{name}</Heading>
                  <HStack style={tw`text-white`} space='md'>
                    <Text color='yellow' bold size="md">Lv: {level}</Text>
                    <Text color='green' bold size='md'>Pt: {formatNumber(loyaltyPoints)}</Text>
                  </HStack>
                  <Progress value={(exp / expToLv) * 100} my={'$2'} w="$full" h="$2" size="sm">
                    <ProgressFilledTrack bg="$amber600" />
                  </Progress>
                </VStack>
              </HStack>
            </View>
            <Text style={tw`w-3/4 font-bold text-center border-b border-white`}>Rate: {rate} Points per 1$ spend</Text>
          </Center>

          <Center style={tw`p-4`}>
            {userData && <Card style={tw`h-52  w-96 bg-[#333333] p-4`}>
              <Center>
                <Heading color='white'>Past Orders</Heading>
              </Center>

              <ScrollView style={tw`h-52 w-full `}>
                {orders?.map((order, index) => (
                  <HStack key={index} space='md' style={tw`h-24 w-full border border-dashed border-green-500 rounded-lg items-center p-4 my-2`}>
                    <VStack space={'sm'}>
                      <HStack space={'sm'}>
                        {order.images.map((img, index) => {
                          return index <= 2 ?
                            <Image key={index} alt={order?.id} style={tw`${order.images.length > 2 ? 'h-6 w-6' : 'h-12 w-12'} rounded-full`} source={{
                              uri: img ? img : 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                            }} />

                            : null
                        })}

                      </HStack>
                      <HStack space={'sm'}>
                        {order.images.map((img, index) => {
                          return index > 2 && index <= 5 ?
                            <Image key={index} alt={order?.id} style={tw`h-6  w-6 rounded-full`} source={{
                              uri: img ? img : 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                            }} />

                            : null
                        })}
                      </HStack>
                    </VStack>
                    <VStack space='sm' style={tw`w-1/3  items-center justify-center`}>
                      <Text color='white'>{order?.id}</Text>
                      <Text color='white'>Total: ${order?.total}</Text>
                      <Text color='white'>QTY: {order?.qty}</Text>
                    </VStack>
                    <View>
                      <Text color='yellow'> PTs +{formatNumber(order?.loyaltyPoints)}</Text>
                    </View>

                  </HStack>
                ))}

              </ScrollView>

            </Card>}

            <Card style={tw`mt-4 h-auto bg-yellow-400`}>
              <View style={tw`flex-row gap-2 my-2`}>
                <Button onPress={() => { setShowClaims(true) }} style={tw`h-12 bg-white`} bgColor='green' borderColor='black'>
                  <ButtonText color='black'>Claim Items</ButtonText>
                </Button>
                <Button onPress={() => { setShowRedeemPoints(true) }} style={tw`h-12`} bgColor='green' borderColor='black'>
                  <ButtonText color='white'>Redeem Points</ButtonText>
                </Button>
              </View>

            </Card>
          </Center>
          <Center style={tw`gap-2 border mb-40`}>
            <QR title={'UserID'} valueQR={uid} />
            <HStack>
              <Button style={tw`h-8`} gap={'$2'} onPress={() => { setShowSettings(true) }} ref={ref} bg='$red'>
                <ButtonIcon as={EditIcon} />
                <ButtonText>Setting</ButtonText>
              </Button>

              <Button style={tw`h-8`} gap={'$2'} onPress={logOut} bg='$black'>
                <AntDesign size={20} color={'white'} name='logout' />
                <ButtonText>SignOut</ButtonText>
              </Button>
            </HStack>

            {role == 'Admin' && <Button gap={'$2'} onPress={() => { router.push('/admin') }} bg='$black'>
              <Ionicons color={'white'} size={20} name='key' />
              <ButtonText>Admin</ButtonText>
            </Button>}

          </Center>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
