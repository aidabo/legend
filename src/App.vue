<template>
  <Menubar></Menubar>

  <div class="app-view">
    <router-view></router-view>
  </div>

  <Teleport to="body">
    <!-- just to show msg dialog -->
    <!-- <a id="msgDlg" class="hidden" href="#" data-toggle="modal" data-target="#mbr-popup-v"></a>
    <MsgDialog :data="dialogData"></MsgDialog> -->
  </Teleport>

  <Footer></Footer>
</template>

<script setup>
import { markRaw, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import Footer from "./components/menu/Footer.vue";
import Menubar from "./components/menu/Menubar.vue";

onMounted(async()=>{
})

</script>

<style scoped>
</style>
