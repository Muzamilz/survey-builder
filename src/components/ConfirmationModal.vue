<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="$emit('close')">إلغاء</button>
          <button class="btn-confirm" @click="confirm">تأكيد</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    show: Boolean,
    title: {
      type: String,
      default: 'تأكيد'
    },
    message: {
      type: String,
      default: 'هل أنت متأكد من هذا الإجراء؟'
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-bg-primary);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-confirm {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  color: var(--color-text-primary);
}

.btn-confirm {
  background-color: var(--color-primary);
  color: white;
}

.btn-confirm.delete {
  background-color: var(--color-danger);
}
</style> 