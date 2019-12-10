import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Dimensions, ProgressViewIOS, ProgressBarAndroid } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import { Toolbar, ThemeContext as TP, getTheme } from 'react-native-material-ui';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Callout}  from 'react-native-maps';

const systemFonts = (Platform.OS === 'android' ? 'Roboto' : 'Arial');

const MapData = ({navigation}) => {
	const [renderMap, setMapRender] = useState(false);
	const [phonePosition, setPhonePosition] = useState();
	const [value, setValue] = useState('');
	const [region, setRegion] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.015, longitudeDelta: 0.0121});
	const [markers, setMark] = useState([{
			id:"d96b7a82-162f-11ea-8d71-362b9e155667",
			num:'123',
			title: 'Test1',
			latlng: {
			  latitude: 0,
			  longitude: 0
			},
		  }]);

	const [load, setLoad] = useState(0.01);

	function loading() {
		var time = load;
		setLoad((time + 0.01) % 1);
	}
	var myVar = setTimeout(loading, 10);
	var {height, width} = Dimensions.get('window');
	const apikey = Platform.OS === 'android' ? Constants.manifest.android.config.googleMaps.apiKey : Constants.manifest.ios.config.googleMapsApiKey;

	useEffect(() => {
		getLongLat(); 
	}, []);
	
	const getLocation = async (address) => { 
		try{
			const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + apikey);
		    return await response.json();
		}catch (e) {
			console.log(e)
		}
	}

	const getPermissions = async () => {

        try {
            let {status} = await Permissions.askAsync(Permissions.LOCATION);
            if (status === 'granted') {
                try {
                    let locationdata = await Location.getCurrentPositionAsync({
						maximumAge: 60000, // only for Android
						accuracy: Platform.OS === 'android' ? Location.Accuracy.High : Location.Accuracy.High});
					return locationdata;
                } catch (error) {
                    console.log('Permission to turn on phone location was denied: ' + error.message);
                }
            } else {
                console.log('Permission to access location was denied' + error.message);
            }

        } catch (error) {
            console.log('There has been a problem with location: ' + error.message);
        }

    };
	
	async function getLongLat() {
		let phonelocation = await getPermissions();
		let phonelat = JSON.parse(phonelocation.coords.latitude);
		let phonelon = JSON.parse(phonelocation.coords.longitude);
		console.log(JSON.parse(phonelocation.coords.latitude));
		const res = await fetch('http://34.89.126.252/getHouses', {
			method: 'POST',
			body: JSON.stringify({
				lat: phonelat,
				lon: phonelon,
				radius: 500,
				limit: 100
			}),
			headers: {
				'Content-Type': 'application/json'
			},
		});
		
		const data = await res.json();
		console.log(JSON.stringify(data));
		console.log(data.length);
		
		let listOfMarks = [];
		var i;
		for(i = 0; i < data.length; i++) {
			const houselocation = await getLocation(data[i].paon + " " + data[i].street + " " + data[i].postcode);
			let lon = await parseFloat(JSON.stringify(houselocation.results[0].geometry.location.lng));
			let lat = await parseFloat(JSON.stringify(houselocation.results[0].geometry.location.lat));
			let obj = {
					id:data[i].id,
					num:data[i].paon,
					price:data[i].price,
					address:data[i].paon + " " + data[i].street + " " + data[i].postcode,
					type:data[i].initial,
					latlng: {
					  latitude:lat,
					  longitude:lon
					}
			}
			listOfMarks.push(obj);
		}
		console.log(JSON.stringify(listOfMarks));

		setRegion({latitude: phonelat, longitude: phonelon, latitudeDelta: 0.015, longitudeDelta: 0.0121});
		setPhonePosition({latitude: phonelat, longitude: phonelon});
		setMark(listOfMarks);
		setMapRender(true);
		clearTimeout(myVar);
	}

	return (
      <View style={styles.nav}>
		<TP.Provider value={getTheme(uiTheme)}>
			<Toolbar
				centerElement="ASE Project Group 2 | Map"
			/>
		</TP.Provider>
		{ renderMap ? <View><MapView
			provider={PROVIDER_GOOGLE}
			style={{height: height*0.7, width: width}}
			initialRegion={region}
		>
				 {markers.map(marker => (
					<React.Fragment key={""+marker.id+marker.num}>
					<Marker
					  
					  coordinate={marker.latlng}
					  image={marker.type === 'F' ? require('../assets/images/flat.png') : require('../assets/images/hgreen.png')}
					>
					<Callout>
						<View><Text>-House Info-</Text></View>
						<View><Text>----------</Text></View>
						<View><Text>Price: £{marker.price}</Text></View>
						<View><Text>----------</Text></View>
						<View><Text>Type: {marker.type === 'F' ? 'Flat' : marker.type === 'S' ? 'Semi-Detached' : marker.type === 'T' ? 'Terrace' : 'House'}</Text></View>
						<View><Text>----------</Text></View>
						<View><Text>{marker.address}</Text></View>
						<View><Text>----------</Text></View>
					</Callout>
					</Marker>
				  </React.Fragment>
				  ))}

				  <Circle 
					  center={phonePosition}
					  radius={500}
				  />
			</MapView>
			<View style={styles.button}>
			<ThemeProvider theme={buttontheme}>
				<Button
				  title="Refresh Position"
				  onPress={()=>{{getLongLat()}}}
				/>
			</ThemeProvider>
		</View></View> : Platform.OS === 'android' ? <><Text style={{textAlign: 'center'}}>Loading map...</Text><ProgressBarAndroid styleAttr="Horizontal" progress={load} color="#0080ff"/></> : <><Text style={{textAlign: 'center'}}>Loading map...</Text><ProgressViewIOS progress={load} /></>
			}
      </View>
    );
}

export default MapData;

const uiTheme = {
    palette: {
        primaryColor: '#002366',
    },
    toolbar: {
        container: {
            height: 60,
        },
    },
	fontFamily: systemFonts 
};

const buttontheme = {
  Button: {
    raised: true,
	titleStyle: {
		color: 'white',
		fontFamily: systemFonts,
	},
  }
}
const styles = StyleSheet.create({
	
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	  alignItems: 'center',
	  justifyContent: 'center',
	  fontFamily: systemFonts,
	}, 
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
	button: {
	 margin: 20,
	 fontFamily: systemFonts,
	},
  });