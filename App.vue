<template>
	<v-app v-resize="onResize">
		<v-content>
			<v-container grid-list-xl fluid>
				<v-layout row wrap>
					<v-flex xs12 sm6 lg4 offset-lg2>
						<v-layout row wrap>
							<v-flex xs12>
								<v-card :color="color" class="elevation-5 timer-card" :class="{'darken-4': color}" dark @touchstart="onPress" @touchend="onRelease">
									<v-toolbar :color="color || 'primary'" flat>
										<v-toolbar-title>TIMER</v-toolbar-title>
									</v-toolbar>
									<v-container class="text-xs-center">
										<span class="display-2">{{time | format}}</span>
									</v-container>
									<v-divider></v-divider>
									<v-container class="text-xs-center">
										<span class="hidden-sm-and-down">{{running ? 'PRESS ANY KEY' : 'HOLD SPACE'}} TO</span>
										<span class="hidden-md-and-up">HOLD THIS CARD TO</span>
										{{running ? 'STOP' : 'START'}}
									</v-container>
								</v-card>
							</v-flex>
							<v-flex xs12>
								<v-card class="elevation-5" dark>
									<v-toolbar color="primary" flat>
										<v-toolbar-title>SCRAMBLE</v-toolbar-title>
									</v-toolbar>
									<v-container class="grey darken-4">
										<v-layout column align-center>
											<cube ref="cube"></cube>
										</v-layout>
									</v-container>
									<v-container class="text-xs-center">
										<span v-if="!scrambleReady">{{formula}}</span>
										<span v-else>...</span>
									</v-container>
								</v-card>
							</v-flex>
							<v-flex xs12>
								<v-card class="elevation-5" dark>
									<v-toolbar color="primary" flat>
										<v-toolbar-title>STATISTICS</v-toolbar-title>
									</v-toolbar>
									<v-data-table :items="statistics" hide-headers hide-actions :loading="loading">
										<v-progress-linear slot="progress" color="primary" indeterminate></v-progress-linear>
										<template slot="items" slot-scope="props">
											<td>{{props.item.name}}</td>
											<td class="text-xs-right">{{props.item.time | format}}</td>
										</template>
									</v-data-table>
								</v-card>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 sm6 lg4>
						<v-card class="elevation-5" dark>
							<v-toolbar color="primary" flat>
								<v-toolbar-title>TIMES</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn icon @click="clear">
									<v-icon>clear_all</v-icon>
								</v-btn>
							</v-toolbar>
							<v-data-table :items="times" hide-headers :hide-actions="!times.length" :loading="loading" :rows-per-page-items="[10]">
								<v-progress-linear slot="progress" color="primary" flat indeterminate></v-progress-linear>
								<template slot="items" slot-scope="props">
									<td>{{props.item.duration | format}}</td>
									<td class="text-xs-right">
										<v-icon @click="remove(props.item.id)">delete</v-icon>
									</td>
								</template>
							</v-data-table>
							<v-divider></v-divider>
							<div ref="chart" class="chart" v-show="this.times.length"></div>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>

<style>
	.timer-card {
		user-select: none;
	}
	.chart {
		width: 100%;
		height: 280px;
	}
</style>

<script>
import Cube from './components/cube.vue'
import moment from 'moment'
import durationFormatSetup from 'moment-duration-format'
import Dexie from 'dexie'
import echarts from 'echarts'

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
			waitingTimer: null,
			scrambleReady: false,
			canStart: true,
			times: [],
			chart: null
		}
	},
	mounted() {
		window.onkeyup = this.onRelease
		window.onkeydown = this.onPress
		this.scramble()
		this.loading = true
		this.chart = echarts.init(this.$refs.chart)
		this.chart.setOption({
			xAxis: {
				type: 'category',
				inverse: true,
				show: false
			},
			yAxis: {
				show: false
			},
			tooltip: {
				trigger: 'axis',
				formatter: params => {
					return this.$options.filters.format(params[0].value)
				}
			}
		})
		this.chart.on('finished', () => {
			this.chart.resize()
		})
		this.refresh()
	},
	components: {
		cube: Cube,
	},
	methods: {
		onPress(e) {
			if (!this.waiting && !this.running && this.canStart && e.keyCode == 32) {
				this.time = 0
				this.waiting = true
				this.scrambleReady = true
				this.waitingTimer = setTimeout(() => {
					this.ready = true
				}, 1000)
			}
			if (e.keyCode == 32) e.preventDefault()
			this.stop()
		},
		onRelease() {
			if (this.ready) {
				this.start()
			}
			else {
				this.canStart = true
				this.scrambleReady = false
				clearInterval(this.waitingTimer)
			}
			this.ready = false
			this.waiting = false
		},
		onResize(){
			if(this.chart) this.chart.resize()
		},
		refresh() {
			db.times.orderBy('id').reverse().toArray().then(arr => {
				this.loading = false
				this.times = arr
				this.chart.setOption({
					xAxis: {
						data: arr.map((time, i) => i)
					},
					series: [{
						type: 'bar',
						data: arr.map(time => time.duration),
						animation: false,
						itemStyle: {
							color: '#fff'
						}
					}]
				})
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
				this.canStart = false
				this.timer = setInterval(() => {
					this.time = Date.now() - begin
				})
			}
		},
		stop() {
			if (this.running) {
				clearInterval(this.timer)
				this.running = false
				this.loading = true
				this.scramble()
				this.scrambleReady = false
				db.times.add({ duration: this.time }).then(id => {
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
			return moment.duration(v).format('hh:mm:ss', {
				precision: 2
			})
		}
	},
	computed: {
		color() {
			if (this.ready) return 'green'
			else if (this.waiting) return 'red'
			return null
		},
		statistics() {
			const times = this.times.map(time => time.duration).sort((a, b) => a > b ? 1 : -1)
			const size = times.length
			const average = times.reduce((a, b) => a + b, 0) / size
			const median = size % 2 != 0 ? times[(size - 1) / 2] : (times[(size / 2) - 1] + times[size / 2]) / 2
			const sdeviation = (times.map(x => (x - average) ** 2).reduce((a, b) => a + b, 0) / size) ** .5
			return [
				{ name: 'Best', time: size ? Math.min(...times) : 0 },
				{ name: 'Worst', time: size ? Math.max(...times) : 0 },
				{ name: 'Average', time: size ? average : 0 },
				{ name: 'Median', time: size ? median : 0 },
				{ name: 'S Deviation', time: size ? sdeviation : 0 }
			]
		}
	}
}
</script>