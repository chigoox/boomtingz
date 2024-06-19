import { storage } from '@/firebaseConfig'
import { AntDesign } from '@expo/vector-icons'
import { Button, ButtonText, CloseIcon, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, View } from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useRef, useState } from 'react'
import { Image } from 'react-native'
import tw from 'twrnc'
import useSetDocument from '@/hooks/useSetDocument'


export const Settings = ({ showSettings, setShowSettings, name, avatar, uid, refDom }) => {
    const [settingsInfo, setSettingsInfo] = useState()
    const [selectedImage, setSelectedImage] = useState(null);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSettingsInfo((o) => ({ ...o, avatar: result.assets[0]?.uri }))
            setSelectedImage(result.assets[0]?.uri);
        } else {
            // console.log('You did not select any image.');
        }
    };

    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    const uploadUriToFirebase = async (uri) => {
        try {
            const blob = await uriToBlob(uri);
            const storageRef = ref(storage, `images/avatars/${uid}.jpg`);
            const snapshot = await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(snapshot.ref);
            //console.log('File available at:', downloadURL);

            return downloadURL;
        } catch (error) {
            console.error('Upload failed:', error.message);
        }
    }
    const saveSettings = async () => {
        if (settingsInfo?.name) useSetDocument('Users', uid, { name: settingsInfo.name })
        if (selectedImage) {
            const url = await uploadUriToFirebase(selectedImage);
            useSetDocument('Users', uid, { avatar: url })
        }
    }


    return (
        <Modal
            isOpen={showSettings}
            onClose={() => {
                setShowSettings(false)
            }}

        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Settings</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <VStack space='lg'>
                        <Button onPress={pickImageAsync} style={tw`rounded-full overflow-hidden w-32 h-32 m-auto relative`}>
                            <VStack style={tw`absolute rounded-full h-32 justify-center flex bg-black p-2 bg-opacity-25 items-center z-10`}>
                                <AntDesign size={32} color={'white'} name='camera' />
                                <ButtonText>Upload Avatar</ButtonText>
                            </VStack>
                            <Image style={tw`w-32 h-32`} source={selectedImage} alt='proile' />

                        </Button>
                        <VStack space="xs">
                            <Text color="$text500" lineHeight="$xs">
                                Name
                            </Text>
                            <Input style={tw`border-black`} textAlign="center">
                                <InputField onChangeText={(v) => { setSettingsInfo((o) => ({ ...o, name: v })) }} placeholder={name} type='text' />
                            </Input>
                        </VStack>

                    </VStack>
                    <View>
                        <Text style={tw`font-bold text-center`}>
                            {uid}
                        </Text>
                    </View>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={() => {
                            setShowSettings(false)
                        }}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        size="sm"
                        action="positive"
                        borderWidth="$0"
                        style={tw`relative`}
                        onPress={async () => {
                            await saveSettings()
                            setShowSettings(false)
                        }}
                    >
                        <ButtonText style={tw``}>Save changes</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default Settings