// Estilos reutilizables para páginas de autenticación (Login, Register)

export const authStyles = {
  /** Contenedor principal centrado a pantalla completa */
  page: 'flex min-h-screen items-center justify-center bg-background p-4',

  /** Wrapper del contenido con ancho máximo */
  wrapper: 'w-full max-w-md space-y-6',

  /** Card principal */
  card: 'w-full max-w-md border shadow-sm',

  /** Header centrado del card */
  cardHeader: 'text-center pb-4',

  /** Contenedor del ícono del logo */
  logoIcon: 'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary',

  /** Ícono dentro del logo */
  logoSvg: 'h-6 w-6 text-primary-foreground',

  /** Título de la app */
  title: 'text-xl font-bold',

  /** Formulario con espaciado vertical */
  form: 'space-y-4',

  /** Grupo de campo (label + input) */
  fieldGroup: 'space-y-2',

  /** Botón submit de ancho completo */
  submitButton: 'w-full',

  /** Banner informativo (ej: inicialización del sistema) */
  infoBanner: 'flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-4',
  infoBannerIcon: 'h-5 w-5 shrink-0 text-success',
  infoBannerTitle: 'text-sm font-semibold text-foreground',
  infoBannerDescription: 'text-xs text-muted-foreground',
} as const;
