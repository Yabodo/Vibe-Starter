<template>
  <div class="sparkle-container">
    <!-- Content slot -->
    <slot></slot>
    
    <!-- Simple sparkles using emoji -->
    <span class="sparkle sparkle-1">✨</span>
    <span class="sparkle sparkle-2">⭐</span>
    <span class="sparkle sparkle-3">💫</span>
    <span class="sparkle sparkle-4">🌟</span>
    <span class="sparkle sparkle-5" v-if="count > 4">✨</span>
    <span class="sparkle sparkle-6" v-if="count > 5">⭐</span>
  </div>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 4
  }
})
</script>

<style scoped>
.sparkle-container {
  position: relative;
  display: inline-block;
}

.sparkle {
  position: absolute;
  pointer-events: none;
  font-size: 12px;
  opacity: 0;
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

.sparkle-1 {
  top: -5px;
  right: -5px;
  animation-delay: 0s;
}

.sparkle-2 {
  bottom: -5px;
  left: -5px;
  animation-delay: 0.5s;
}

.sparkle-3 {
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  animation-delay: 1s;
}

.sparkle-4 {
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.5s;
}

.sparkle-5 {
  bottom: -8px;
  right: 20%;
  animation-delay: 0.3s;
}

.sparkle-6 {
  top: 20%;
  left: -8px;
  animation-delay: 0.8s;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Add some variety to the animations */
.sparkle:nth-child(odd) {
  animation-duration: 2.5s;
}

.sparkle:nth-child(even) {
  animation-duration: 2s;
}
</style>