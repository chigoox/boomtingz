import { getRandTextNum } from '@/constants/Utils'
import useSetDocument from '@/hooks/useSetDocument'
import { Button, ButtonText, CloseIcon, HStack, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'

export const Claims = ({ setIsLoading, toast, showClaims, setShowClaims, uid }) => {

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
                    <ScrollView>

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