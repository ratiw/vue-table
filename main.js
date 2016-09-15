import Vue from 'vue'
import store from './vuex/store'
import App from './src/components/AppTable.vue'

new Vue({
  store, // inject store to all children
  el: 'body',
  components: { App }
})
