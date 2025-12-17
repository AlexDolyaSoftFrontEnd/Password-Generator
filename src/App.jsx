import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./PasswordGenerator.module.css";

/* ===============================
   Utils
=============================== */

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}<>?",
};

function getRandomChar(chars) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

function generatePassword({ length, numbers, symbols, uppercase }) {
  let chars = CHARSETS.lowercase;

  if (uppercase) chars += CHARSETS.uppercase;
  if (numbers) chars += CHARSETS.numbers;
  if (symbols) chars += CHARSETS.symbols;

  return Array.from({ length }, () => getRandomChar(chars)).join("");
}

/* ===============================
   Component
=============================== */

export default function PasswordGenerator() {
  /* ===============================
     State
  =============================== */

  const [length, setLength] = useState(16);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [uppercase, setUppercase] = useState(true);

  const [password, setPassword] = useState(() =>
    generatePassword({
      length: 16,
      numbers: true,
      symbols: false,
      uppercase: true,
    })
  );

  const [copied, setCopied] = useState(false);

  /* ===============================
     Handlers
  =============================== */

  const regenerate = useCallback(
    (next = {}) => {
      const options = {
        length,
        numbers,
        symbols,
        uppercase,
        ...next,
      };

      setPassword(generatePassword(options));
    },
    [length, numbers, symbols, uppercase]
  );

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  /* ===============================
     Render
  =============================== */

  return (
    <>
      <Helmet>
        <title>Password Generator</title>
        <meta
          name="description"
          content="Secure password generator with customizable options."
        />
      </Helmet>

      {copied && (
        <div className={styles.toast} role="alert">
          <span className={styles.toast__title}>Пароль скопирован</span>
        </div>
      )}

      <section className={styles.cover}>
        <article className={styles.card}>
          {/* Header */}
          <header>
            <h1 className={styles.cover__title}>Password Generator</h1>
          </header>

          {/* Controls */}
          <form
            className={styles.controls}
            onSubmit={(e) => {
              e.preventDefault();
              regenerate();
            }}
          >
            {/* Length */}
            <label className={styles.rangeLabel}>
              <span>Длина пароля: <strong>{length}</strong></span>
            </label>

            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => {
                const value = Number(e.target.value);
                setLength(value);
                regenerate({ length: value });
              }}
            />

            {/* Options */}
            <fieldset className={styles.toggles}>
              <legend className={styles.legend}>
                Настройки:
              </legend>

              <label>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={() => {
                    setUppercase((v) => !v);
                    regenerate({ uppercase: !uppercase });
                  }}
                />
                Заглавные буквы
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={numbers}
                  onChange={() => {
                    setNumbers((v) => !v);
                    regenerate({ numbers: !numbers });
                  }}
                />
                Цифры
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={symbols}
                  onChange={() => {
                    setSymbols((v) => !v);
                    regenerate({ symbols: !symbols });
                  }}
                />
                Спецсимволы
              </label>
            </fieldset>

            {/* Generate */}
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
            Новый пароль
            </button>
          </form>

          {/* Result */}
          <div className={styles.result}>
            <pre>{password}</pre>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={copyToClipboard}
            >
              Скопировать
            </button>
          </div>
        </article>
      </section>
    </>
  );
}

