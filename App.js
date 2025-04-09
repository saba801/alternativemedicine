import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VideosSections from './screens/VideosSections';
import VideosScreen from './screens/VideosScreen';
import WatchVideo from './screens/WatchVideo';
import RecipesScreen from './screens/RecipesScreen';
import RecipeDetails from './screens/RecipeDetails';
import Doctors from './screens/Doctors';
import DoctorDetails from './screens/DoctorDetails';
import Messages from './screens/Messages';
import Conversation from './screens/Conversation';
import SearchScreen from './screens/SearchScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import ProfileScreen from './screens/ProfileScreen';
import Launcher from './screens/Launcher';
import Administrator from './screens/Administrator';
import ManageVideosList from './screens/ManageVideosList';
import NewVideos from './screens/NewVideos';
import DoctorsControl from './screens/DoctorsControl';
import AppData from './screens/AppData';
import ManageVideoSections from './screens/ManageVideoSections';
import EditVideoSection from './screens/EditVideoSection';
import NewVideoSection from './screens/NewVideoSection';
import EditVideos from './screens/EditVideos';
import RecipesList from './screens/RecipesList';
import EditRecipes from './screens/EditRecipes';
import NewRecipes from './screens/NewRecipes';
import UsersList from './screens/UsersList';
import DoctorsList from './screens/DoctorsList';
import NewDoctor from './screens/NewDoctor';
import FeedbackScreen from './screens/FeedbackScreen';
import EditDoctor from './screens/EditDoctor';

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onUserLoggedIn(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // invoke useEffect on startup 
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onUserLoggedIn);
    return subscriber; // unsubscribe on unmount
  }, []);

  if(!user){
    return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "" }} initialParams={{ l: ''}} />
      </Stack.Navigator>
    </NavigationContainer>);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Launcher" component={Launcher} options={{ headerShown: false }} />
        <Stack.Screen name="Administrator" component={Administrator} options={{ headerShown: true, title: '' }} initialParams={{ user: user }} />
        <Stack.Screen name="Doctors Control" component={DoctorsControl} options={{ headerShown: true, title: '' }} initialParams={{ user: user }} />
        <Stack.Screen name="Home" component={MainScreen} options={{ title: "Home Screen", headerShown: false }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Videos" component={VideosSections} options={{ title: "Videos Sections" }}  />
        <Stack.Screen name="App Data" component={AppData} options={{ title: "Edit App infornation" }}  />
        <Stack.Screen name="Videos List" component={VideosScreen} options={{ title: "Videos" }}  />
        <Stack.Screen name="Manage Video Sections" component={ManageVideoSections} options={{ title: "Video Sections" }}  />
        <Stack.Screen name="New Video Section" component={NewVideoSection} options={{ title: "Video Sections" }}  />
        <Stack.Screen name="Edit Video Section" component={EditVideoSection} options={{ title: "Video Sections" }}  />
        <Stack.Screen name="Manage Videos List" component={ManageVideosList} options={{ title: "Videos" }}  />
        <Stack.Screen name="Edit Videos" component={EditVideos} options={{ title: "Edit Videos" }}  />
        <Stack.Screen name="New Videos" component={NewVideos} options={{ title: "New Videos" }}  />
        <Stack.Screen name="Watch" component={WatchVideo} options={{ videoId: "" }}  />
        <Stack.Screen name="Recipes" component={RecipesScreen} options={{ title: "" }}  />
        <Stack.Screen name="Recipe Details" component={RecipeDetails} options={{ title: "" }}  />
        <Stack.Screen name="Recipes List" component={RecipesList} options={{ title: "Recipes List" }}  />
        <Stack.Screen name="Edit Recipes" component={EditRecipes} options={{ title: "Edit Recipes" }}  />
        <Stack.Screen name="New Recipes" component={NewRecipes} options={{ title: "New Recipes" }}  />
        <Stack.Screen name="Doctors List" component={DoctorsList} options={{ title: "Doctors List" }}  />
        <Stack.Screen name="Users" component={UsersList} options={{ title: "Users List" }}  />
        <Stack.Screen name="Doctors" component={Doctors} options={{ title: "" }}  />
        <Stack.Screen name="Doctors Details" component={DoctorDetails} options={{ title: "" }}  />
        <Stack.Screen name="New Doctor" component={NewDoctor} options={{ title: "New Doctor" }}  />
        <Stack.Screen name="Edit Doctor" component={EditDoctor} options={{ title: "Edit Doctor" }}  />
        <Stack.Screen name="Messages" component={Messages} options={{ title: "Messages" }}  />
        <Stack.Screen name="Conversation" component={Conversation} options={{ title: "Conversation" }}  />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: "Search" }}  />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ title: "Chatbot" }} initialParams={{ user: user }}  />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} initialParams={{ user: user }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;