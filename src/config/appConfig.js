const appConfig = {
  // API endpoints (adjust these to match your Django URLs)
  api: {
    baseUrl: '/api',
    surveys: '/surveys/',
    questions: '/questions/',
    responses: '/responses/'
  },
  
  // Feature flags
  features: {
    enablePreview: true,
    enableFileUploads: true,
    enableThemeCustomization: true
  },
  
  // Theme configuration
  theme: {
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      success: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B'
    },
    fonts: {
      primary: 'Cairo, sans-serif'
    }
  },
  
  // Survey configuration defaults
  defaultSurvey: {
    title: 'استبيان جديد',
    description: 'وصف الاستبيان',
    locale: 'ar',
    direction: 'rtl'
  }
}

export default appConfig; 