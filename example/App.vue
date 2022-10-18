<template>
  <div id="app">
    <!-- <Guide/> -->
    <Test_1/>
    <Test_2/>
    <Test_3/>
    <Test_4/>
  </div>
</template>
<script>
// import Guide from './cpn/Guide.vue'
import Test_1 from './cpn/Test1.vue'
import Test_2 from './cpn/Test2.vue'
import Test_3 from './cpn/Test3.vue'
import Test_4 from './cpn/Test4.vue'
export default {
  name: 'app',
  components:{
    // Guide,
    Test_1,
    Test_2,
    Test_3,
    Test_4
  },
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>
<style lang="css">
@import './style/public.css';


.vdr-slot p {
  width: 100%;
  line-height: 30px;
  font-size: 20px;
}
.vdr-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
}


</style>
