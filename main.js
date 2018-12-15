import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify, {
	theme: {
		primary: '#455A64'
	}
})

new Vue({
	el: '#app',
	render: h => h(App)
})