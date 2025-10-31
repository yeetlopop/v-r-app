import React, { useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_KEY = 'ef5a309f04b099377f04d1613dceb276'; // API nøkkelen for værdata

type WeatherState = { name: string; temp: number; description: string } | null; // Typen for værdata

export default function App() {
  const [city, setCity] = useState(''); // Hva brukeren skriver inn
  const [weather, setWeather] = useState<WeatherState>(null); // Lagret værdata
  const [background, setBackground] = useState(require('../../assets/images/default.jpg')); // Bakgrunnsbilde
  const [loading, setLoading] = useState(false); // Viser spinner når vi henter data

  const getWeather = async () => {
    if (!city.trim()) { // Sjekker om input er tom
      Alert.alert('Feil', 'Skriv inn et bynavn.');
      return;
    }

    setLoading(true); // Starter loading animasjon
    try {
      // Henter værdata fra API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json(); // Gjør om JSON til objekt

      if (data.cod === 200) { // 200 betyr OK (fant byen)
        setWeather({
          name: data.name, // Bynavn
          temp: Math.round(data.main.temp), // Temperatur (avrundet)
          description: data.weather[0].main, // Skyer/sol/regn osv.
        });

        // Bestem bakgrunn fra værtype
        const weatherType: string = String(data.weather?.[0]?.main || '').toLowerCase(); // Gjør tekst liten
        const backgrounds: Record<string, any> = {
          clouds: require('../../assets/images/clouds.jpg'),
          rain: require('../../assets/images/regn.jpg'),
          snow: require('../../assets/images/winter.jpg'),
          clear: require('../../assets/images/sun.jpg'),
        };

        setBackground(backgrounds[weatherType] || require('../../assets/images/default.jpg')); // Velger bilde
      } else {
        Alert.alert('Feil', data.message || 'Kunne ikke finne været for denne byen.'); // Feil fra API
      }
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente værdata.'); // Nettverksfeil
    } finally {
      setLoading(false); // Stopper spinner uansett
      Keyboard.dismiss(); // Lukker tastatur
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}> {/* Bakgrunnsbilde */}
      <View style={styles.container}>
        {weather ? ( // Hvis vi har værdata →
          <>
            <Text style={styles.city}>{weather.name}</Text> {/* Viser bynavn */}
            <Text style={styles.description}>{weather.description}</Text> {/* Værtype */}
            <Text style={[styles.temp, { color: weather.temp < 0 ? 'red' : 'white' }]}>
              {weather.temp}°C {/* Temperatur */}
            </Text>
          </>
        ) : (
          <Text style={styles.placeholder}>Søk etter en by for å se været</Text> // Før man har søkt
        )}

        <View style={styles.inputContainer}> {/* Input + søk knapp */}
          <TextInput
            style={styles.input}
            placeholder="Skriv by (f.eks. Oslo)"
            placeholderTextColor="#ccc"
            value={city}
            onChangeText={setCity} // Oppdaterer city
            onSubmitEditing={getWeather} // Enter = søk
            editable={!loading} // Sperrer felt når vi laster
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={getWeather}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" /> // Viser spinner når vi henter data
            ) : (
              <Text style={styles.buttonText}>Søk</Text> // Knapp
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' }, // Fullscreen bakgrunn
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)', // Mørk gjennomsiktighet på midten
    padding: 20,
  },
  city: { fontSize: 40, color: 'white', fontWeight: 'bold' }, // Bynavn
  description: { fontSize: 22, color: 'white', marginBottom: 5, textTransform: 'capitalize' },
  temp: { fontSize: 60, fontWeight: 'bold', marginBottom: 20 }, // Stor temperatur
  placeholder: { color: '#ddd', marginBottom: 20 }, // Før man søker
  inputContainer: {
    flexDirection: 'row', // Input + knapp side ved side
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 8,
    width: '100%',
  },
  input: { flex: 1, color: 'white', fontSize: 18, paddingHorizontal: 8 }, // Tekstfelt
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }, // Tekst på knappen
  buttonDisabled: { opacity: 0.7 }, // Når den er disabled
});





// -------------------------------------------------------------
// NOTE – Hvordan API og JSON fungerer i denne appen
// -------------------------------------------------------------
//
// API:
// En API er en tjeneste vi kan hente data fra via internett.
// I denne appen brukes "OpenWeather API" til å få værinformasjon
// basert på bynavnet brukeren skriver inn.
//
// Når vi skriver:
// fetch(`https://api.openweathermap.org/data/2.5/weather?...`)
//
// Da spør vii API-et: Hva er vræet i denne byen?
//
// API-et svarer med JSONdata.
//
// JSON:
// JSON er et strukturert dataformat som API-er bruker til å
// sende informasjon tilbake. Det ligner på et JavaScript-objekt.
//
// I koden:
// const data = await response.json();
//
// Gjør JSON om til et objekt vi kan bruke i appen, f.eks.:
// data.name  Bynavn
// data.main.temp Temperatur
// data.weather[0].main → Værtype (sol/sky/regn)
//
// Appen viser så dataen på skjermen og endrer bakgrunnsbilde
// basert på værtypen.
// følte jeg trengte å forklare dette her fordi jeg merket istad at jeg ikke husket så mye.
// -------------------------------------------------------------
