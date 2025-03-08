<template>
  <div class="survey-builder" dir="rtl">
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>أنواع الأسئلة</h3>
      </div>
      <div class="question-types">
        <div
          v-for="element in availableElements"
          :key="element.type"
          class="question-type"
          draggable="true"
          @dragstart="startDrag($event, element)"
          :data-tooltip="element.hint"
        >
          <i :class="element.icon"></i>
          <span>{{ element.label }}</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="form-header">
        <input type="text" v-model="surveyTitle" placeholder="عنوان الاستبيان" class="form-title" required>
        <textarea v-model="surveyDescription" placeholder="وصف الاستبيان" class="form-description" rows="2" required></textarea>
      </div>

      <div
        class="workspace"
        @dragover.prevent
        @drop="onDrop"
      >
        <p v-if="!surveyElements.length" class="empty-state">
          <i class="fas fa-plus-circle"></i>
          <span>اسحب الأسئلة من القائمة الجانبية لإنشاء استبيانك</span>
        </p>
        <draggable
          v-model="surveyElements"
          group="survey"
          item-key="id"
          class="questions-container"
          ghost-class="ghost-class"
          chosen-class="chosen-class"
        >
          <template #item="{ element }">
            <div class="survey-form-element">
              <div class="element-header">
                <span>{{ element.label }}</span>
                <div class="element-actions">
                  <button class="action-btn" @click="toggleSettings(element)">
                    <i class="fas fa-cog"></i>
                  </button>
                  <button class="action-btn" @click="duplicateElement(element)">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="action-btn delete" @click="removeElement(element)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <component
                :is="element.component"
                v-bind="element.props"
                :showSettings="element.showSettings"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <ConfirmationModal
      :show="showDeleteModal"
      title="حذف السؤال"
      message="هل أنت متأكد من حذف هذا السؤال؟"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import TextQuestion from './questions/TextQuestion.vue'
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import appConfig from '../config/appConfig'
import { createSurvey, updateSurvey } from '../services/surveyService'

export default {
  name: 'SurveyBuilder',
  components: {
    draggable,
    TextQuestion,
    MultipleChoiceQuestion,
    ConfirmationModal
  },
  props: {
    // Allow passing an existing survey to edit
    existingSurvey: {
      type: Object,
      default: null
    },
    // Enable customization of available question types
    availableQuestionTypes: {
      type: Array,
      default: () => []
    },
    // Theme override
    themeOverride: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    // Initialize with default values or existing survey data
    const surveyTitle = ref(props.existingSurvey?.title || appConfig.defaultSurvey.title)
    const surveyDescription = ref(props.existingSurvey?.description || appConfig.defaultSurvey.description)
    const surveyId = ref(props.existingSurvey?.id || null)
    
    // Get default question types or merge with passed props
    const defaultElements = [
      { 
        type: 'text', 
        label: 'نصي', 
        icon: 'fas fa-align-left',
        component: 'TextQuestion', 
        props: { },
        hint: 'إدخال نص قصير أو طويل للإجابة على سؤال مفتوح'
      },
      { 
        type: 'multiple_choice_single', 
        label: 'اختيار فردي', 
        icon: 'fas fa-dot-circle',
        component: 'MultipleChoiceQuestion', 
        props: { isMultiple: false },
        hint: 'اختيار خيار واحد فقط من قائمة الخيارات'
      },
      { 
        type: 'multiple_choice_multiple', 
        label: 'اختيار متعدد', 
        icon: 'fas fa-check-square',
        component: 'MultipleChoiceQuestion', 
        props: { isMultiple: true },
        hint: 'اختيار خيار أو أكثر من قائمة الخيارات'
      },
      { 
        type: 'yes_no', 
        label: 'نعم / لا', 
        icon: 'fas fa-question-circle',
        component: 'MultipleChoiceQuestion', 
        props: { isMultiple: false, yesNoMode: true },
        hint: 'سؤال يتطلب إجابة بنعم أو لا فقط'
      },
      {
        type: 'date',
        label: 'تاريخ',
        icon: 'fas fa-calendar',
        component: 'input',
        props: { type: 'date' },
        hint: 'إدخال تاريخ محدد باستخدام تقويم'
      },
      {
        type: 'rating',
        label: 'تقييم',
        icon: 'fas fa-star',
        component: 'input',
        props: { type: 'range', min: '1', max: '5', step: '1' },
        hint: 'تقييم على مقياس من ١ إلى ٥'
      }
    ]
    
    // If file uploads are enabled by config, add that option
    if (appConfig.features.enableFileUploads) {
      defaultElements.push({
        type: 'file',
        label: 'ملف',
        icon: 'fas fa-file-upload',
        component: 'input',
        props: { type: 'file', accept: 'image/*,.pdf' },
        hint: 'تحميل ملف أو صورة كإجابة'
      })
    }
    
    // Use provided question types or defaults
    const availableElements = ref(props.availableQuestionTypes.length ? 
      props.availableQuestionTypes : defaultElements)
    
    // Initialize elements array with existing data if available
    const surveyElements = ref(props.existingSurvey?.elements || [])
    
    const showDeleteModal = ref(false)
    const elementToDelete = ref(null)

    const startDrag = (event, element) => {
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.setData('element', JSON.stringify(element))
    }

    const onDrop = (event) => {
      const element = JSON.parse(event.dataTransfer.getData('element'))
      const newElement = {
        ...element,
        id: Date.now().toString(),
        isNew: true,
        showSettings: false
      }
      surveyElements.value.push(newElement)
      
      setTimeout(() => {
        const index = surveyElements.value.findIndex(e => e.id === newElement.id);
        if (index !== -1) {
          surveyElements.value[index].isNew = false;
        }
      }, 600);
    }

    const removeElement = (element) => {
      showDeleteModal.value = true
      elementToDelete.value = element
    }

    const duplicateElement = (element) => {
      surveyElements.value.push({
        ...element,
        id: Date.now().toString()
      })
    }

    const confirmDelete = () => {
      if (elementToDelete.value) {
        const index = surveyElements.value.findIndex(e => e.id === elementToDelete.value.id)
        if (index !== -1) {
          surveyElements.value.splice(index, 1)
        }
        elementToDelete.value = null
      }
    }

    const toggleSettings = (element) => {
      // Close other elements' settings first
      surveyElements.value.forEach(el => {
        if (el.id !== element.id) {
          el.showSettings = false;
        }
      });
      
      // Toggle the current element's settings
      element.showSettings = !element.showSettings;
    }

    const emitPreview = () => {
      const surveyData = {
        title: surveyTitle.value,
        description: surveyDescription.value,
        elements: surveyElements.value
      }
      emit('preview', surveyData)
    }

    // Save survey to Django backend
    const saveSurvey = async () => {
      try {
        const surveyData = {
          title: surveyTitle.value,
          description: surveyDescription.value,
          elements: surveyElements.value,
          locale: appConfig.defaultSurvey.locale,
          direction: appConfig.defaultSurvey.direction
        }
        
        let response
        if (surveyId.value) {
          response = await updateSurvey(surveyId.value, surveyData)
        } else {
          response = await createSurvey(surveyData)
          surveyId.value = response.id // Update with new ID from backend
        }
        
        emit('save-success', response)
        return response
      } catch (error) {
        emit('save-error', error)
        console.error('Error saving survey:', error)
        throw error
      }
    }

    return {
      surveyTitle,
      surveyDescription,
      availableElements,
      surveyElements,
      showDeleteModal,
      elementToDelete,
      startDrag,
      onDrop,
      removeElement,
      duplicateElement,
      confirmDelete,
      toggleSettings,
      emitPreview,
      saveSurvey
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

.survey-builder {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-primary);
  font-family: 'Cairo', sans-serif;
  color: var(--color-text-primary);
}

.sidebar {
  width: 280px;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border-primary);
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}

.question-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  cursor: move;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  position: relative;
}

