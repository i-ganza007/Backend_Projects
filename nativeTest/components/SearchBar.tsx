import { icons } from '@/constants/icons'
import { View, Text , Image, TextInput} from 'react-native'

interface Props{
    placeHolder:string
    onPress:()=>void
}

const SearchBar = ({placeHolder,onPress}:Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
      <Image src={icons.search} className='size-5' resizeMode='contain' tintColor="#ab8bff"/>
      <TextInput onPress={onPress} placeholder={placeHolder} value='' onChangeText={()=>{}} placeholderTextColor="#a8b5db" className='flex-1 ml-2 text-white  '/>
    </View>
  )
}

export default SearchBar