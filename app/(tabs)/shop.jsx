import Ionicons from '@expo/vector-icons/Ionicons';
import { Box, Button, ButtonText, SafeAreaView, ScrollView, Text } from '@gluestack-ui/themed';
import { StyleSheet, Image, Platform, View, TextInput } from 'react-native';

import tw from "twrnc";
import { createArray } from '../../constants/Utils';
import { category as CATEGORY } from '../../constants/META';
import { useEffect, useState } from 'react';
import ShopItem from '../../components/Shop/ShopItem';

export default function Shop() {
  const [PRODUCTS, setPRODUCTS] = useState([])
  const [sortBy, setSortBy] = useState('none')
  const [Search, setSearch] = useState()
  const [category, setCategory] = useState('All')

  /*  useEffect(() => {
     const getData = async () => {
       //fetch products from stripe
       const data = await fetchAllProducts(null, 100)
       //filter Products by if they have metadata, is active and has images
       //then sets PRODUCT state to the result
       setPRODUCTS(Object.values(
         filterObject(data, (v) => {
           return (Object.keys(v.metadata).length > 0) && (v.active) && (v.images.length > 0)
         })
       ))
     }
 
     // getData()
 
 
 
   }, []) */

  const sortList = ['A-Z', 'Z-A', '$-$$$', '$$$-$', 'Newest', 'Most Popular']
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
      for (let index = 0; index < Search.split(' ').length; index++) {

        if (product.metadata.tags?.toUpperCase().split(',').includes(Search.toUpperCase().split(' ')[index])) return true
      }

      return false
    }))
    return (category != 'All') ? result.filter(item => item.metadata.category == category) : result
  }


  return (
    <View style={tw`flex  h-full overflow-hidden text-white bg-black`}>
      <SafeAreaView>
        <View style={tw` w-full  bg-black-900  z-40 top-0`}>
          <ScrollView horizontal style={tw`relative mt-14   flex-row    gap-8 p-2  m-auto`}>
            {CATEGORY.map(_category => {
              return (
                <Button onPress={() => { setCategory(category == _category ? 'All' : _category) }} key={_category} style={tw`items-center justify-center flex-col  rounded-full h-auto hover:scale-105 scale-100 m-2 w-16 bg-transparent text-white`}>
                  <View style={tw`h-16 w-16  overflow-hidden  rounded-full ${category == _category ? 'border-4 border-red-700' : 'border-2'}`}>
                    <Image style={tw`h-full w-full object-cover`} source={{
                      uri:
                        _category == 'Drinks' ? 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                          _category == 'Candy' ? 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                            _category == 'Snacks' ? 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                              _category == 'Tobacco' ? 'https://www.cigar-club.com/wp-content/uploads/2017/03/Cigar-smoking-1024x768.jpeg' :
                                _category == 'Beauty' ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' :
                                  'https://www.instacart.com/assets/domains/product-image/file/large_3a3749ea-89a5-41a3-a995-152d3b8cb2ce.jpg'
                    }} alt="" />
                  </View>
                  <Text style={tw`w-20  text-center`} color={category == _category ? '$red400' : '$white'}>{_category}</Text>
                </Button>
              )
            })}
          </ScrollView>
          <View>
            <View style={tw`w-3/4 m-auto flex-row items-center justify-center flex-wrap gap-2 p-2`}>
              {sortList.map(i => {
                return (
                  <Button onPress={() => { setSortBy(sortBy == i ? 'none' : i) }} style={tw`w-28 bg-gray-900 h-8 text-white border-black p-2 ${sortBy == i ? 'bg-yellow-500' : ''}`}>{
                    <ButtonText style={tw`text-center`}>{i}</ButtonText>
                  }</Button>
                )
              }

              )}
            </View>
          </View>
          <View style={tw`p-2 flex-row items-center justify-center text-black`}>
            <TextInput onChangeText={(v) => { setSearch(v) }} type='text' style={tw`h-12 w-full px-2 bg-white`} placeholder='Search' />

          </View>
        </View>

        <View style={tw`  relative mt-[20rem] md:mt-72 mb-20  h-auto w-full lg:w-3/4 p-2 mx-auto`}>
          <View style={tw`flex-row flex-wrap  gap-4 `}>
            {filterProducts().map(product => {
              return (<View key={product}></View>)
            })}
          </View>
        </View>

      </SafeAreaView>




    </View>
  )
}
//
