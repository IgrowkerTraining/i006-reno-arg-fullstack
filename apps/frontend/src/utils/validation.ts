export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Formato de email no válido';
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validateMinLength = (value: string, min: number): string | null => {
  if (value.length < min) {
    return `Debe tener al menos ${min} caracteres`;
  }
  return null;
};

export const validateRegistration = (data: {
  name: string;
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateRequired(data.email, 'Email') || validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validateRequired(data.password, 'Password') || 
                       validateMinLength(data.password, 6);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogin = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const emailError = validateRequired(data.email, 'Email') || validateEmail(data.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
