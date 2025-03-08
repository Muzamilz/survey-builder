<template>
  <div class="survey-preview" dir="rtl">
    <div class="preview-header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    
    <div class="preview-body">
      <div v-for="(element, index) in elements" :key="element.id" class="preview-question">
        <h3>{{ index + 1 }}. {{ element.label }}</h3>
        
        <!-- Different question types -->
        <div v-if="element.type === 'text'" class="preview-text">
          <input type="text" :placeholder="'أدخل إجابتك هنا'" class="preview-input">
        </div>
        
        <div v-else-if="element.type === 'multiple_choice_single'" class="preview-choice">
          <div v-for="n in 3" :key="n" class="choice-option">
            <input type="radio" :name="`question-${element.id}`" :id="`q${element.id}-opt${n}`">
            <label :for="`q${element.id}-opt${n}`">خيار {{ n }}</label>
          </div>
        </div>
        
        <!-- Other question types... -->
      </div>
    </div>
    
    <div class="preview-actions">
      <button class="btn-secondary" @click="$emit('close')">إغلاق</button>
      <button class="btn-primary">إرسال (للمعاينة فقط)</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewSurvey',
  props: {
    title: {
      type: String,
      default: 'استبيان جديد'
    },
    description: {
      type: String,
      default: 'وصف الاستبيان'
    },
    elements: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.survey-preview {
  background-color: var(--color-bg-secondary);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.preview-header {
  margin-bottom: 2rem;
  text-align: center;
}

.preview-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.preview-header p {
  color: var(--color-text-secondary);
}

.preview-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-question {
  background: var(--color-bg-primary);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.preview-question h3 {
  margin-bottom: 1rem;
}

.preview-text .preview-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
}

.preview-choice {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.choice-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
}
</style> 