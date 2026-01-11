import { Tabs } from 'expo-router';

export default function TabLayout(){
    return(
        <Tabs screenOptions={{headerShown: false,}}>
            <Tabs.Screen name = "index" options={{title:'Home',}}/>
            <Tabs.Screen name = "task" options={{title:'Tasks',}}/>
            <Tabs.Screen name = "dayView" options={{title:"24 hour view"}}/>
        </Tabs>
    );
    
}