import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  originDescription: null,
  destination: null,
  destinationDescription: null,
  travelTimeInformation: null,
  viewBookings: "",
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    //gotoschool datas
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setOriginDescription: (state, action) => {
      state.originDescription = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setDestinationDescription: (state, action) => {
      state.destinationDescription = action.payload;
    },
    setViewBookings: (state, action) => {
      state.viewBookings = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    setCardData: (state, action) => {
      state.cardData = action.payload;
    },

    //gotohome datas
    setHomeDestination: (state, action) => {
      state.homeDestination = action.payload;
    },

    setGoingHomeTraveltime: (state, action) => {
      state.goingHomeTraveltime = action.payload;
    },

    //UserIsLogin
    setUserIsLoggedin: (state, action) => {
      state.userIsLoggedIn = action.payload;
    },

    //isLoading
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    //User.Uid
    setUserId: (state, action) => {
      state.userId = action.payload;
    },

    //User.Profile
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    //DriverLocation
    setDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setOriginDescription,
  setViewBookings,
  setTravelTimeInformation,
  setHomeDestination,
  setGoingHomeTraveltime,
  setUserIsLoggedin,
  setIsLoading,
  setUserId,
  setUserProfile,
  setDriverLocation,
  setCardData,
  setDestinationDescription,
} = navSlice.actions;

//Selectors go to school user
export const selectOrigin = (state) => state.nav.origin;
export const selectOriginDescription = (state) => state.nav.originDescription;
export const selectDestination = (state) => state.nav.destination;
export const selectDestinationDescription = (state) =>
  state.nav.destinationDescription;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;
export const selectViewBookings = (state) => state.nav.viewBookings;
export const selectedCardData = (state) => state.nav.cardData;

//Selectors go to home user
export const selectHomeDestination = (state) => state.nav.homeDestination;
export const SelectGoingHomeTraveltime = (state) =>
  state.nav.goingHomeTraveltime;

export const selectUserIsLoggedIn = (state) => state.nav.userIsLoggedIn;

export const selectIsLoading = (state) => state.nav.isLoading;

export const selectUserId = (state) => state.nav.userId;
export const selectUserProfile = (state) => state.nav.userProfile;

export const selectDriverLocation = (state) => state.nav.driverLocation;

export default navSlice.reducer;
