<template>
  <div
    class="modal fade"
    id="berhasilModal"
    :data-bs-backdrop="dataBsBackdrop"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success-subtle position-relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            fill="green"
            class="bi bi-check-circle-fill mx-auto my-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
            />
          </svg>
          <button
            v-if="!isStatic"
            type="button"
            class="btn-close position-absolute top-0 end-0 mt-1 me-1"
            data-bs-dismiss="modal"
            aria-label="Tutup"
          ></button>
        </div>
        <div class="modal-body text-center">
          <h3>Berhasil!</h3>
          <slot>Aksi berhasil dilaksanakan!</slot><br /><br />
          <button
            class="btn btn-success w-100"
            type="button"
            data-bs-dismiss="modal"
            @click="konfirmasiBerhasil()"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'

let modal = null
const props = defineProps({
  symbol: null,
  isStatic: Boolean,
})
const emit = defineEmits(['konfirmasiBerhasil'])

const dataBsBackdrop = computed(() => (props.isStatic ? 'static' : true))

onMounted(() => {
  modal = new Modal(document.getElementById('berhasilModal'))
})

// A workaround to trigger toggle from parent
watch(
  () => props.symbol,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    modal.toggle()
  },
)

function konfirmasiBerhasil() {
  emit('konfirmasiBerhasil')
}
</script>
