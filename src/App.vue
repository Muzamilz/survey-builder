<script setup>
import { ref } from 'vue'
import SurveyBuilder from './components/SurveyBuilder.vue'
import SurveyHeader from './components/SurveyHeader.vue'
import PreviewSurvey from './components/PreviewSurvey.vue'

const showPreview = ref(false)
const surveyData = ref({
  title: '',
  description: '',
  elements: []
})

function previewSurvey(data) {
  surveyData.value = data
  showPreview.value = true
}

function saveSurvey(data) {
  // Save functionality will go here
  alert('تم حفظ الاستبيان بنجاح')
}
</script>

<template>
  <div class="app">
    <SurveyHeader @preview="previewSurvey" @save="saveSurvey" />
    <SurveyBuilder @preview="previewSurvey" v-if="!showPreview" />
    <PreviewSurvey 
      v-if="showPreview" 
      :title="surveyData.title" 
      :description="surveyData.description" 
      :elements="surveyData.elements"
      @close="showPreview = false"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Cairo', sans-serif;
  background-color: #f8f9fa;
}

.app {
  min-height: 100vh;
  padding: 0;
}

@media (max-width: 768px) {
  .survey-builder {
    flex-direction: column;
  }
  
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    border-left: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .main-content {
    margin-right: 0;
    padding: 1rem;
  }
  
  .question-types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .question-type {
    flex: 1 0 calc(50% - 0.5rem);
    min-width: 120px;
  }
}
</style>
