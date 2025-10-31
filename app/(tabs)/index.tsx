import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { Alert, Button, Clipboard, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState(""); // lagrer det genererte passordet
  const [includeSpecial, setIncludeSpecial] = useState(false); // om spesialtegn skal være med
  const [includeNumbers, setIncludeNumbers] = useState(true); // om tall skal være med
  const [includeUppercase, setIncludeUppercase] = useState(true); // om store bokstaver skal være med
  const [passwordLength, setPasswordLength] = useState(12); // ønsket lengde på passord
  const [minSpecial, setMinSpecial] = useState(1); // hvor mange spesialtegn minst

  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/"; // tegnsett for spesialtegn
  const numbers = "0123456789"; // tegnsett for tall
  const lowercase = "abcdefghijklmnopqrstuvwxyz"; // tegnsett for små bokstaver
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // tegnsett for store bokstaver

  // Kopierer passord til utklippstavle
  const copyToClipboard = async () => {
    if (password) {
      await Clipboard.setString(password);
      Alert.alert("Kopiert!", "Passordet er kopiert til utklippstavlen");
    }
  };

  // Genererer et nytt passord basert på valgene
  const generatePassword = (): string => {
    let chars = lowercase; // starter alltid med små bokstaver
    if (includeUppercase) chars += uppercase; // legg til store bokstaver
    if (includeNumbers) chars += numbers; // legg til tall
    if (includeSpecial) chars += specialChars; // legg til spesialtegn

    let newPassword = ""; // her bygges passordet
    let specialCount = 0;
    let numberCount = 0;
    let upperCount = 0;

    // lager passord ved å trekke tilfeldige tegn fra "chars"
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      const char = chars[randomIndex];
      
      // teller hvor mange av hver type tegn vi får
      if (specialChars.includes(char)) specialCount++;
      if (numbers.includes(char)) numberCount++;
      if (uppercase.includes(char)) upperCount++;
      
      newPassword += char;
    }

    // sjekker at kravene er oppfylt
    const isValid = (!includeSpecial || specialCount >= minSpecial) &&
                   (!includeNumbers || numberCount > 0) &&
                   (!includeUppercase || upperCount > 0);

    // hvis passordet ikke møter krav → prøv igjen
    return isValid ? newPassword : generatePassword();
  };

  // Kalles når man trykker på "Generer nytt passord"
  const handleGenerate = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Joakims Passordgenerator</Text>

      {/* Valg for passord */}
      <View style={styles.optionsContainer}>
        <View style={styles.row}>
          <Text>Passordlengde:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={passwordLength.toString()}
            onChangeText={(text) => setPasswordLength(Number(text) || 12)}
          />
        </View>

        <View style={styles.row}>
          <Text>Store bokstaver</Text>
          <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
        </View>

        <View style={styles.row}>
          <Text>Tall</Text>
          <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
        </View>

        <View style={styles.row}>
          <Text>Spesialtegn</Text>
          <Switch value={includeSpecial} onValueChange={setIncludeSpecial} />
        </View>

        {/* Ekstra felt hvis spesialtegn er valgt */}
        {includeSpecial && (
          <View style={styles.row}>
            <Text>Minimum spesialtegn:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={minSpecial.toString()}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (text === '') {
                  setMinSpecial(0);
                } else if (!isNaN(num) && num >= 0 && num <= passwordLength) {
                  setMinSpecial(num);
                }
              }}
              maxLength={2} // maks 2 siffer
            />
          </View>
        )}
      </View>

      {/* Generer-knapp */}
      <Button
        title="Generer nytt passord"
        onPress={handleGenerate}
        color="#585858ff"
      />

      {/* Viser passordet etter generering */}
      {password ? (
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Ditt genererte passord:</Text>
          <View style={styles.passwordRow}>
            <Text style={styles.password}>{password}</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  optionsContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 50,
    marginLeft: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  password: {
    fontSize: 18,
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#589799ff',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});

export default PasswordGenerator;

// -------------------------------------------------------------
// NOTE – Hvordan passordgeneratoren fungerer
// -------------------------------------------------------------
//
// 1. Brukeren velger innstillinger (lengde, tall, store bokstaver, spesialtegn).
// 2. Når du trykker på "Generer nytt passord", kjører funksjonen generatePassword().
// 3. Den lager et tegnsett (chars) basert på valgene dine.
// 4. Et tilfeldig tegn hentes fra dette tegnsettet for hver plass i passordet.
// 5. Funksjonen teller hvor mange tall, store bokstaver og spesialtegn som brukes.
// 6. Hvis passordet ikke møter kravene (f.eks. for få spesialtegn), starter den på nytt.
// 7. Det ferdige passordet vises på skjermen, og du kan trykke på kopier-ikonet
//     for å legge det i utklippstavlen.
//
// Passordet blir generert tilfeldig hver gang, så det er alltid unikt.
// `Math.random()` brukes for å hente et tilfeldig tegn fra tegnsettet.
// Koden sørger for at passordet alltid møter kravene før det vises.
//
// -------------------------------------------------------------
