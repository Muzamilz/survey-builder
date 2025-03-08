import appConfig from '../config/appConfig';

// Helper for HTTP requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${appConfig.api.baseUrl}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken() // For Django CSRF protection
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Get CSRF token from cookie (for Django)
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  
  return cookieValue;
};

// Survey API methods
export const getSurveys = () => {
  return apiRequest(appConfig.api.surveys);
};

export const getSurveyById = (id) => {
  return apiRequest(`${appConfig.api.surveys}${id}/`);
};

export const createSurvey = (surveyData) => {
  return apiRequest(appConfig.api.surveys, 'POST', surveyData);
};

export const updateSurvey = (id, surveyData) => {
  return apiRequest(`${appConfig.api.surveys}${id}/`, 'PUT', surveyData);
};

export const deleteSurvey = (id) => {
  return apiRequest(`${appConfig.api.surveys}${id}/`, 'DELETE');
}; 