import { reactive, computed } from 'vue'

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{2,40}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const NAME_MAX = 40
export const EMAIL_MAX = 60
export const PHONE_MAX = 10
export const PHONE_MIN = 10
export const MESSAGE_MIN = 10
export const MESSAGE_MAX = 250

export function useContactForm() {
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const errors = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const touched = reactive({
    name: false,
    email: false,
    phone: false,
    message: false,
  })

  const submitted = reactive({ success: false, error: false })

  function sanitizeName(value) {
    return value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]/g, '').slice(0, NAME_MAX)
  }

  function sanitizePhone(value) {
    return value.replace(/\D/g, '').slice(0, PHONE_MAX)
  }

  function sanitizeMessage(value) {
    return value.replace(/[<>{}]/g, '').slice(0, MESSAGE_MAX)
  }

  function onEmailInput(e) {
    form.email = e.target.value.replace(/[^a-zA-Z0-9@._%+-]/g, '').slice(0, EMAIL_MAX)
    if (touched.email) validateField('email')
  }

  function onNameInput(e) {
    form.name = sanitizeName(e.target.value)
    if (touched.name) validateField('name')
  }

  function onPhoneInput(e) {
    form.phone = sanitizePhone(e.target.value)
    if (touched.phone) validateField('phone')
  }

  function onMessageInput(e) {
    form.message = sanitizeMessage(e.target.value)
    if (touched.message) validateField('message')
  }

  function validateField(field) {
    switch (field) {
      case 'name':
        if (!form.name.trim()) errors.name = 'required'
        else if (!NAME_REGEX.test(form.name.trim())) errors.name = 'invalid'
        else errors.name = ''
        break
      case 'email':
        if (!form.email.trim()) errors.email = 'required'
        else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'invalid'
        else errors.email = ''
        break
      case 'phone':
        if (form.phone && form.phone.length !== PHONE_MIN) {
          errors.phone = 'invalid'
        } else {
          errors.phone = ''
        }
        break
      case 'message':
        if (!form.message.trim()) errors.message = 'required'
        else if (form.message.trim().length < MESSAGE_MIN) errors.message = 'short'
        else errors.message = ''
        break
    }
  }

  function onBlur(field) {
    touched[field] = true
    validateField(field)
  }

  function validateAll() {
    ;['name', 'email', 'phone', 'message'].forEach((f) => {
      touched[f] = true
      validateField(f)
    })
    return !Object.values(errors).some(Boolean)
  }

  const isValid = computed(() => {
    return (
      form.name.trim() &&
      NAME_REGEX.test(form.name.trim()) &&
      form.email.trim() &&
      EMAIL_REGEX.test(form.email.trim()) &&
      (!form.phone || form.phone.length === PHONE_MIN) &&
      form.message.trim().length >= MESSAGE_MIN
    )
  })

  function submit() {
    submitted.success = false
    submitted.error = false
    if (!validateAll()) return false

    submitted.success = true
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
    Object.keys(touched).forEach((k) => { touched[k] = false })
    return true
  }

  return {
    form,
    errors,
    touched,
    submitted,
    isValid,
    onNameInput,
    onEmailInput,
    onPhoneInput,
    onMessageInput,
    onBlur,
    validateField,
    submit,
    NAME_MAX,
    EMAIL_MAX,
    PHONE_MAX,
    MESSAGE_MAX,
  }
}
