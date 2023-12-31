import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "./../../../config";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { selectUserId, setViewBookings } from "../../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const DriverHomePage = () => {
  const navigation = useNavigation();
  const [uids, setUids] = useState([]);
  const postedRidesRef = ref(db, "POSTED_RIDES");
  const userID = useSelector(selectUserId);
  const idToSearch = userID;
  const [fetchedData, setFetchedData] = useState(null);
  const mapRef = useRef(null);
  const API_KEY = "AIzaSyCU46T5I3BvJF3_uQHta5XGih_xljGYt-I";
  const dispatch = useDispatch();

  useEffect(() => {
    // Ensure idToSearch is defined and not null or undefined
    if (idToSearch) {
      const q = query(
        postedRidesRef,
        orderByChild("driverProfile/UID"),
        equalTo(idToSearch)
      );

      get(q)
        .then((snapshot) => {
          const matchingUids = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const uid = childSnapshot.key; // This is the UID you want
              matchingUids.push(uid);
            });
            setUids(matchingUids);
          } else {
            console.log("No matching records found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [idToSearch]);
  useEffect(() => {
    async function fetchData() {
      try {
        const promises = uids.map(async (uid) => {
          const dbRef = ref(db, `POSTED_RIDES/${uid}`);
          const snapshot = await get(dbRef);
          const requestData = snapshot.val();

          if (requestData) {
            return {
              id: uid,
              ...requestData,
            };
          } else {
            console.log(`No data found for UID: ${uid}`);
            return null; // Return null for undefined data
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((result) => result !== undefined);

        if (validResults.length > 0) {
          setFetchedData(validResults);
          // Do something with the `validResults` array here (e.g., set it in state)
        } else {
          console.log("No data found for any UID.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [uids]);

  handleCreateButton = () => {
    navigation.navigate("DriverRideRegistration");
  };
  return (
    <View>
      <View style={[tw`shadow-lg`, styles.topBar]}>
        <Text style={styles.mainTitle}>Angkas Atad</Text>
        <Text style={styles.title}>ride Along</Text>
      </View>
      <ScrollView style={[tw`mt-20`, styles.cardContainer]}>
        <View>
          {fetchedData && (
            <View>
              {fetchedData.map((data) => {
                return (
                  <View key={data.id} style={styles.cardBox}>
                    <View>
                      <View style={styles.detailsContainer}>
                        <View style={[styles.IconChat]}>
                          <TouchableOpacity
                            onPress={() => {
                              if (data) {
                                dispatch(
                                  setViewBookings({
                                    Request: data.Request,
                                    DriverData: data,
                                  })
                                );
                                navigation.navigate("UserAccepted");
                              } else {
                                dispatch(
                                  setViewBookings({
                                    Request: "",
                                    DriverData: "",
                                  })
                                );
                                navigation.navigate("UserAccepted");
                              }
                            }}
                          >
                            <AntDesign
                              name="user"
                              color={"#7a7a7a"}
                              size={35}
                            />
                            <View></View>
                            <Text
                              style={{ paddingLeft: 5 }}
                            >{`1/${data.Schedule.seatAvailable}`}</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <EvilIcons
                            name="close"
                            color={"#323232"}
                            size={35}
                            style={styles.IconThreeDot}
                          />
                        </View>
                        <Text style={styles.txtContentFirst}>- Schedule -</Text>
                        <View style={{ alignItems: "center" }}>
                          <Text style={styles.txtContent}>
                            {data.Schedule.When}
                          </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <Text style={styles.txtContentTwo}>
                            {data.Schedule.timeOfDeparture}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.mapContainer}>
                      <MapView
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        ref={mapRef}
                        style={{
                          paddingVertical: 180,
                          zIndex: -2,
                          marginTop: "20%",
                        }}
                        region={{
                          latitude: data.coordinates.destination.latitude,
                          longitude: data.coordinates.destination.longitude,
                          latitudeDelta: 0.21,
                          longitudeDelta: 0.21,
                        }}
                        scrollEnabled={false}
                      >
                        {data.coordinates.origin.longitude && (
                          <Marker
                            style={{ width: 200, height: 200 }}
                            coordinate={{
                              latitude: data.coordinates.origin.latitude,
                              longitude: data.coordinates.origin.longitude,
                            }}
                            title="Origin"
                            description={data.coordinates.origin.location}
                            identifier="origin"
                            pinColor="red"
                          ></Marker>
                        )}

                        {data.coordinates.destination.latitude && (
                          <Marker
                            style={{ width: 200, height: 200 }}
                            coordinate={{
                              latitude: data.coordinates.destination.latitude,
                              longitude: data.coordinates.destination.longitude,
                            }}
                            title="Destination"
                            description={data.coordinates.destination.location}
                            identifier="destination"
                            pinColor="green"
                          ></Marker>
                        )}

                        <MapViewDirections
                          origin={{
                            latitude: data.coordinates.origin.latitude,
                            longitude: data.coordinates.origin.longitude,
                          }}
                          destination={{
                            latitude: data.coordinates.destination.latitude,
                            longitude: data.coordinates.destination.longitude,
                          }}
                          identifier="destination"
                          apikey={API_KEY}
                          strokeWidth={4}
                          strokeColor="red"
                          optimizeWaypoints={true}
                          onReady={(result) => {
                            mapRef.current.fitToCoordinates(
                              result.coordinates,
                              {
                                edgePadding: {
                                  top: 10,
                                  right: 10,
                                  bottom: 10,
                                  left: 10,
                                },
                              }
                            );
                          }}
                        />
                      </MapView>
                      <View style={{ alignItems: "center" }}>
                        <Text style={styles.txtContentx}>
                          {data.coordinates.destination.location}
                        </Text>
                        <Text style={styles.txtContentFirstx}>Destination</Text>
                      </View>
                      <View style={styles.BtnContainer}>
                        <Pressable
                          style={styles.Btn}
                          onPress={() => {
                            if (data) {
                              dispatch(
                                setViewBookings({
                                  Request: data.Request,
                                  DriverData: data,
                                })
                              );
                              navigation.navigate("ViewBooking");
                            } else {
                              dispatch(
                                setViewBookings({
                                  Request: "",
                                  DriverData: "",
                                })
                              );
                              navigation.navigate("ViewBooking");
                            }
                          }}
                        >
                          <MaterialCommunityIcons
                            name="book-open-outline"
                            color={"#7a7a7a"}
                            size={30}
                            style={styles.bookingBtn}
                          />
                        </Pressable>
                        <Pressable style={styles.Btn}>
                          <Text style={styles.Start}>START</Text>
                          <Text style={styles.Ride}>RIDE</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <View>
          <Pressable onPress={handleCreateButton} style={styles.addContainer}>
            <View style={styles.wl}></View>
            <View style={styles.wl2}></View>
            <View style={styles.wl3}></View>
            <View style={styles.wl4}></View>
            <AntDesign
              name="plus"
              color={"gray"}
              size={80}
              style={styles.Icon}
            />

            <Text>CREATE A RIDE</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverHomePage;

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#fff",
    width: "100%",
    position: "absolute",
    zIndex: 20000,
    paddingTop: "10%",
    paddingBottom: "5%",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomColor: "#b5b5b5",
  },
  mainTitle: {
    fontSize: 35,
    alignSelf: "center",
    fontWeight: "700",
  },
  title: {
    fontSize: 14,
    position: "absolute",
    bottom: "25%",
    right: "22%",
  },
  addContainer: {
    width: "80%",
    alignSelf: "center",
    height: 280,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "gray",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 300,
    marginTop: 50,
  },
  cardContainer: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 35,
  },
  wl: {
    backgroundColor: "#f2f2f2",
    width: 200,
    height: 20,
    bottom: -10,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
  wl2: {
    backgroundColor: "#f2f2f2",
    width: 200,
    height: 20,
    top: -10,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
  wl3: {
    backgroundColor: "#f2f2f2",
    width: 20,
    height: 200,
    top: 40,
    left: -10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "flex-start",
    zIndex: 10,
  },
  wl4: {
    backgroundColor: "#f2f2f2",
    width: 20,
    height: 200,
    top: 40,
    right: -10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "flex-start",
    zIndex: 10,
  },
  cardBox: {
    backgroundColor: "#fff",
    height: 600,
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderTopColor: "#fff",
    borderRightColor: "gray",
    borderLeftColor: "#242424",
  },
  mapContainer: {
    padding: 8,
    position: "absolute",
    width: "100%",
    zIndex: 100,
    top: 10,
  },
  profilePic: {
    backgroundColor: "#979797",
    width: 60,
    height: 60,
    left: 20,
    top: 12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "red",
  },
  detailsContainer: {
    paddingHorizontal: 25,
  },

  txtContentTwo: {
    fontSize: 17,
    fontWeight: "300",
  },

  txtContent: {
    fontSize: 20,
    fontWeight: "300",
  },
  txtContentx: {
    fontSize: 17,
    fontWeight: "300",
    marginTop: 10,
  },
  txtContentFirst: {
    paddingTop: 12,
    alignSelf: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  txtContentFirstx: {
    alignSelf: "center",
    fontSize: 12,
    color: "#2e2e2e",
    fontWeight: "600",
  },
  IconThreeDot: {
    position: "absolute",
    right: -8,
    top: 20,
  },
  Btn: {
    width: "32%",
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderTopColor: "#dbdbdb",
    borderRightColor: "#bababa",
    borderLeftColor: "#121212",
    borderBottomColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  BtnContainer: {
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  Start: {
    fontSize: 14,
    fontWeight: "800",
    color: "#363636",
  },
  Ride: {
    color: "#363636",
    fontWeight: "700",

    fontSize: 12,
    lineHeight: 13,
  },
  IconChat: {
    position: "absolute",
    top: 20,
    left: 20,
  },
});
