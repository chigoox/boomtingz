import { Box, Button, ButtonText, Center, HStack, Input, InputField, InputIcon, InputSlot, Link, SafeAreaView, ScrollView, SearchIcon, Text, VStack } from '@gluestack-ui/themed';
import { Image, Keyboard, TextInput, View } from 'react-native';

import { useEffect, useState } from 'react';
import tw from "twrnc";
import { category as CATEGORY } from '../../constants/META';
import { filterObject } from '../../constants/Utils';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';
import ProductView from '../../components/Shop/ProductView';
import { TouchableWithoutFeedback } from 'react-native';
import Logo from '../../components/Logo'

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export default function Shop() {
  const [PRODUCTS, setPRODUCTS] = useState([])
  const [sortBy, setSortBy] = useState('none')
  const [Search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const OS = (Platform.OS)
  const [selectedProduct, setSelectedProduct] = useState(false)

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  const [screenSize, setScreenSize] = useState('SM')
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
        const screenWidth = window.width
        if (screenWidth <= 640)
          setScreenSize('SM')
        if (screenWidth >= 641 && screenWidth <= 1023) setScreenSize('MD')

        if (screenWidth >= 1024 && screenWidth <= 1279) setScreenSize('LG')

        if (screenWidth >= 1280)
          setScreenSize('XL')

      },
    );
    return () => subscription?.remove();
  }, []);



  useEffect(() => {
    const getData = async () => {
      //fetch products from stripe
      try {
        let data = await fetch('/fetchProducts',
          {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify('data'),
          }
        )
        data = await data.json()
        setPRODUCTS(Object.values(
          filterObject(data, (v) => {
            return (Object.keys(v.metadata).length > 0) && (v.active) && (v.images.length > 0)
          })
        ))
      } catch (error) {
        console.log(error.message)
      }

    }

    getData()



  }, [])



  const sortList = ['A-Z', 'Z-A', '$-$$$', '$$$-$', 'Newest', 'Popular']
  const filterProducts = () => {
    let result = []
    switch (sortBy) {
      case sortList[0]:
        result = PRODUCTS.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0))
        break

      case sortList[1]:

        result = PRODUCTS.sort((a, b) => (b.name.toUpperCase() > a.name.toUpperCase()) ? 1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? -1 : 0))


        break


      case sortList[2]:
        result = PRODUCTS.sort((a, b) => b.metadata.price - a.metadata.price)

        break

      case sortList[3]:
        result = PRODUCTS.sort((a, b) => a.metadata.price - b.metadata.price)


        break
      case sortList[4]:

        result = PRODUCTS.sort((a, b) => b.created - a.created)
        break

      case sortList[5]:
        result = PRODUCTS.sort((a, b) => b.metadata?.unitsSold - a.metadata?.unitsSold)

        break

      default:
        result = PRODUCTS.sort((a, b) => b.updated - a.updated)
        break


    }

    if (Search != '') result = (result.filter(product => {
      for (let index = 0; index < Search?.split(' ').length; index++) {

        if (product.metadata.tags?.toUpperCase().split(',').includes(Search.toUpperCase().split(' ')[index])) return true
      }

      return false
    }))

    return (category != 'All') ?
      result.filter(item => item.metadata.category == category) : result
  }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex ${OS == 'web' ? `${screenSize == 'SM' ? 'px-2' : screenSize == 'MD' ? 'px-20' : screenSize == 'LG' ? 'px-50' : screenSize == 'XL' ? 'px-72' : 'px-96'}` : 'px-2'}  h-full overflow-hidden text-white bg-black`}>
        <SafeAreaView>
          <Logo size={'sm'} />
          <ProductView product={selectedProduct} setShowProductView={setSelectedProduct} showProductView={selectedProduct} />
          <Box style={tw` w-full    z-40 top-0`}>
            <ScrollView horizontal style={tw`relative mt-14 ${screenSize == 'SM' ? 'w-full' : 'w-3/4'}    m-auto`}>
              <HStack space='sm'>
                {CATEGORY.map(_category => {
                  return (
                    <Button onPress={() => { setCategory(category == _category ? 'All' : _category) }} key={_category} style={tw` border-white items-center justify-center   rounded-full h-auto m-2 w-16 bg-transparent text-white`}>
                      <VStack style={'items-center justify-center'}>
                        <View style={tw`h-20 w-20  overflow-hidden  rounded-full ${category == _category ? 'border-4 border-red-700' : 'border-2'}`}>
                          <Image style={tw`h-full w-full `} source={{
                            uri:
                              _category == 'Drinks' ? 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                                _category == 'Candy' ? 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                                  _category == 'Snacks' ? 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                                    _category == 'Tobacco' ? 'https://www.cigar-club.com/wp-content/uploads/2017/03/Cigar-smoking-1024x768.jpeg' :
                                      _category == 'Beauty' ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                                        'https://www.instacart.com/assets/domains/product-image/file/large_3a3749ea-89a5-41a3-a995-152d3b8cb2ce.jpg'
                          }} alt="" />
                        </View>
                        <Text style={tw`w-20 border-white   text-center`} color={category == _category ? '$red400' : '$white'}>{_category}</Text>
                      </VStack>
                    </Button>
                  )
                })}
              </HStack>
            </ScrollView>

            <View>
              <View style={tw`w-3/4 m-auto flex-row items-center justify-center flex-wrap gap-2 p-2`}>
                {sortList.map(i => {
                  return (
                    <Button key={i} onPress={() => { setSortBy(sortBy == i ? 'none' : i) }} style={tw`w-20 bg-gray-900 h-8 text-white border-black p-2 ${sortBy == i ? 'bg-yellow-500' : ''}`}>{
                      <ButtonText style={tw`text-center`}>{i}</ButtonText>
                    }</Button>
                  )
                }

                )}
              </View>
            </View>

            <View style={tw`p-2 flex-row items-center justify-center text-black`}>
              <Input style={tw`h-12 rounded-full w-full text-black px-2 bg-white`}>
                <InputSlot>
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholderTextColor={'black'} onChangeText={(v) => { setSearch(v) }} type='text' style={tw``} placeholder='Search' />
              </Input>
            </View>
          </Box>

          <ScrollView style={tw`relative  mb-20    ${screenSize == 'SM' ? 'h-120' : screenSize == 'MD' ? 'h-190' : screenSize == 'LG' ? 'h-190' : screenSize == 'XL' ? 'h-190' : 'h-96'} w-full lg:w-3/4 p-2 mx-auto`}>
            <View style={tw`flex-row flex-wrap p-2 mb-96 gap-4 `}>
              {(filterProducts() || PRODUCTS).map((product, index) => {
                return (
                  <Button
                    onPress={() => { setSelectedProduct(product) }}
                    style={tw` border border-dashed p-0 border-green-800 overflow-hidden  bg-black m-auto ${OS == 'web' ? 'w-42 h-auto' : 'w-32 h-52'}  rounded-xl`}
                    key={index}
                  >
                    <VStack>
                      <View rounded={'$lg'} style={tw`w-42 overflow-hidden  p-0 rounded-lg h-3/4`}>
                        <Image style={tw`${OS == 'web' ? 'h-50 w-full' : 'h-full'} rounded-lg  w-full`} source={{ uri: product.images[0] }} />
                      </View>
                      <VStack style={tw`${OS == 'web' ? 'h-16 ' : 'h-1/3'} w-full `}>
                        <Center style={tw`h-10  mt-4`}>
                          <Text style={tw`text-white text-center w-32  h-10`}>{product.name.substring(0, (OS == 'web' ? 20 : 15))}{product.name.length > 20 ? '...' : ''}</Text>
                          <Text style={tw`text-white text-center h-8`}>${product.metadata.price}</Text>
                        </Center>
                      </VStack>
                    </VStack>
                  </Button>)
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  )
}
//