.question-type:hover {
  background: var(--color-bg-primary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.question-type:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: auto;
  right: calc(100% + 15px);
  transform: translateY(-50%);
  background-color: var(--color-primary-dark, #2563eb);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  z-index: 100;
  white-space: normal;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: max-content;
  max-width: 200px;
  text-align: right;
  pointer-events: none;
}

.question-type:hover::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent transparent var(--color-primary-dark, #2563eb);
  z-index: 100;
  pointer-events: none;
}

.question-type i {
  font-size: 1.1rem;
  color: var(--color-primary);
}

.form-title:focus, .form-description:focus {
  outline: none;
  border-bottom-color: var(--color-primary);
}

.survey-form-element {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-primary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.survey-form-element:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.ghost-class {
  opacity: 0.5;
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-primary);
}

.chosen-class {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-primary);
}
.main-content {
  flex: 1;
  padding: 2rem;
  margin-right: 280px;
  max-width: 1200px;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  width: 100%;
  font-size: 1.5rem;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 2px solid var(--color-border-secondary);
  margin-bottom: 1rem;
  font-family: 'Cairo', sans-serif;
  transition: border-color 0.3s;
}

.form-description {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 2px solid var(--color-border-secondary);
  resize: none;
  font-family: 'Cairo', sans-serif;
  transition: border-color 0.3s;
}

.workspace {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  min-height: 400px;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-tertiary);
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
  color: var(--color-primary);
}

.questions-container {
  max-width: 800px;
  margin: 0 auto;
}

.element-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.element-actions {
  display: flex;
  gap: 0.5rem;
}

/* Enhance the existing mobile styles */
@media (max-width: 768px) {
  .sidebar-header h3 {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .form-title, .form-description {
    font-size: 90%;
  }
  
  .survey-form-element {
    padding: 1rem;
  }
  
  .element-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .element-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .workspace {
    padding: 1rem;
  }
  
  .action-btn {
    padding: 0.75rem;
  }
  
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    padding: 1rem;
  }
  
  .main-content {
    margin-right: 0;
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
  
  /* Position tooltips below elements on mobile */
  .question-type:hover::after {
    top: auto;
    right: 50%;
    bottom: -10px;
    transform: translate(50%, 100%);
    max-width: 150px;
  }
  
  .question-type:hover::before {
    top: auto;
    right: 50%;
    bottom: -10px;
    transform: translateX(50%);
    border-color: transparent transparent var(--color-primary-dark, #2563eb) transparent;
  }
}
</style>