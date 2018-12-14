<template>
	<v-app>
		<v-container grid-list-xl fluid>
			<v-layout row wrap>
				<v-flex xs12 sm8 offset-sm2>
					<v-alert :value="true" type="info">Press SPACE to start, and any key to stop</v-alert>
				</v-flex>
				<v-flex xs12 sm4 offset-sm2>
					<v-card color="#333" dark flat>
						<v-container :class="color" class="text-xs-center">
							<span class="display-2">{{time | format}}</span>
						</v-container>
						<v-container>
							<cube ref="cube"></cube>
						</v-container>
						<v-container class="text-xs-center secondary">
							<span class="subheading">{{formula}}</span>
						</v-container>
					</v-card>
				</v-flex>
				<v-flex xs12 sm4 d-flex>
					<v-card dark flat>
						<v-toolbar flat>
							<v-toolbar-title>Times</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn icon @click="clear">
								<v-icon>clear_all</v-icon>
							</v-btn>
						</v-toolbar>
						<v-data-table :headers="headers" :items="times" hide-actions hide-headers :loading="loading">
							<v-progress-linear slot="progress" color="primary" indeterminate></v-progress-linear>
							<template slot="items" slot-scope="props">
								<td
									:class="{'blue--text': props.item.id == lastId, 'text--lighten-2': true, 'body-1': true}"
								>{{props.item.duration | format}}</td>
								<td class="text-xs-right">
									<v-btn icon @click="remove(props.item.id)">
										<v-icon>delete</v-icon>
									</v-btn>
								</td>
							</template>
						</v-data-table>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-app>
</template>

<script>
import Cube from './components/cube.vue'
import moment from 'moment'
import durationFormatSetup from 'moment-duration-format'
import Dexie from 'dexie'
durationFormatSetup(moment)

const db = new Dexie('cube-timer')

db.version(1).stores({
	times: '++id, duration'
})

export default {
	data() {
		return {
			formula: '',
			time: 0,
			running: false,
			timer: null,
			ready: false,
			waiting: false,
			loading: false,
			lastId: null,
			times: [],
			headers: [
				{ text: 'Duration', value: 'duration', sortable: false },
				{ text: 'Action', value: 'id', sortable: false, align: 'right' }
			]
		}
	},
	mounted() {
		let waitingTimer
		window.onkeyup = e => {
			if (e.keyCode == 32 && this.ready) {
				this.ready = false
				this.waiting = false
				this.start()
			}
			else {
				clearInterval(waitingTimer)
				this.ready = false
				this.waiting = false
			}
		}
		window.onkeydown = e => {
			if (e.keyCode == 32 && !this.waiting && !this.running) {
				this.time = 0
				this.waiting = true
				waitingTimer = setTimeout(() => {
					this.ready = true
				}, 1000)
			}
			this.stop()
		}
		this.scramble()
		this.loading = true
		this.refresh()
	},
	components: {
		cube: Cube,
	},
	methods: {
		refresh() {
			db.times.orderBy('duration').limit(10).toArray().then(arr => {
				this.loading = false
				this.times = arr
			})
		},
		remove(id) {
			if (!this.loading) {
				this.loading = true
				db.times.delete(id).then(() => {
					this.refresh()
				})
			}
		},
		clear() {
			this.loading = true
			db.times.clear().then(() => {
				this.refresh()
			})
		},
		start() {
			if (!this.running) {
				const begin = Date.now()
				this.running = true
				this.timer = setInterval(() => {
					this.time = Date.now() - begin
				}, 10)
			}
		},
		stop() {
			if (this.running) {
				clearInterval(this.timer)
				this.running = false
				this.scramble()
				this.loading = true
				db.times.add({ duration: this.time }).then(id => {
					this.lastId = id
					this.refresh()
				})
			}
		},
		scramble() {
			if (!this.running) {
				this.formula = this.$refs.cube.scramble()
			}
		}
	},
	filters: {
		format(v) {
			return moment.duration(v).format('hh:mm:ss:SS', {
				trim: false
			})
		}
	},
	computed: {
		color() {
			if (this.ready) return 'green'
			else if (this.waiting) return 'red'
			return 'secondary'
		}
	}
}
</script>
 