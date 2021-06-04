import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, useMapEvents } from 'react-leaflet'

const ipify_key = process.env.REACT_APP_API_KEY_IPIFY

export default function App() {
  let country_flag_image_url = "https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Esperanto.svg"
  const [translations, setTranslations] = useState()
  const [userCountry, setUserCountry] = useState()
  const [locationKnown, setLocationKnown] = useState(false)
  const [userIP, setUserIP] = useState("NOT DETECTED")
  const [userLocation, setUserLocation] = useState(
    {
      lat: 51.509865,
      lng: -0.118092
    })



  useEffect(() => {
    //call axios to get ipify result and set userIP to the IP (see postman)
    //GET https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY_IPIFY}

    //TODO:IMPORTANT comment out next line before pushing to github
    console.log('executing axios GET at url=' + `https://get.geojs.io/v1/ip/geo.json`);

    axios
      .get('https://get.geojs.io/v1/ip/geo.json') //fetch request being executed
      .then((res) => {
        //after fetch request is completed... 
        //do something with response <res> from axios 
        console.log({ geo_response: res }) //log it first always!!
        //to show the ip:
        console.log('ipify response ip=' + res.data.ip);
        //lat/lon for
        setUserLocation({ lat: res.data.latitude, lng: res.data.longitude })
        setLocationKnown(true)
        //set the userIP variable to <ip> from axios <res.data>
        setUserIP(res.data.ip);
        axios
          .get(`https://restcountries.eu/rest/v2/alpha/${res.data.country_code}`)
          .then((res_2) => {
            console.log({ country_response: res_2 })
            console.log("translations", res_2.data.translations)
            setUserCountry(res_2.data)
            const translations = Object.values(res_2.data.translations)
            const result = translations.map((translation) => {
              return (
                <li>{translation}</li>
              )
            })
            setTranslations(result)
          })
      })
  }, [userIP])


  // function MyComponent() {
  //   const map = useMap()

  //   return null
  // }

  // function MyMapComponent() {
  //   return (
  //     <MapContainer center={[50.5, 30.5]} zoom={13}>
  //       <MyComponent />
  //     </MapContainer>
  //   )
  // }
  // let translations = []
  // let i=0
  // for (const [key, value] of Object.entries(userCountry.translations)) {
  //   i++
  //   console.log(`${key}: ${value}`)
  //   translations[i] = value
  // }
  //   "translations": {
  //     "de": "Vereinigte Staaten von Amerika",
  //     "es": "Estados Unidos",
  //     "fr": "États-Unis",
  //     "ja": "アメリカ合衆国",
  //     "it": "Stati Uniti D'America",
  //     "br": "Estados Unidos",
  //     "pt": "Estados Unidos",
  //     "nl": "Verenigde Staten",
  //     "hr": "Sjedinjene Američke Države",
  //     "fa": "ایالات متحده آمریکا"
  // }

  // const translations = ["de", "es", "fr", "ja", "it", "br", "pt", "nl", "hr", "fa"]
  // translations.map(key => {
  //   return myObject[key]
  // })
  // console.log(Object.keys(userCountry.translations))
  // console.log({translations: Object.values(userCountry.translations)})
  // const translations = ["Vereinigte Staaten von Amerika", "Estados Unidos", ...]


  if (locationKnown && userCountry) {

    return (
      <>
        <div>Your IP: {userIP} </div>
        <img className="country_flag" src={userCountry.flag}></img>
        <ul className="country_translations">{translations}</ul>
        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>

      </>
    )
  }

  return (
    <>
      <div>Your IP: {userIP} </div>
      <img className="country_flag" src={country_flag_image_url}></img>
    </>
  )


}


