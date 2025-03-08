/**
 * Transforms survey data to a format compatible with Django models
 * @param {Object} surveyData - Raw survey data from the frontend
 * @returns {Object} - Django-compatible data structure
 */
export const toDjangoFormat = (surveyData) => {
  return {
    title: surveyData.title,
    description: surveyData.description,
    locale: surveyData.locale || 'ar',
    direction: surveyData.direction || 'rtl',
    questions: surveyData.elements.map((element, index) => ({
      order: index,
      type: element.type,
      label: element.label,
      required: element.props?.required || false,
      settings: JSON.stringify({
        ...element.props,
        component: element.component
      })
    }))
  };
};

/**
 * Transforms Django model data to frontend format
 * @param {Object} djangoData - Data from Django backend
 * @returns {Object} - Frontend-compatible survey structure
 */
export const toFrontendFormat = (djangoData) => {
  return {
    id: djangoData.id,
    title: djangoData.title,
    description: djangoData.description,
    locale: djangoData.locale,
    direction: djangoData.direction,
    elements: djangoData.questions.map(question => {
      const settings = JSON.parse(question.settings || '{}');
      return {
        id: question.id.toString(),
        type: question.type,
        label: question.label,
        component: settings.component || getDefaultComponentForType(question.type),
        props: {
          required: question.required,
          ...settings
        }
      };
    })
  };
};

/**
 * Helper to determine default component based on question type
 */
const getDefaultComponentForType = (type) => {
  const componentMap = {
    'text': 'TextQuestion',
    'multiple_choice_single': 'MultipleChoiceQuestion',
    'multiple_choice_multiple': 'MultipleChoiceQuestion',
    'yes_no': 'MultipleChoiceQuestion',
    'date': 'input',
    'rating': 'input',
    'file': 'input'
  };
  
  return componentMap[type] || 'TextQuestion';
}; 