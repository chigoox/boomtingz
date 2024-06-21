import { Image } from '@gluestack-ui/themed'
import { Box, Button, HStack, ScrollView, VStack, View } from '@gluestack-ui/themed'
import { useState } from 'react'
import tw from "twrnc"

const CarouselStack = ({ slides }) => {
    const [selectedImage, setSelectedImage] = useState(slides[0])

    return (
        <View>
            <VStack>
                <Box style={tw`h-96 w-full m-auto shadow-lg shadow-black rounded-3xl overflow-hidden`}>
                    <Image source={{ uri: selectedImage }} alt='product image' style={tw`h-full w-full`} />
                </Box>
                <Box style={tw`m-2`}>
                    <ScrollView horizontal style={tw`w-full m-auto p-2`}>
                        <HStack space="md">
                            {slides.map(image => <Button key={image} onPress={() => { setSelectedImage(image) }} style={tw`h-20 w-20 m-auto p-0 overflow-hidden rounded-xl shadow shadow-black`}>
                                <Image source={{ uri: image }} style={tw`h-20 w-20`} alt={'product Img'} />
                            </Button>)}
                        </HStack>
                    </ScrollView>
                </Box>
            </VStack>


        </View>
    )
}

export default CarouselStack

