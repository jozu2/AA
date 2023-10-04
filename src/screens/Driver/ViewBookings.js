import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectViewBookings } from "../../redux/navSlice";

const ViewBookings = () => {
  const bookingData = useSelector(selectViewBookings);

  // Use Object.keys to get an array of keys from bookingData
  const bookingKeys = Object.keys(bookingData);

  return (
    <View>
      {bookingKeys.map((key) => (
        <View key={key} style={{ marginTop: 20 }}>
          <Text>Key: {key}</Text>
          <Text>Name: {bookingData[key].name}</Text>
          {/* Add additional fields as needed */}
        </View>
      ))}
    </View>
  );
};

export default ViewBookings;

const styles = StyleSheet.create({});
