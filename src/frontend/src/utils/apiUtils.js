/**
 * API utility functions for common request handling patterns
 */

/**
 * Build query parameters string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v))
      } else {
        searchParams.append(key, value)
      }
    }
  })
  
  return searchParams.toString()
}

/**
 * Extract error message from API error response
 * @param {Error} error - API error
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data
    
    // Handle different error response formats
    if (typeof data === 'string') {
      return data
    }
    
    if (data.message) {
      return data.message
    }
    
    if (data.error) {
      return data.error
    }
    
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.message || err).join(', ')
    }
    
    if (data.details) {
      return data.details
    }
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

/**
 * Check if error is a network error
 * @param {Error} error - Error to check
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request
}

/**
 * Check if error is a timeout error
 * @param {Error} error - Error to check
 * @returns {boolean} True if timeout error
 */
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message.includes('timeout')
}

/**
 * Check if error is unauthorized (401)
 * @param {Error} error - Error to check
 * @returns {boolean} True if unauthorized
 */
export const isUnauthorizedError = (error) => {
  return error.response?.status === 401
}

/**
 * Check if error is forbidden (403)
 * @param {Error} error - Error to check
 * @returns {boolean} True if forbidden
 */
export const isForbiddenError = (error) => {
  return error.response?.status === 403
}

/**
 * Check if error is not found (404)
 * @param {Error} error - Error to check
 * @returns {boolean} True if not found
 */
export const isNotFoundError = (error) => {
  return error.response?.status === 404
}

/**
 * Check if error is server error (5xx)
 * @param {Error} error - Error to check
 * @returns {boolean} True if server error
 */
export const isServerError = (error) => {
  return error.response?.status >= 500
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} Function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Create a throttled function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle
  
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Format bytes to human readable string
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Create FormData from object
 * @param {Object} data - Data object
 * @returns {FormData} FormData object
 */
export const createFormData = (data) => {
  const formData = new FormData()
  
  const appendData = (obj, parentKey = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const formKey = parentKey ? `${parentKey}[${key}]` : key
      
      if (value instanceof File || value instanceof Blob) {
        formData.append(formKey, value)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            appendData(item, `${formKey}[${index}]`)
          } else {
            formData.append(`${formKey}[${index}]`, item)
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        appendData(value, formKey)
      } else if (value !== null && value !== undefined) {
        formData.append(formKey, value)
      }
    })
  }
  
  appendData(data)
  return formData
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - File name
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Parse pagination info from headers
 * @param {Object} headers - Response headers
 * @returns {Object} Pagination info
 */
export const parsePaginationHeaders = (headers) => {
  return {
    totalCount: parseInt(headers['x-total-count']) || 0,
    totalPages: parseInt(headers['x-total-pages']) || 0,
    currentPage: parseInt(headers['x-current-page']) || 1,
    pageSize: parseInt(headers['x-page-size']) || 10,
    hasNext: headers['x-has-next'] === 'true',
    hasPrev: headers['x-has-prev'] === 'true',
  }
}

/**
 * Create cache key from request config
 * @param {Object} config - Request config
 * @returns {string} Cache key
 */
export const createCacheKey = (config) => {
  const { method, url, params, data } = config
  return JSON.stringify({ method, url, params, data })
}

/**
 * Simple in-memory cache
 */
export class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }
  
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  delete(key) {
    this.cache.delete(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  size() {
    return this.cache.size
  }
}

// Global cache instance
export const apiCache = new SimpleCache()