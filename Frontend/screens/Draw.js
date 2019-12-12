import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Platform, SafeAreaView, ScrollView, ViewPropTypes } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import Constants from 'expo-constants';
import { Toolbar, ThemeContext as TP, COLOR, getTheme } from 'react-native-material-ui';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const systemFonts = (Platform.OS === 'android' ? 'Roboto' : 'Farah');

const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
	fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Farah'
};

const Draw = ({navigation}) => {
	
	const [isFontLoaded, setFonts] = useState(true);
	
	
	if(isFontLoaded) {
		return ( 
		
			<>
				<View style={styles.nav}>
					<TP.Provider value={getTheme(uiTheme)}>
						<Text>Hello World!</Text>
					</TP.Provider>
				</View>
			</>
		)
		
	} else {
		return ( 
			<View><Text style={{fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Farah'}}>Hello World</Text></View>
		)
		
	}

	
	/*<View style={styles.button}>
						<Text style={{fontFamily:'System'}}>
					<ThemeProvider theme={theme}>
						<Button
							title="Go To Map"
							onPress={()=>{{navigation.navigate('Map')}}}
						/>
					</ThemeProvider>
					</Text>
				</View>*/
}

Draw.navigationOptions = {
	header: null,
	
};

const theme = {
  Button: {
    raised: true,
	titleStyle: {
		color: 'white',
		fontFamily: systemFonts,
	},
	fontFamily: systemFonts,
  },
  fontFamily: systemFonts,
};

const styles = StyleSheet.create({
	
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
	fontFamily: systemFonts,
  }, 
 /* tool: {
	  leftElement: {
		fontFamily: systemFonts,  
	  }
  },*/
  title: {
    marginTop: Constants.statusBarHeight + 20,
    fontSize: 18,
	textAlign: 'center',
	fontFamily: systemFonts,
  },
  nav: {
    marginTop: Constants.statusBarHeight,
	fontFamily: systemFonts,
  },
  paragraph: {
    margin: 24,
    fontSize: 14,
	textAlign: 'center',
	fontFamily: systemFonts,
  },
  map: {
   height: 200,
   width: 360,
  },
  button: {
   margin: 30,
   fontFamily: systemFonts,
  },
});

export default Draw;