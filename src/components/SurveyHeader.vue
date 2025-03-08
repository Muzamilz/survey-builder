<template>
  <header class="survey-header">
    <div class="branding">
      <i class="fas fa-poll"></i>
      <h1>منشئ الاستبيانات</h1>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" @click="previewSurvey">
        <i class="fas fa-eye"></i> معاينة
      </button>
      <button class="btn btn-primary" @click="saveSurvey">
        <i class="fas fa-save"></i> حفظ
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SurveyHeader',
  methods: {
    previewSurvey() {
      this.$emit('preview')
    },
    saveSurvey() {
      this.$emit('save')
    }
  }
}
</script>

<style scoped>
.survey-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
}

.branding {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.branding i {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.branding h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary:hover {
  background-color: var(--color-border-primary);
}
</style> 