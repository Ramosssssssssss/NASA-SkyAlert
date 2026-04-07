type TranslationKeys = {
  login: {
    title: string;
    subtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    button: string;
    rememberMe: string;
    footer: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMin: string;
    invalidCredentials: string;
  };
  home: {
    title: string;
    subtitle: string;
    loading: string;
    errorTitle: string;
    retry: string;
    today: string;
    tabHome: string;
    tabProfile: string;
  };
  profile: {
    title: string;
    subtitle: string;
    userSection: string;
    email: string;
    name: string;
    settings: string;
    darkMode: string;
    language: string;
    spanish: string;
    english: string;
    logout: string;
    userName: string;
    version: string;
  };
  history: {
    title: string;
    close: string;
    empty: string;
    consultedAt: string;
    response: string;
    clear: string;
  };
};

const es: TranslationKeys = {
  login: {
    title: 'Iniciar sesion',
    subtitle: 'Ingresa tus credenciales para continuar',
    email: 'Correo',
    emailPlaceholder: 'tu@correo.com',
    password: 'Contrasena',
    passwordPlaceholder: 'Minimo 6 caracteres',
    button: 'Iniciar sesion',
    rememberMe: 'Recordar cuenta',
    footer: 'By Diego R.',
    emailRequired: 'El correo es obligatorio',
    emailInvalid: 'Formato de correo no valido',
    passwordRequired: 'La contrasena es obligatoria',
    passwordMin: 'Minimo 6 caracteres',
    invalidCredentials: 'Credenciales incorrectas',
  },
  home: {
    title: 'Foto del dia',
    subtitle: 'NASA APOD',
    loading: 'Cargando...',
    errorTitle: 'Algo salio mal',
    retry: 'Reintentar',
    today: 'Hoy',
    tabHome: 'Inicio',
    tabProfile: 'Perfil',
  },
  profile: {
    title: 'Perfil',
    subtitle: 'Administra tu cuenta',
    userSection: 'Cuenta',
    email: 'Correo',
    name: 'Nombre',
    settings: 'Ajustes',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    spanish: 'ES',
    english: 'EN',
    logout: 'Cerrar sesion',
    userName: 'Usuario NASA',
    version: 'v1.0.0',
  },
  history: {
    title: 'Historial',
    close: 'Cerrar',
    empty: 'Sin consultas aun',
    consultedAt: 'Consultado',
    response: 'Respuesta',
    clear: 'Limpiar',
  },
};

const en: TranslationKeys = {
  login: {
    title: 'Sign in',
    subtitle: 'Enter your credentials to continue',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    button: 'Sign in',
    rememberMe: 'Remember me',
    footer: 'By Diego R.',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email format',
    passwordRequired: 'Password is required',
    passwordMin: 'At least 6 characters',
    invalidCredentials: 'Invalid credentials',
  },
  home: {
    title: 'Photo of the Day',
    subtitle: 'NASA APOD',
    loading: 'Loading...',
    errorTitle: 'Something went wrong',
    retry: 'Retry',
    today: 'Today',
    tabHome: 'Home',
    tabProfile: 'Profile',
  },
  profile: {
    title: 'Profile',
    subtitle: 'Manage your account',
    userSection: 'Account',
    email: 'Email',
    name: 'Name',
    settings: 'Settings',
    darkMode: 'Dark mode',
    language: 'Language',
    spanish: 'ES',
    english: 'EN',
    logout: 'Sign out',
    userName: 'NASA User',
    version: 'v1.0.0',
  },
  history: {
    title: 'History',
    close: 'Close',
    empty: 'No queries yet',
    consultedAt: 'Consulted',
    response: 'Response',
    clear: 'Clear',
  },
};

export type Language = 'es' | 'en';

const translations: Record<Language, TranslationKeys> = { es, en };

export function t(lang: Language): TranslationKeys {
  return translations[lang];
}
