import { ref, onBeforeMount, onUnmounted } from 'vue'

const width = ref(screen.innerWidth)
function handleResize() {
  width.value = window.innerWidth
}

export function useInnerWidth() {
  onBeforeMount(() => {
    handleResize()
    const intervalId = ref(null)
    intervalId.value = setInterval(
      function () {
        if (width.value) {
          clearInterval(intervalId.value)
        } else {
          handleResize()
        }
      },
      1000,
      width,
      intervalId,
    )
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { width }
}
