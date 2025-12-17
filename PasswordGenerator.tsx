import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as Random from "expo-random";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

/* ===============================
   Utils
=============================== */

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}<>?",
};

async function getRandomChar(chars: string) {
  const random = await Random.getRandomBytesAsync(1);
  return chars[random[0] % chars.length];
}

async function generatePassword(options: {
  length: number;
  numbers: boolean;
  symbols: boolean;
  uppercase: boolean;
}) {
  let chars = CHARSETS.lowercase;

  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;

  const result: string[] = [];

  for (let i = 0; i < options.length; i++) {
    result.push(await getRandomChar(chars));
  }

  return result.join("");
}

/* ===============================
   Component
=============================== */

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [uppercase, setUppercase] = useState(true);

  const [password, setPassword] = useState("");

  const regenerate = useCallback(async () => {
    const value = await generatePassword({
      length,
      numbers,
      symbols,
      uppercase,
    });

    setPassword(value);
  }, [length, numbers, symbols, uppercase]);

  useEffect(() => {
    regenerate();
  }, []);

  const copyToClipboard = async () => {
    if (!password) return;

    await Clipboard.setStringAsync(password);
    Alert.alert("Готово", "Пароль скопирован в буфер обмена");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Generator</Text>

      {/* Result */}
      <View style={styles.result}>
        <Text style={styles.password}>{password}</Text>
      </View>

      {/* Length */}
      <View style={styles.block}>
        <Text style={styles.label}>
          Длина пароля: <Text style={styles.bold}>{length}</Text>
        </Text>

        <Slider
          minimumValue={8}
          maximumValue={32}
          step={1}
          value={length}
          onValueChange={setLength}
          onSlidingComplete={regenerate}
        />
      </View>

      {/* Options */}
      <View style={styles.block}>
        <Option
          label="Заглавные буквы"
          value={uppercase}
          onChange={setUppercase}
        />
        <Option
          label="Цифры"
          value={numbers}
          onChange={setNumbers}
        />
        <Option
          label="Спецсимволы"
          value={symbols}
          onChange={setSymbols}
        />
      </View>

      {/* Actions */}
      <Pressable style={styles.primaryBtn} onPress={regenerate}>
        <Text style={styles.btnText}>Новый пароль</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={copyToClipboard}>
        <Text style={styles.btnText}>Скопировать</Text>
      </Pressable>
    </View>
  );
}

/* ===============================
   Option row
=============================== */

function Option({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/* ===============================
   Styles
=============================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
    color: "#1d1d1f",
  },
  result: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 24,
  },
  password: {
    fontSize: 18,
    fontFamily: "monospace",
    color: "#111827",
  },
  block: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#374151",
  },
  bold: {
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryBtn: {
    backgroundColor: "#e5e7eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
