function Hero({ text, language, setLanguage }) {
  return (
    <div className="hero">
      <div className="language-switch">
        <button
          onClick={() =>
            setLanguage(language === "en" ? "ta" : "en")
          }
        >
          {language === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <div className="hero-content">
        <h1>{text.homeTitle}</h1>
        <p>{text.homeSubtitle}</p>
      </div>
    </div>
  )
}

export default Hero