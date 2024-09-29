export const validateName = (value: string) => {
  if (!value) {
    return "Dieses Feld ist erforderlich";
  }

  if (!/^[a-zA-ZäöüÄÖÜß\s]*$/.test(value)) {
    return "Dieses Feld darf nur Buchstaben und Leerzeichen enthalten";
  }

  return undefined;
};

export const validateSurname = (value: string) => {
  return validateName(value);
};

export const validateEmail = (value: string) => {
  if (!value) {
    return "Dieses Feld ist erforderlich";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein";
  }

  return undefined;
};

export const validateMessage = (value: string) => {
  if (!value) {
    return "Dieses Feld ist erforderlich";
  }

  if (value.length < 10) {
    return "Die Nachricht muss mindestens 10 Zeichen lang sein";
  }

  return undefined;
};

export const validatePayment = (value: string) => {
  if (!value) {
    return "Dieses Feld ist erforderlich";
  }

  return undefined;
};
