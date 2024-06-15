import useCheckSignedIn from '@/hooks/useCheckSignedIn';
import useFetchData from '@/hooks/useFetchData';
import {
  ArrowLeftIcon,
  Avatar, AvatarFallbackText,
  AvatarImage, Button, ButtonIcon, ButtonText,
  Card,
  Center,
  EditIcon,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack
} from '@gluestack-ui/themed';
import UtilClass from 'codeby5/Support/UtilsClass';
import { useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import Settings from '@/components/User/Settings'
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useCartContext } from '@/StateManger/CartConext';


const { formatNumber, createArray } = new UtilClass



export default function HomeScreen({ }) {
  //check if logged in if not push to loginScreen
  const [showSettings, setShowSettings] = useState(false)
  const user = useCheckSignedIn()
  const uid = user?.uid
  const [userData, setUserData] = useState()
  useFetchData('Users', uid, setUserData)
  const exp = userData?.exp
  const expToLv = userData?.expToLv
  const level = userData?.level
  const loyaltyPoints = userData?.loyaltyPoints
  const avatar = userData?.avatar
  const name = userData?.name
  const rate = 4 * level / 100
  const ref = useRef(null)

  const logOut = async () => {
    await signOut()
    router.replace('/signUp')
  }










  return (
    <View style={tw`bg-black h-full`}>
      <SafeAreaView>
        <Settings
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
                  source={{
                    uri: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                  }}
                />
              </Avatar>
              <VStack style={tw`justify-center`}>
                <Heading style={tw``} color='white' size="xl">{name}</Heading>
                <HStack style={tw`text-white`} space='md'>
                  <Text color='yellow' bold size="md">Lv: {level}</Text>
                  <Text color='green' bold size='md'>Points: {formatNumber(loyaltyPoints)}</Text>
                </HStack>
              </VStack>
            </HStack>
          </View>
          <Text style={tw`w-3/4 font-bold text-center border-b border-white`}>Rate: {rate} Points per 1$ spend</Text>
        </Center>
        <Center style={tw`p-4`}>
          {userData && <Card style={tw`h-52  w-auto bg-[#333333] p-4`}>
            <Center>
              <Heading color='white'>Past Orders</Heading>
            </Center>
            <ScrollView style={``}>
              <Center>
                {createArray(20).map(i => (
                  <HStack key={i} space='md' style={tw` items-center p-4 my-2`}>
                    <Image style={tw`h-12  w-12 rounded-full`} source={{
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                    }} />
                    <VStack space='sm'>
                      <Text color='white'>Item Name</Text>
                      <Text color='white'>Item Price</Text>
                    </VStack>
                    <View>
                      <Text color='yello'>+{formatNumber(9539)}</Text>
                    </View>

                  </HStack>
                ))}

              </Center>
            </ScrollView>

          </Card>}
          <Card style={tw`mt-4 h-auto bg-yellow-400`}>
            <View style={tw`flex-row gap-2 my-2`}>
              <Button style={tw`h-12 bg-white`} bgColor='green' borderColor='black'>
                <ButtonText color='black'>Claim Points</ButtonText>
              </Button>
              <Button style={tw`h-12`} bgColor='green' borderColor='black'>
                <ButtonText color='white'>Redeem Points</ButtonText>
              </Button>
            </View>

          </Card>
        </Center>



        <Center>

          <Button onPress={() => { setShowSettings(true) }} ref={ref} bg='$black'>
            <ButtonText>Setting</ButtonText>
            <ButtonIcon as={EditIcon} />
          </Button>
          <Button onPress={logOut} bg='$black'>
            <ButtonText>SignOut</ButtonText>
            <ButtonIcon as={ArrowLeftIcon} />
          </Button>
        </Center>
      </SafeAreaView>
    </View>
  );
}
