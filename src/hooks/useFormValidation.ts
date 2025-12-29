'use client'

import { useState, useCallback, useMemo } from 'react'

type ValidationRule<T> = (value: T, formData: Record<string, unknown>) => string | undefined

interface FieldConfig<T = unknown> {
  initialValue: T
  rules?: ValidationRule<T>[]
}

interface UseFormValidationOptions<T extends Record<string, FieldConfig>> {
  fields: T
  onSubmit?: (data: { [K in keyof T]: T[K]['initialValue'] }) => Promise<void> | void
}

interface FormField<T> {
  value: T
  error: string | undefined
  touched: boolean
  onChange: (value: T) => void
  onBlur: () => void
  reset: () => void
}

type FormFields<T extends Record<string, FieldConfig>> = {
  [K in keyof T]: FormField<T[K]['initialValue']>
}

interface UseFormValidationReturn<T extends Record<string, FieldConfig>> {
  fields: FormFields<T>
  isValid: boolean
  isSubmitting: boolean
  submitError: string | null
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  resetForm: () => void
  setSubmitError: (error: string | null) => void
}

export function useFormValidation<T extends Record<string, FieldConfig>>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const { fields: fieldConfigs, onSubmit } = options

  // Initialize state
  const initialValues = useMemo(() => {
    const values: Record<string, unknown> = {}
    Object.entries(fieldConfigs).forEach(([key, config]) => {
      values[key] = config.initialValue
    })
    return values
  }, [fieldConfigs])

  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: unknown): string | undefined => {
      const config = fieldConfigs[name]
      if (!config?.rules) return undefined

      for (const rule of config.rules) {
        const error = rule(value as never, values)
        if (error) return error
      }
      return undefined
    },
    [fieldConfigs, values]
  )

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string | undefined> = {}
    let isValid = true

    Object.keys(fieldConfigs).forEach((name) => {
      const error = validateField(name, values[name])
      newErrors[name] = error
      if (error) isValid = false
    })

    setErrors(newErrors)
    return isValid
  }, [fieldConfigs, values, validateField])

  // Handle field change
  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSubmitError(null)
  }, [])

  // Handle field blur
  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, values[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [values, validateField]
  )

  // Reset single field
  const resetField = useCallback((name: string) => {
    const config = fieldConfigs[name]
    setValues((prev) => ({ ...prev, [name]: config.initialValue }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setTouched((prev) => ({ ...prev, [name]: false }))
  }, [fieldConfigs])

  // Reset entire form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitError(null)
  }, [initialValues])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {}
      Object.keys(fieldConfigs).forEach((name) => {
        allTouched[name] = true
      })
      setTouched(allTouched)

      // Validate all fields
      if (!validateAll()) return

      if (!onSubmit) return

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await onSubmit(values as { [K in keyof T]: T[K]['initialValue'] })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        setSubmitError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [fieldConfigs, values, validateAll, onSubmit]
  )

  // Build fields object
  const fields = useMemo(() => {
    const result: Record<string, FormField<unknown>> = {}

    Object.keys(fieldConfigs).forEach((name) => {
      result[name] = {
        value: values[name],
        error: touched[name] ? errors[name] : undefined,
        touched: touched[name] || false,
        onChange: (value: unknown) => handleChange(name, value),
        onBlur: () => handleBlur(name),
        reset: () => resetField(name),
      }
    })

    return result as FormFields<T>
  }, [fieldConfigs, values, errors, touched, handleChange, handleBlur, resetField])

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => !error)
  }, [errors])

  return {
    fields,
    isValid,
    isSubmitting,
    submitError,
    handleSubmit,
    resetForm,
    setSubmitError,
  }
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule<unknown> => {
    return (value) => {
      if (value === undefined || value === null || value === '') {
        return message
      }
      return undefined
    }
  },

  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value) => {
      if (value.length < min) {
        return message || `Minimum ${min} characters required`
      }
      return undefined
    }
  },

  maxLength: (max: number, message?: string): ValidationRule<string> => {
    return (value) => {
      if (value.length > max) {
        return message || `Maximum ${max} characters allowed`
      }
      return undefined
    }
  },

  email: (message = 'Invalid email address'): ValidationRule<string> => {
    return (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return message
      }
      return undefined
    }
  },

  phone: (message = 'Invalid phone number'): ValidationRule<string> => {
    return (value) => {
      // Supports various phone formats
      const phoneRegex = /^[\d\s+\-()]{10,}$/
      if (value && !phoneRegex.test(value)) {
        return message
      }
      return undefined
    }
  },

  match: (fieldName: string, message = 'Fields do not match'): ValidationRule<unknown> => {
    return (value, formData) => {
      if (value !== formData[fieldName]) {
        return message
      }
      return undefined
    }
  },

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => {
    return (value) => {
      if (value && !regex.test(value)) {
        return message
      }
      return undefined
    }
  },
}
