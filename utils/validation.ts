export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase().replace(/[^\w@.-]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('El correo electrónico no es válido');
  }
  if (email.length > 255) {
    throw new ValidationError('El correo electrónico es demasiado largo');
  }
  return true;
};

export const validatePin = (pin: string): boolean => {
  if (!/^\d{4}$/.test(pin)) {
    throw new ValidationError('El PIN debe tener exactamente 4 dígitos numéricos');
  }
  return true;
};

export const validateRequired = (value: string, fieldName: string): boolean => {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} es requerido`);
  }
  return true;
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): boolean => {
  const length = value.trim().length;
  if (length < min) {
    throw new ValidationError(`${fieldName} debe tener al menos ${min} caracteres`);
  }
  if (length > max) {
    throw new ValidationError(`${fieldName} no puede tener más de ${max} caracteres`);
  }
  return true;
};

export const validateDate = (date: string | Date, fieldName: string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`${fieldName} no es una fecha válida`);
  }
  return true;
};

export const validateDateRange = (
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (end <= start) {
    throw new ValidationError('La fecha de fin debe ser posterior a la fecha de inicio');
  }
  return true;
};

export const sanitizeEventInput = (input: any): any => {
  return {
    ...input,
    titulo: input.titulo ? sanitizeString(input.titulo) : '',
    curso: input.curso ? sanitizeString(input.curso) : undefined,
    aula: input.aula ? sanitizeString(input.aula) : undefined,
    docente: input.docente ? sanitizeString(input.docente) : undefined,
    notas: input.notas ? sanitizeString(input.notas) : undefined,
  };
};

export const validateEventInput = (input: any): void => {
  validateRequired(input.titulo, 'Título');
  validateLength(input.titulo, 1, 100, 'Título');
  
  if (input.curso) {
    validateLength(input.curso, 1, 50, 'Tipo de evento');
  }
  
  if (input.aula) {
    validateLength(input.aula, 1, 50, 'Lugar');
  }
  
  if (input.docente) {
    validateLength(input.docente, 1, 50, 'Organizador');
  }
  
  validateDate(input.fechaInicio, 'Fecha de inicio');
  validateDate(input.fechaFin, 'Fecha de fin');
  validateDateRange(input.fechaInicio, input.fechaFin);
  
  if (input.esRecurrente && !input.fechaFinRecurrencia) {
    throw new ValidationError('Debes especificar hasta cuándo se repetirá el evento');
  }
  
  if (input.esRecurrente && input.fechaFinRecurrencia) {
    validateDateRange(input.fechaInicio, input.fechaFinRecurrencia);
  }
};
