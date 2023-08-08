import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "./components/Loader";
import Welcome from "./screens/Welcome";
import Recording from "./screens/Recording";
import store from "./store/store";

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 2000);
  }, []);

  const authUser = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      if (userData) {
        userData = JSON.parse(userData);
        if (userData.loggedIn) {
          setInitialRouteName("Welcome");
        } else {
          setInitialRouteName("LoginScreen");
        }
      } else {
        setInitialRouteName("RegistrationScreen");
      }
    } catch (error) {
      setInitialRouteName("RegistrationScreen");
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        {!initialRouteName ? (
          <Loader visible={true} />
        ) : (
          <>
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={{ headerShown: true }}
            >
              <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
              />
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="Recording" component={Recording} />
            </Stack.Navigator>
          </>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Welcome">
//           <Stack.Screen name="Welcome" component={Welcome} />
//           <Stack.Screen name="Recording" component={Recording} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }
