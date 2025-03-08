<template>
  <div class="question-container">
    <div class="question-input">
      <input type="text" v-model="questionText" placeholder="سؤالك هنا" class="question-title-input" />
      <div class="required-toggle">
        <label>
          <input type="checkbox" v-model="isRequired" />
          <span>إلزامي</span>
        </label>
      </div>
    </div>
    <input type="text" :placeholder="placeholderText" disabled class="answer-preview" />
    <div class="settings-panel" v-if="showSettings">
      <input type="text" v-model="placeholderText" placeholder="نص توضيحي" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextQuestion',
  data() {
    return {
      questionText: '',
      placeholderText: 'أدخل إجابتك هنا',
      isRequired: false,
      showSettings: false
    }
  }
}
</script>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-title-input {
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-bottom: 1px dashed var(--color-border-secondary);
  padding: 0.5rem 0;
  width: 80%;
}

.answer-preview {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-tertiary);
}

.settings-panel {
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.required-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}
</style> 