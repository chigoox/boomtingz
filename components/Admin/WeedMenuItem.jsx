import { ButtonText, HStack, Icon, TrashIcon, VStack } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { DeleteDoc } from '../../scripts/DeleteDoc';
import tw from 'twrnc';
import { Button } from '@gluestack-ui/themed';


const WeedMenuItem = ({ item, toast }) => {
    const [confirm, setConfirm] = useState(false)
    useEffect(() => {
        if (confirm == 'confirmed') {
            setConfirm(false)
            DeleteDoc('Menu', item.name)
            toast('Success!', 'Deleted Menu Item', 'success')
        }
    }, [confirm])
    return (
        <HStack style={tw`gap-2 my-2 border-white border items-center p-2`}>
            <VStack style={tw`w-2/3`}>
                <Text style={tw`text-white text-xl font-bold`}>{item.name}</Text>
                <Text style={tw`text-white text-lg`}>${item.price}</Text>
            </VStack>
            <Button style={tw`${!confirm ? 'bg-green-500' : 'bg-blue-500'} w-1/3`} onPress={() => {
                if (!confirm) setConfirm('confirming')
                if (confirm == 'confirming') setConfirm('confirmed')
            }}>
                <Icon as={TrashIcon} />
                <ButtonText>{!confirm ? 'Remove' : 'Delete'}</ButtonText>
            </Button>
        </HStack>
    )
}

export default WeedMenuItem