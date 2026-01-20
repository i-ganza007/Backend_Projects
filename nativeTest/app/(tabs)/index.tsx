import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Text, View,Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-primary">
      <Image src={images.bg} className="absolute w-full z-0"/>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight:"100%",paddingBottom:10}}>
        <Image src={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"/>
        <SearchBar onPress={()=>router.push('/search')} placeHolder="Search"/>
      </ScrollView>
    </View>
  );
}
