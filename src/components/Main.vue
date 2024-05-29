<template>
  <div>
    <Login></Login>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  components: {
    Login
  },
  setup () {
  }
}
</script>

<style>
</style>