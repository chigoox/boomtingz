import { getRandTextNum } from '@/constants/Utils'
import useSetDocument from '@/hooks/useSetDocument'
import { Button, ButtonText, CloseIcon, HStack, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'

export const RedeemPoints = ({ setIsLoading, toast, showRedeemPoints, setShowRedeemPoints, points, uid }) => {
    const [settingsInfo, setSettingsInfo] = useState()
    const [selectedImage, setSelectedImage] = useState(null);
    const redeemables = [{ name: 'Dime', cost: 5 }, { name: '8th', cost: 10 }, { name: 'Half', cost: 20 }]


    // 8 day x 30 = 240 14.4 points
    //

    const redeem = (item) => {
        console.log(points)
        if (points <= 0) {
            toast('No points', 'You do not have any points!')
            return
        } else if (points >= item.cost) {
            setIsLoading(true)
            useSetDocument('Users', uid, {
                loyaltyPoints: points - item.cost,

            })
            const claimID = `claim-${getRandTextNum(10)}`
            useSetDocument('Claims', claimID, {
                claimID: claimID,
                item: item.name,
                const: item.cost
            })
            setIsLoading(false)
            toast('Completed', 'You have claimed an item!', 'success')

        } else {
            toast('No points', 'You do not have enough points!')
            return
        }


    }



    return (
        <Modal

            isOpen={showRedeemPoints}
            onClose={() => {
                setShowRedeemPoints(false)
            }}

        >
            <ModalBackdrop />
            <ModalContent style={tw`bg-black`}>
                <ModalHeader>
                    <Heading color='$white' size="lg">Redeem Item</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <ScrollView>
                        {redeemables.map((item, index) => {
                            const [confirm, setConfirm] = useState(false)
                            useEffect(() => {
                                if (confirm == 'confirmed') {
                                    console.log('first')
                                    setConfirm(false)
                                    redeem(item)
                                }
                            }, [confirm])
                            return (
                                <View style={tw`w-full justify-between rounded-lg h-16 border`}>
                                    <HStack style={tw`w-full justify-between p-2`}>
                                        <VStack>
                                            <Text style={tw`text-white font-semibold text-lg`}>{item.name}</Text>
                                            <Text style={tw`text-white`}>Cost: {item.cost}</Text>
                                        </VStack>
                                        <Button style={tw`${!confirm ? 'bg-green-500' : 'bg-blue-500'}`} onPress={() => {
                                            if (!confirm) setConfirm('confirming')
                                            if (confirm == 'confirming') setConfirm('confirmed')
                                        }}>
                                            <ButtonText>{!confirm ? 'Redeem' : 'Confirm'}</ButtonText>
                                        </Button>
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
                            setShowRedeemPoints(false)
                        }}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default RedeemPoints