<template>
  <div :class="['survey-app', direction]" :dir="direction">
    <SurveyHeader 
      @preview="showPreview" 
      @save="saveSurvey" 
      :saving="saving"
      :preview-enabled="config.features.enablePreview"
    />
    
    <SurveyBuilder 
      v-if="!previewMode" 
      ref="builder"
      :existing-survey="existingSurvey"
      :available-question-types="config.customQuestionTypes"
      :theme-override="config.theme"
      @preview="showPreview"
      @save-success="handleSaveSuccess"
      @save-error="handleSaveError"
    />
    
    <PreviewSurvey 
      v-if="previewMode" 
      :title="previewData.title" 
      :description="previewData.description" 
      :elements="previewData.elements"
      @close="previewMode = false"
    />
    
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import SurveyBuilder from './components/SurveyBuilder.vue'
import SurveyHeader from './components/SurveyHeader.vue'
import PreviewSurvey from './components/PreviewSurvey.vue'
import appConfig from './config/appConfig'
import { toFrontendFormat } from './utils/surveyTransformer'

export default {
  name: 'SurveyBuilderApp',
  components: {
    SurveyBuilder,
    SurveyHeader,
    PreviewSurvey
  },
  props: {
    // Survey ID if editing an existing survey
    surveyId: {
      type: [String, Number],
      default: null
    },
    // Configuration override
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    // Merge default config with any provided overrides
    const mergedConfig = computed(() => ({
      ...appConfig,
      ...props.config,
      theme: {
        ...appConfig.theme,
        ...(props.config.theme || {})
      },
      features: {
        ...appConfig.features,
        ...(props.config.features || {})
      }
    }));
    
    const existingSurvey = ref(null)
    const previewMode = ref(false)
    const previewData = ref({
      title: '',
      description: '',
      elements: []
    })
    const saving = ref(false)
    const notification = ref(null)
    const builder = ref(null)
    
    // Computed property for text direction
    const direction = computed(() => 
      existingSurvey.value?.direction || appConfig.defaultSurvey.direction
    )
    
    // Load existing survey if ID is provided
    const loadSurvey = async () => {
      if (props.surveyId) {
        try {
          // Fetch from API
          const response = await fetch(`${mergedConfig.value.api.baseUrl}${mergedConfig.value.api.surveys}${props.surveyId}/`);
          if (!response.ok) throw new Error('Failed to load survey');
          
          const data = await response.json();
          existingSurvey.value = toFrontendFormat(data);
        } catch (error) {
          showNotification('error', 'Failed to load survey data');
          console.error(error);
        }
      }
    }
    
    // Show preview
    const showPreview = (data) => {
      previewData.value = data;
      previewMode.value = true;
    }
    
    // Save survey
    const saveSurvey = async () => {
      if (!builder.value) return;
      
      saving.value = true;
      try {
        await builder.value.saveSurvey();
        showNotification('success', 'Survey saved successfully');
      } catch (error) {
        showNotification('error', 'Failed to save survey');
      } finally {
        saving.value = false;
      }
    }
    
    // Success/Error handlers
    const handleSaveSuccess = (response) => {
      // Emit event that can be captured by parent components
      emit('survey-saved', response);
    }
    
    const handleSaveError = (error) => {
      emit('survey-save-error', error);
    }
    
    // Show notification
    const showNotification = (type, message) => {
      notification.value = { type, message };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    }
    
    // Load survey on mount if ID exists
    onMounted(() => {
      if (props.surveyId) {
        loadSurvey();
      }
    });
    
    return {
      previewMode,
      previewData,
      existingSurvey,
      config: mergedConfig,
      saving,
      notification,
      direction,
      builder,
      showPreview,
      saveSurvey,
      handleSaveSuccess,
      handleSaveError
    }
  }
}
</script>

<style>
.survey-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s forwards;
}

.notification.success {
  background-color: var(--color-success);
}

.notification.error {
  background-color: var(--color-danger);
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 