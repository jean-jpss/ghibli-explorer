export const NOT_INFORMED = 'Não informado';

export function formatText(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return NOT_INFORMED;
  }
  return value;
}

export function formatDuration(minutes) {
  if (!minutes) {
    return NOT_INFORMED;
  }
  return `${minutes} minutos`;
}

export function formatScore(score) {
  if (!score) {
    return NOT_INFORMED;
  }
  return `${score}%`;
}
