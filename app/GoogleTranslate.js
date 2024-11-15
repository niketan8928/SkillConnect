// src/GoogleTranslate.js
"use client";
import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Check if the script is already added
    if (
      !document.querySelector(
        'script[src="https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate"]'
      )
    ) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Define the callback function
      window.loadGoogleTranslate = () => {
        window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_element_1"
        );
      };
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div id="google_element_1"></div>
    </div>
  );
};

export default GoogleTranslate;
