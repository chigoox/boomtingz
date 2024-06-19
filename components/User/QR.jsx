import { Button, ButtonText, Center, CloseIcon, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, View } from '@gluestack-ui/themed'
import React, { useState } from 'react'
import tw from 'twrnc'
import QRCode from 'react-native-qrcode-svg';

const QR = ({ valueQR }) => {
    const [showQR, setShowQR] = useState(false)
    return (
        <View>
            <Button onPress={() => { setShowQR(true) }}>
                <ButtonText>User QR code</ButtonText>
            </Button>
            <Modal
                isOpen={showQR}
                onClose={() => {
                    setShowQR(false)
                }}

            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">UserID</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody style={tw``}>
                        <VStack style={'gap-2 items-center justify-center'}>
                            <Text style={tw`bg-black text-white my-2 rounded text-xl text-center`}>{valueQR}</Text>
                            <Center>
                                <QRCode
                                    size={250}
                                    color='green'
                                    backgroundColor='white'
                                    value={valueQR}

                                />
                            </Center>
                        </VStack>





                    </ModalBody>
                    <ModalFooter>
                        <Button
                            size="sm"
                            action="positive"
                            borderWidth="$0"
                            style={tw`relative`}
                            onPress={async () => {
                                setShowQR(false)
                            }}
                        >
                            <ButtonText style={tw``}>Close</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </View>
    )
}

export default QR