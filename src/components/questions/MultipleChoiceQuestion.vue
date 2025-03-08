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
    
    <div class="choices-container">
      <div v-for="(choice, index) in choices" :key="index" class="choice-item">
        <div class="choice-input">
          <input :type="isMultiple ? 'checkbox' : 'radio'" disabled />
          <input type="text" v-model="choices[index]" placeholder="الاختيار" class="choice-text" />
        </div>
        <button class="remove-choice" @click="removeChoice(index)" v-if="choices.length > 1">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <button class="add-choice" @click="addChoice">
        <i class="fas fa-plus"></i> إضافة اختيار
      </button>
    </div>
    
    <div class="settings-panel" v-if="showSettings">
      <div class="setting-option">
        <label>
          <input type="checkbox" v-model="isMultiple" />
          <span>السماح باختيارات متعددة</span>
        </label>
      </div>
      <div class="setting-option">
        <label>
          <input type="checkbox" v-model="randomizeChoices" />
          <span>ترتيب عشوائي للاختيارات</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleChoiceQuestion',
  props: {
    showSettings: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      questionText: '',
      isRequired: false,
      choices: ['', ''],
      isMultiple: false,
      randomizeChoices: false
    }
  },
  methods: {
    addChoice() {
      this.choices.push('');
    },
    removeChoice(index) {
      if (this.choices.length > 1) {
        this.choices.splice(index, 1);
      }
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
  border-bottom: 1px dashed #e0e0e0;
  padding: 0.5rem 0;
  width: 80%;
}

.choices-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.choice-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.choice-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.choice-text {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
}

.remove-choice {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.add-choice {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.settings-panel {
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.setting-option {
  margin-bottom: 0.75rem;
}
</style> 