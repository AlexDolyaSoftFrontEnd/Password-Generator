import { useCallback, useEffect, useState } from "react";
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

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // loader states
  const [loading, setLoading] = useState(false);       // генерация
  const [pageLoading, setPageLoading] = useState(true); // initial load

  /* ===============================
     Initial Page Loader
  =============================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPassword(
        generatePassword({
          length: 16,
          numbers: true,
          symbols: false,
          uppercase: true,
        })
      );
      setPageLoading(false);
    }, 800); // задержка загрузки страницы

    return () => clearTimeout(timer);
  }, []);

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

      setLoading(true);

      setTimeout(() => {
        setPassword(generatePassword(options));
        setLoading(false);
      }, 300);
    },
    [length, numbers, symbols, uppercase]
  );

  const copyToClipboard = async () => {
    if (!password || loading || pageLoading) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  /* ===============================
     Page Loader Render
  =============================== */

  if (pageLoading) {
    return (
      <div className={styles.pageLoader} aria-busy="true">
        <div className={styles.loader} />
        <span className={styles.pageLoaderText}>
          Загрузка генератора…
        </span>
      </div>
    );
  }

  /* ===============================
     Render
  =============================== */

  return (
    <>
      <Helmet>
        <title>Генератор пароля</title>
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
          <header>
            <h1 className={styles.cover__title}>Генератор пароля</h1>
          </header>

          <form
            className={styles.controls}
            onSubmit={(e) => {
              e.preventDefault();
              regenerate();
            }}
          >
            <label className={styles.rangeLabel}>
              <span>
                Длина пароля: <strong>{length}</strong>
              </span>
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

            <fieldset className={styles.toggles}>
              <legend className={styles.legend}>Настройки:</legend>

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

            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? "Генерация..." : "Новый пароль"}
            </button>
          </form>

          <div className={styles.result}>
            {loading ? (
              <div className={styles.loader} />
            ) : (
              <pre>{password}</pre>
            )}

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={copyToClipboard}
              disabled={loading}
            >
              Скопировать
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
