import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserLocationBooked,
  selectViewBookings,
  setUserLocationBooked,
} from "../../redux/navSlice";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRef } from "react";
import { useEffect } from "react";
import { db } from "../../../config";
import { get, ref } from "firebase/database";

const ViewBookings = () => {
  const bookingData = useSelector(selectViewBookings);
  const bookingDataX = bookingData.Request;
  const bookingKeys = Object.keys(bookingDataX);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUserLocationBooked);
  const [filteredBookingData, setFilteredBookingData] = useState(null);

  const DriverPostID = `${bookingData.DriverData.driverProfile.UID}${bookingData.DriverData.driverProfile.postID}`;
  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(db, `POSTED_RIDES/${DriverPostID}/Request`);
        const snapshot = await get(dbRef);
        const requestData = snapshot.val();
        const requests = Object.keys(requestData).map((key) => ({
          id: key,
          ...requestData[key],
        }));

        const filteredRequests = requests.filter((request) => {
          return !request.status.isAccepted;
        });

        if (filteredRequests.length > 0) {
          const randomRequest = filteredRequests;
          setFilteredBookingData(randomRequest);
          console.log(randomRequest);
        } else {
          console.log("error in fetching");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <ScrollView style={{ flex: 1 }}>
        {!filteredBookingData && (
          <View>
            <Text style={{ alignSelf: "center", fontSize: 30 }}>
              NO BOOKINGS ATM
            </Text>
          </View>
        )}
        {filteredBookingData &&
          filteredBookingData.map((booking, key) => (
            <View key={key} style={styles.mainContainer}>
              <View>
                <TouchableOpacity
                  style={[tw`shadow-md`, styles.container]}
                  onPress={() => {
                    navigation.navigate("BookingDetails");
                    dispatch(setUserLocationBooked(booking));
                  }}
                >
                  <View style={styles.nameAndProfileContainer}>
                    <TouchableOpacity
                      style={styles.profilePic}
                    ></TouchableOpacity>
                    <View
                      style={{
                        justifyContent: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: "400" }}>
                        {booking.userInfo.userName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "300",
                          lineHeight: 14,
                        }}
                      >
                        1h ago
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default ViewBookings;

const styles = StyleSheet.create({
  mainContainer: { padding: 10, flex: 1 },
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  nameAndProfileContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  profilePic: {
    width: 70,
    height: 70,
    backgroundColor: "#b1b1b1",
    borderWidth: 1.6,
    borderColor: "red",
    borderRadius: 1000,
  },
});
