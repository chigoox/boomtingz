import { Text, HStack, VStack, View, Button, ButtonText, CloseIcon, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView } from '@gluestack-ui/themed'
import React from 'react'
import tw from 'twrnc'
import QR from './QR'

export const Claims = ({ setIsLoading, toast, showClaims, setShowClaims, uid, claims }) => {

    //setIsLoading(false)
    // toast('Completed', 'You have claimed an item!', 'success')



    return (
        <Modal

            isOpen={showClaims}
            onClose={() => {
                setShowClaims(false)
            }}

        >
            <ModalBackdrop />
            <ModalContent style={tw`bg-black`}>
                <ModalHeader>
                    <Heading color='$white' size="lg">Claims</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <ScrollView style={tw`h-96`}>
                        {Object.values(claims || {})?.map((claim) => {
                            return (
                                <View key={claim.id} style={tw`w-full justify-between rounded-lg h-16 border`}>
                                    <HStack style={tw`w-full justify-between p-2`}>
                                        <VStack>
                                            <Text style={tw`text-white font-semibold text-lg`}>{claim.item}</Text>
                                            <Text style={tw`text-white`}>Cost: {claim.cost}</Text>
                                        </VStack>
                                        <QR title={'Claims'} valueQR={claim.id} />

                                    </HStack>
                                </View>
                            )
                        })}
                    </ScrollView>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={() => {
                            setShowClaims(false)
                        }}
                    >
                        <ButtonText>Close</ButtonText>
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default Claims