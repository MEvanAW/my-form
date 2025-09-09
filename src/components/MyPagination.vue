<template>
  <div class="col-sm d-flex">
    <div class="my-pad d-sm-block"></div>
    <nav aria-label="Navigasi tabel karyawan">
      <ul class="pagination mb-0">
        <li
          class="page-item"
          :class="{ disabled: startDisabled }"
          @click="navigate(1, startDisabled)"
        >
          <a class="page-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-start-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"
              />
            </svg>
          </a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: startDisabled }"
          @click="navigate(currentPage - 1, startDisabled)"
        >
          <a class="page-link" href="#" aria-label="Sebelum">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="item in displayedItems"
          :class="item.class"
          :key="item.innerHtml"
          @click="navigate(item.innerHtml, item.meta)"
        >
          <a class="page-link" href="#">{{ item.innerHtml }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: endDisabled }"
          @click="navigate(currentPage + 1, endDisabled)"
        >
          <a class="page-link" href="#" aria-label="Sesudah">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: endDisabled }"
          @click="navigate(pageCount, endDisabled)"
        >
          <a class="page-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-end-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"
              />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useInnerWidth } from '@/composables/innerWidth'

// classes
const pageItemClass = 'page-item'
const activePageItemClass = 'page-item active'

// scripts
const hellip = '…'
const ellipsisStart = 'hellip-s'
const ellipsisEnd = 'hellip-e'

const { width } = useInnerWidth()
width.value = width.value || window.innerWidth

const props = defineProps({
  pageCount: {
    type: Number,
    required: true,
  },
  symbol: null,
})
const emit = defineEmits(['navigate'])

const currentPage = ref(1)

const displayedItems = computed(() => {
  const items = []
  if (displayStart > 1) {
    items.push({ class: pageItemClass, innerHtml: hellip, meta: ellipsisStart })
  }
  for (let i = displayStart; i <= displayEnd; ++i) {
    items.push({
      class: i == currentPage.value ? activePageItemClass : pageItemClass,
      innerHtml: i,
    })
  }
  if (displayEnd < props.pageCount) {
    items.push({ class: pageItemClass, innerHtml: hellip, meta: ellipsisEnd })
  }
  return items
})
const slots = computed(() => {
  if (width.value > 992) {
    return 9
  }
  if (width.value > 576) {
    return 4
  }
  if (width.value > 344) {
    return 3
  }
  return 2
})
const startDisabled = computed(() => {
  return currentPage.value == 1 || props.pageCount == 0
})
const endDisabled = computed(() => {
  return currentPage.value == props.pageCount || props.pageCount == 0
})

let displayStart = 1
let displayEnd = props.pageCount < 3 + slots.value ? props.pageCount : 1 + slots.value

// eslint-disable-next-line no-unused-vars
watch([() => props.pageCount, () => props.symbol], ([pageCount, _]) => {
  currentPage.value = 1
  displayStart = 1
  displayEnd = pageCount < 3 + slots.value ? pageCount : 1 + slots.value
  emit('navigate', 1)
})

function navigate(page, meta) {
  if (!meta) {
    if (page == 1) {
      displayStart = 1
      displayEnd = props.pageCount < 3 + slots.value ? props.pageCount : 1 + slots.value
    } else if (page == props.pageCount) {
      displayEnd = props.pageCount
      displayStart = props.pageCount < 3 + slots.value ? 1 : props.pageCount - slots.value
    } else if (page < displayStart) {
      meta = ellipsisStart
    } else if (page > displayEnd) {
      meta = ellipsisEnd
    }
    currentPage.value = page
  }
  if (meta == ellipsisStart) {
    displayEnd = displayStart - 1
    displayStart = displayEnd - slots.value
    if (displayStart < 1) {
      const navigateTo = displayEnd
      displayStart = 1
      displayEnd = displayStart + slots.value
      currentPage.value = navigateTo
      emit('navigate', currentPage.value)
      return
    }
    if (displayStart > 1) {
      ++displayStart
    }
    currentPage.value = displayEnd
  } else if (meta == ellipsisEnd) {
    displayStart = displayEnd + 1
    displayEnd = displayStart + slots.value
    if (displayEnd > props.pageCount) {
      const navigateTo = displayStart
      displayEnd = props.pageCount
      displayStart = displayEnd - slots.value
      currentPage.value = navigateTo
      emit('navigate', currentPage.value)
      return
    }
    if (displayEnd < props.pageCount) {
      --displayEnd
    }
    currentPage.value = displayStart
  }
  // disabled li element
  else if (meta === true) {
    return
  }
  emit('navigate', currentPage.value)
}
</script>

<style scoped>
.my-pad {
  display: none;
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}
</style>
