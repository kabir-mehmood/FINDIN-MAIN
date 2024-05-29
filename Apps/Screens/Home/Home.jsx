import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getFirestore,
  collection,
  getDoc,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import Loader from "../../Components/Loader";
import colors from "../../Constants/Colors";
import { useAuth } from "../../Contexts/AuthContext";
import { useItems } from "../../Contexts/ItemsContext";
import { fetchItems } from "../../Hooks/FireStoreHooks/FireStoreHooks";
import { Colors } from "react-native/Libraries/NewAppScreen";

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& FUNCTIONS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
const Item = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => navigation.navigate("ItemDetail", { item: item })}
  >
    {item.images ? (
      <Image
        source={{ uri: item.images.filter((image) => !image == "")[0] }}
        style={styles.itemImage}
      />
    ) : null}
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginRight: 5,
      }}
    >
      <View
        style={{
          flex: 0.8,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 12,
        }}
      >
        <Text
          style={{ color: colors.darkestBlue, fontSize: 16, fontWeight: "500" }}
        >
          {item.title}
        </Text>
        <Text style={{ color: colors.skyBlue }}>Lahore , 0 KM</Text>
      </View>
      <View style={{ flex: 0.2 }}>
        <Image
          style={styles.itemDp}
          source={require("./../../../assets/images/u1.jpg")}
        />
      </View>
    </View>
  </TouchableOpacity>
);

export default function Home({ navigation }) {
  const { user } = useAuth();
  const { items, setItems } = useItems();
  let lostItems, foundItems;
  if (items) {
    lostItems = items.filter((item) => item.status == "lost");
    foundItems = items.filter((item) => item.status == "found");
  }

  useEffect(() => {
    console.log("useeffect of HOME [] \n");
    fetchItems("Items", setItems);
  }, []);

  if (!items) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightbg,
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "13%",
      }}
    >
      <StatusBar style="dark" backgroundColor={colors.lightbg} />

      <View style={{ flex: 0.1, paddingHorizontal: "8%" }}>
        <Text style={{ fontSize: 16, color: Colors.darkestBlue }}>Hello </Text>
        <Text style={{ fontSize: 26, fontWeight: "500", color: colors.yellow }}>
          {user ? user.username : null}{" "}
        </Text>
      </View>

      <View style={{ flex: 0.1, paddingHorizontal: "8%" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 0.5,
            borderColor: colors.grey,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 6,
            backgroundColor: colors.white,
            marginVertical: 5,
          }}
        >
          <View style={{ flex: 0.1 }}>
            <Fontisto name="search" size={18} color="grey" />
          </View>
          <View style={{ flex: 0.8 }}>
            <TextInput placeholder="Find items"></TextInput>
          </View>
          <View style={{ flex: 0.1 }}>
            <TouchableOpacity>
              <Ionicons
                name="options-outline"
                size={20}
                color="grey"
                style={{ transform: [{ rotate: "270deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Found items container */}
        <View style={{ marginVertical: "4%", marginLeft: "8%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.darkestBlue,
              }}
            >
              Found Items
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("FoundItems", { data: items })}
            >
              <Text style={{ color: colors.skyBlue }}>see all (101)</Text>
            </TouchableOpacity>
          </View>

          {foundItems.map((item) => (
            <Item key={item.id} item={item} navigation={navigation} />
          ))}
        </View>

        {/* Lost items container */}
        <View style={{ marginBottom: "4%", marginLeft: "8%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.darkestBlue,
              }}
            >
              Lost Items
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LostItems", { data: items })}
            >
              <Text style={{ color: colors.skyBlue }}>see all (47)</Text>
            </TouchableOpacity>
          </View>

          {lostItems.map((item) => (
            <Item key={item.id} item={item} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    marginVertical: 5,
    marginRight: 20,
    height: 180,
    width: 170,
    borderRadius: 6,
  },
  itemImage: {
    height: "60%",
    width: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  itemDp: {
    height: 33,
    width: 33,
    resizeMode: "cover",
    borderRadius: 50,
  },
  title: {
    fontSize: 16,
  },
});
