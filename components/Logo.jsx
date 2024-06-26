import React, { useState } from 'react'
import { Button, ButtonText, Center, CloseIcon, HStack, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, View } from '@gluestack-ui/themed'
import { Image } from '@gluestack-ui/themed'
import tw from 'twrnc'
import { createArray } from '../constants/Utils'
import { AntDesign } from '@expo/vector-icons'

const Logo = ({ size }) => {
    const logo = require('../assets/images/logo.png')
    const [showMenu, setShowMenu] = useState(false)
    return (
        <Center style={tw`${size == 'sm' ? '' : ''}`}>
            <Button onPress={() => { setShowMenu(true) }} style={tw` overflow-hidden relative bg-black ${size == 'sm' ? 'h-24 w-24' : 'h-36 w-36'} border-4 border-red-700  rounded-full`}>
                <View style={tw`bg-green-600 absolute top-0 h-full w-full z-10 bg-opacity-18`}>

                </View>
                <View style={tw`  ${size == 'sm' ? 'h-20 w-20' : 'h-26 w-26'} rounded-full p-2 border-2 border-green-700 border-dashed  m-auto`}>
                    <Image alt={'logo'} style={tw` ${size == 'sm' ? 'h-20 w-20' : 'h-26 w-26'} rounded-full  m-auto`} source={logo} />

                </View>
            </Button>
            <Modal
                isOpen={showMenu}
                onClose={() => {
                    setShowMenu(false)
                }}

            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader style={tw`bg-black`}>
                        <Heading style={tw`text-white`} size="lg">{'Weekly Menu'.toLocaleUpperCase()}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody style={tw`bg-black`}>
                        {[{ name: 'kush', price: 30, type: 'stiva', rating: 1 }, { name: 'kushx2', price: 5, type: 'indica', rating: 5 }].sort((a, b) => a.price - b.price).map((item) => {
                            console.log(item)
                            return (
                                <HStack style={tw`items-center my-2 justify-between border border-white`}>
                                    <VStack style={tw`w-full gap-2 p-2 items-center border border-white justify-center h-12  border-white`}>
                                        <Text style={tw`text-white `}>{item.name}</Text>
                                        <Text style={tw`text-white `}>${item.price}-{item.type}</Text>
                                    </VStack>
                                    {/* <HStack style={tw`w-20 border border-white `}>
                                        {createArray(item.rating).map(item => {
                                            return (
                                                <Text style={tw`text-xs border-white m-0`}>🔥</Text>
                                            )
                                        })}
                                    </HStack> */}
                                </HStack>
                            )
                        })}

                    </ModalBody>
                    <ModalFooter style={tw`bg-black`}>

                        <Button
                            size="sm"
                            action="positive"
                            borderWidth="$0"
                            onPress={() => {

                                setShowMenu(false)
                            }}
                        >
                            <ButtonText >Done</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Heading h={'$8'} color='$white'>Boom Tingz</Heading>
        </Center>
    )
}

export default Logo