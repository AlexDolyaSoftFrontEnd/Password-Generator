import { useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./PasswordGenerator.module.css";

/* ===============================
   Utils
=============================== */
const generatePassword = ({ length, numbers, symbols, uppercase }) => {
  let chars = "abcdefghijklmnopqrstuvwxyz";

  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}<>?";

  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [uppercase, setUppercase] = useState(true);

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(
      generatePassword({ length, numbers, symbols, uppercase })
    );
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  };

  return (
    <>
      <Helmet>
        <title>Password Generator</title>
        <meta
          name="description"
          content="Secure password generator."
        />
      </Helmet>

      {copied && (
        <div
          className={styles.toast}
          role="status"
          aria-live="polite"
        >
          Скопійовано
        </div>
      )}

      <section
        className={styles.cover}
        aria-labelledby="password-generator-title"
      >
        <article className={styles.card}>
          {/* Header */}
          <header>
            <h1
              id="password-generator-title"
              className={styles.title}
            >
              Password Generator
            </h1>
            <p className={styles.subtitle}>
              Secure password generator
            </p>
          </header>

          {/* Controls */}
          <form
            className={styles.controls}
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
          >
            {/* Length */}
            <label
              htmlFor="password-length"
              className={styles.rangeLabel}
            >
              Довжина пароля: <strong>{length}</strong>
            </label>

            <input
              id="password-length"
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />

            {/* Options */}
            <fieldset className={styles.toggles}>
              <legend className={styles.legend}>
                Налаштування
              </legend>

              <label htmlFor="uppercase">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={uppercase}
                  onChange={() => setUppercase((v) => !v)}
                />
                Великі літери
              </label>

              <label htmlFor="numbers">
                <input
                  id="numbers"
                  type="checkbox"
                  checked={numbers}
                  onChange={() => setNumbers((v) => !v)}
                />
                Цифри
              </label>

              <label htmlFor="symbols">
                <input
                  id="symbols"
                  type="checkbox"
                  checked={symbols}
                  onChange={() => setSymbols((v) => !v)}
                />
                Символи
              </label>
            </fieldset>

            {/* Action */}
            <button
              type="submit"
              className={styles.generate}
            >
              Згенерувати пароль
            </button>
          </form>

          {/* Result */}
          {password && (
            <output
              className={styles.resultWrap}
              role="button"
              tabIndex={0}
              aria-label="Натисніть, щоб скопіювати пароль"
              aria-live="polite"
              onClick={handleCopy}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCopy();
                }
              }}
            >
              <pre>{password}</pre>
            </output>
          )}
        </article>
      </section>
    </>
  );
}

