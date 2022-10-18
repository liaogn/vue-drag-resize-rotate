.<template>
  <div>
    <p class="drawTitle">{{title}}：</p>
      <div class="rectDesc" v-if="showData">
        <p class="rectDesc_label"><span v-if="showData.uuid">【id：#{{showData.uuid}}】</span> 数据：</p>
        <p>left: {{ parseInt(showData.x)}}</p>
        <p>top: {{ parseInt(showData.y)}}</p>
        <p>width: {{ parseInt(showData.w)}}</p>
        <p>height: {{ parseInt(showData.h)}}</p>
        <p>rotate: {{ parseInt(showData.r)}}</p>
        <p>stick: {{ showData.stick }}</p>
        <p>lock: {{ showData.lock }}</p>
        <p>zIndex: {{showData.z}}</p>
        <p>active: {{showData.active}}</p>
      </div>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:''
    },
    showData:{
      type:Object,
      default:undefined
    }
  }
}
</script>

<style>

</style>