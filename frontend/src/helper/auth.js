export function getRole() {
  return localStorage.getItem('role');
}

export function isAdmin() {
  return getRole() === 'admin' && !!localStorage.getItem('authToken');
}


