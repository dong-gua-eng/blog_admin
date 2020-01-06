<template>
  <div class="home-page wrapper-main">
    <echart :echartData="echartData"/>
  </div>
</template>

<script>
import Echart from '@/components/echart.vue'
import {echartData} from './data'

export default {
  name: 'home-page',
  components: {
    Echart
  },
  data() {
    return {
      echartData
    }
  }
}
</script>