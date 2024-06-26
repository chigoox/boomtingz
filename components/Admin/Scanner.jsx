import { View, Text, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ButtonText, CloseIcon, HStack, Heading, Icon, Input, InputField, InputSlot, ModalBackdrop, ModalCloseButton, ModalContent, ModalHeader, VStack } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from '@gluestack-ui/themed';
import { ModalBody } from '@gluestack-ui/themed';
import tw from 'twrnc';
import { Image } from '@gluestack-ui/themed';
import { ModalFooter } from '@gluestack-ui/themed';
import { Camera, CameraView } from "expo-camera";

const Scanner = ({ type = 'user', formData, setFormData, showScanner, setShowScanner, avatar, name, email, item, cost }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
    };

    useEffect(() => {


        type == 'user' ? setFormData((o) => ({ ...o, claims: '' })) :
            setFormData((o) => ({ ...o, uid: '' }))
    }, [])




    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setFormData(old => ({ ...old, [type == 'user' ? 'uid' : 'claims']: data }))
        alert(`Scanned: ${data}`);
    };
    const ref2 = useRef(null)


    return (
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
                                {scanned ? <Text style={tw`font-extrabold text-xl`}>{type == 'user' ? formData.uid : formData.claimsID}</Text> :
                                    <CameraView
                                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                                        barcodeScannerSettings={{
                                            barcodeTypes: ["qr", "pdf417"],
                                        }}
                                        style={tw`flex-1  rounded-3xl flex-col border-white h-96 w-96 justify-center`}
                                    />}

                                {formData.uid && <HStack style={tw`justify-center border-2 p-2 border-green-500 border-dashed rounded-2xl gap-2 items-center`}>
                                    <Image style={tw`h-24 bg-gray-200 w-18 border-white  rounded-2xl`} source={{ uri: avatar }} alt={name} />
                                    <VStack style={tw` h-24  justify-center`} w={'$40%'}>
                                        <Text style={tw`font-bold text-white`} >{name || '???'}</Text>
                                        <Text style={tw` text-white text-xs`}>{email || '???'}</Text>
                                    </VStack>
                                </HStack>}

                                {formData.claims && <HStack style={tw`justify-center border-2 p-2 border-green-500 border-dashed rounded-2xl gap-2 items-center`}>
                                    <Image style={tw`h-24 bg-gray-200 w-18 border-white  rounded-2xl`} source={{ uri: avatar }} alt={name} />
                                    <VStack style={tw` h-24  justify-center`} w={'$40%'}>
                                        <Text style={tw`font-bold text-white`}>{item || '???'}</Text>
                                        <Text style={tw` text-white text-xs`}>cost: {cost || '???'}</Text>
                                        <Text style={tw` text-white text-xs`}>owner: {name || '???'}</Text>
                                    </VStack>
                                </HStack>}

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
                                    setFormData(o => ({ ...o, uid: '', claimsID: '' }))
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
            <InputField onChangeText={(v) => { setFormData(old => ({ ...old, [type == 'user' ? 'uid' : 'claims']: v })) }} value={type == 'user' ? formData.uid : formData.claims} style={tw`border-black border-0 font-bold border-0 bg-white rounded-r-3xl w-3/4`} placeholder='User ID' type='text' />
        </Input>
    )
}

export default Scanner