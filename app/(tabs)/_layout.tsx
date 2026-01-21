// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Clock, Home, ListTodo } from 'lucide-react-native';

export default function TabLayout(){
    return(
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2D5F2E',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tabs.Screen 
                name="task" 
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color, size }) => (
                        <ListTodo color={color} size={size} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tabs.Screen 
                name="dayView" 
                options={{
                    title: '24h View',
                    tabBarIcon: ({ color, size }) => (
                        <Clock color={color} size={size} strokeWidth={2.5} />
                    ),
                }}
            />
        </Tabs>
    );
}