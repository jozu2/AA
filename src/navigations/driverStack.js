import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DriverHomePage from "../screens/Driver/DriverHomePage";
import DriverRideRegistration from "../screens/Driver/DriverRideRegistration";
import SetRouteModal from "../screens/Driver/SetRouteModal";
import ViewBookings from "../screens/Driver/ViewBookings";

const DriverStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="DriverHomePage"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DriverHomePage" component={DriverHomePage} />
      <Stack.Screen
        name="DriverRideRegistration"
        component={DriverRideRegistration}
      />
      <Stack.Screen name="ViewBooking" component={ViewBookings} />
      <Stack.Screen name="SetRouteModal" component={SetRouteModal} />
    </Stack.Navigator>
  );
};

export default DriverStack;
