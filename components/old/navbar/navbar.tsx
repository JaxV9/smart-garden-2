import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Home from '../../assets/icons/home.svg';
import Garden from '../../assets/icons/garden.svg';
import Profile from '../../assets/icons/profil.svg';
import Search from '../../assets/icons/search.svg';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import useUseCase from '@/hooks/useUseCase';

export const Navbar = () => {
  const [iconSelected, setIconSelected] = useState<string>('home');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { gatewayUseCase } = useUseCase();

  const iconPath: Record<string, string> = {
    home: '/home',
    search: '/search',
    garden: '/garden',
    profile: '/profile',
  };

  const selectIcon = (icon: string) => {
    setIconSelected(icon);
    const path = iconPath[icon];
    if (path) {
      router.push(path as any);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIconSelected('home')
    if (gatewayUseCase.userUseCases.isLogin && isMounted) {
      setIsLogin(true)
    }
    if (!gatewayUseCase.userUseCases.isLogin && isMounted) {
      setIsLogin(false)
    }
  }, [gatewayUseCase.userUseCases.isLogin, isMounted])

  useEffect(() => {
    if (!isLogin && isMounted) {
      router.replace('/login')
    }
  }, [isLogin, isMounted])

  return (
    <>
      <View style={styles.container}>
        {isLogin &&
          <>
            <TouchableOpacity
              onPress={() => selectIcon('home')}
              style={styles.iconContainer}
            >
              <View style={iconSelected === 'home' ? styles.bar : styles.hide} />
              <Home
                style={styles.icon}
                width={28}
                height={28}
                opacity={iconSelected === 'home' ? 1 : 0.6}
              />
              <Text
                style={iconSelected === 'home' ? styles.textSelected : styles.text}
              >
                Accueil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectIcon('search')}
              style={styles.iconContainer}
            >
              <View style={iconSelected === 'search' ? styles.bar : styles.hide} />
              <Search
                style={styles.icon}
                width={28}
                height={28}
                opacity={iconSelected === 'search' ? 1 : 0.6}
              />
              <Text
                style={
                  iconSelected === 'search' ? styles.textSelected : styles.text
                }
              >
                Recherche
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectIcon('garden')}
              style={styles.iconContainer}
            >
              <View style={iconSelected === 'garden' ? styles.bar : styles.hide} />
              <Garden
                style={styles.icon}
                width={28}
                height={28}
                opacity={iconSelected === 'garden' ? 1 : 0.6}
              />
              <Text
                style={
                  iconSelected === 'garden' ? styles.textSelected : styles.text
                }
              >
                Potager
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectIcon('profile')}
              style={styles.iconContainer}
            >
              <View style={iconSelected === 'profile' ? styles.bar : styles.hide} />
              <Profile
                style={styles.icon}
                width={28}
                height={28}
                opacity={iconSelected === 'profile' ? 1 : 0.6}
              />
              <Text
                style={
                  iconSelected === 'profile' ? styles.textSelected : styles.text
                }
              >
                Profil
              </Text>
            </TouchableOpacity>
          </>
        }
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 8,
  },
  iconContainer: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  textSelected: {
    textAlign: 'center',
    fontSize: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 10,
    opacity: 0.6,
  },
  icon: {
    margin: 'auto',
  },
  bar: {
    width: '100%',
    height: 3,
    backgroundColor: '#355624',
    borderRadius: 8,
  },
  hide: {
    width: '100%',
    height: 3,
    opacity: 0,
  },
});
