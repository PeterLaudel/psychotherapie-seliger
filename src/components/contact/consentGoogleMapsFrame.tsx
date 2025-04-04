"use client";

import { useState } from "react";

export function ConsentGoogleMapsFrame() {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsent = () => {
    setConsentGiven(true);
  };
  return (
    <>
      {!consentGiven && (
        <div
          onClick={handleConsent}
          className="w-full h-64 flex flex-col bg-cover justify-center items-center p-4 bg-[url('/placeHolder.png')] from-neutral-500"
        >
          <p style={{ marginBottom: "1rem" }}>
            Mit Klick auf die Karte akzeptieren Sie die Datenschutzerklärung von
            Google.
          </p>
        </div>
      )}
      {consentGiven && (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19938.110177165818!2d12.322077279101553!3d51.343060099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2f6adde980e3097d%3A0xc7bbc36db54d6411!2sUte%20Seliger%2C%20M.Sc.%20-%20Psych.%20%7C%20Praxis%20f%C3%BCr%20Psychotherapie%20-%20Seliger%20%7C!5e0!3m2!1sde!2sde!4v1726413366495!5m2!1sde!2sde"
          width="0"
          height="0"
          loading="lazy"
          className="w-full h-64"
        ></iframe>
      )}
    </>
  );
}
