import { watchEffect } from 'vue'

export default function useIntersectionObserver(config) {
  watchEffect(
    onInvalidate => {
      const {
        root,
        target,
        onIntersect,
        threshold = 1.0,
        rootMargin = '0px',
        enabled = true,
      } = config

      if (!enabled) {
        return
      }

      const observer = new IntersectionObserver(
        entries =>
          entries.forEach(entry => entry.isIntersecting && onIntersect()),
        {
          root,
          rootMargin,
          threshold,
        }
      )

      if (!target) {
        return
      }

      observer.observe(target)

      onInvalidate(() => {
        observer.unobserve(target)
      })
    },
    {
      flush: 'post',
    }
  )
}
