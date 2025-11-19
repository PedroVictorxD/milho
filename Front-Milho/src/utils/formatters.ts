/**
 * Formata um valor numérico para CNPJ (00.000.000/0000-00)
 */
export const formatCNPJ = (value: string): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, '');

  // Limita a 14 dígitos
  const limited = numericValue.slice(0, 14);

  // Aplica a máscara progressivamente
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return limited.replace(/(\d{2})(\d{0,3})/, '$1.$2');
  } else if (limited.length <= 8) {
    return limited.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (limited.length <= 12) {
    return limited.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
  } else {
    return limited.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  }
};

/**
 * Remove a formatação do CNPJ, retornando apenas os dígitos
 */
export const unformatCNPJ = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida se um CNPJ é válido
 */
export const validateCNPJ = (cnpj: string): boolean => {
  const numericCNPJ = unformatCNPJ(cnpj);

  if (numericCNPJ.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numericCNPJ)) {
    return false;
  }

  // Valida primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numericCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numericCNPJ.charAt(12))) {
    return false;
  }

  // Valida segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numericCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numericCNPJ.charAt(13))) {
    return false;
  }

  return true;
};

/**
 * Formata um valor numérico para telefone brasileiro
 * Suporta formatos: (00) 0000-0000 ou (00) 00000-0000
 */
export const formatPhone = (value: string): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, '');

  // Limita a 11 dígitos
  const limited = numericValue.slice(0, 11);

  // Aplica a máscara progressivamente
  if (limited.length <= 2) {
    return limited.length > 0 ? `(${limited}` : limited;
  } else if (limited.length <= 6) {
    return limited.replace(/(\d{2})(\d{0,4})/, '($1) $2');
  } else if (limited.length <= 10) {
    // Formato (00) 0000-0000
    return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    // Formato (00) 00000-0000
    return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
};

/**
 * Remove a formatação do telefone, retornando apenas os dígitos
 */
export const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida se um telefone brasileiro é válido
 */
export const validatePhone = (phone: string): boolean => {
  const numericPhone = unformatPhone(phone);

  // Telefone fixo: 10 dígitos, Celular: 11 dígitos
  if (numericPhone.length !== 10 && numericPhone.length !== 11) {
    return false;
  }

  // Verifica se o DDD é válido (entre 11 e 99)
  const ddd = parseInt(numericPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Se for celular (11 dígitos), o primeiro dígito após o DDD deve ser 9
  if (numericPhone.length === 11 && numericPhone.charAt(2) !== '9') {
    return false;
  }

  return true;
};

/**
 * Formata uma placa de veículo (ABC-1234 ou ABC1D234 - Mercosul)
 */
export const formatPlate = (value: string): string => {
  // Remove caracteres especiais, mantém letras e números
  const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Limita a 7 caracteres
  const limited = cleanValue.slice(0, 7);

  // Aplica a máscara
  if (limited.length <= 3) {
    return limited;
  } else {
    return limited.replace(/([A-Z]{3})([A-Z0-9]{0,4})/, '$1-$2');
  }
};

/**
 * Remove a formatação da placa
 */
export const unformatPlate = (value: string): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Valida se uma placa de veículo é válida (formato antigo ou Mercosul)
 */
export const validatePlate = (plate: string): boolean => {
  const cleanPlate = unformatPlate(plate);

  if (cleanPlate.length !== 7) {
    return false;
  }

  // Formato antigo: ABC1234 (3 letras + 4 números)
  const oldFormat = /^[A-Z]{3}[0-9]{4}$/;

  // Formato Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
  const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

  return oldFormat.test(cleanPlate) || mercosulFormat.test(cleanPlate);
};
