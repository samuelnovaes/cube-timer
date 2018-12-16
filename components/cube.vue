<template>
	<table class="cube" :style="{ height }" v-resize="onResize" ref="cube">
		<tr>
			<td></td>
			<td class="face">
				<table>
					<tr v-for="(line, i) in U" :key="i">
						<td v-for="(cell, i) in line" :key="i" :style="{backgroundColor: cell}"></td>
					</tr>
				</table>
			</td>
			<td colspan="2"></td>
		</tr>
		<tr>
			<td class="face" v-for="(face, i) in [L, F, R, B]" :key="i">
				<table>
					<tr v-for="(line, i) in face" :key="i">
						<td v-for="(cell, i) in line" :key="i" :style="{backgroundColor: cell}"></td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td></td>
			<td class="face">
				<table>
					<tr v-for="(line, i) in D" :key="i">
						<td v-for="(cell, i) in line" :key="i" :style="{backgroundColor: cell}"></td>
					</tr>
				</table>
			</td>
			<td colspan="2"></td>
		</tr>
	</table>
</template>

<style>
	.cube {
		width: 100%;
		max-width: 300px;
		border-spacing: 0;
	}
	.face table {
		width: 100%;
		height: 100%;
	}
</style>

<script>
import generateScramble from 'scramble-generator'
import { formatScramble } from 'scramble-generator'
export default {
	data() {
		return {
			U: [],
			L: [],
			F: [],
			R: [],
			B: [],
			D: [],
			height: '100px'
		}
	},
	mounted() {
		this.reset()
	},
	methods: {
		onResize() {
			this.height = (this.$refs.cube.offsetWidth * (3 / 4)) + 'px'
		},
		reset() {
			this.U = [['#FFFFFF', '#FFFFFF', '#FFFFFF'], ['#FFFFFF', '#FFFFFF', '#FFFFFF'], ['#FFFFFF', '#FFFFFF', '#FFFFFF']]
			this.L = [['#FF9800', '#FF9800', '#FF9800'], ['#FF9800', '#FF9800', '#FF9800'], ['#FF9800', '#FF9800', '#FF9800']]
			this.F = [['#4CAF50', '#4CAF50', '#4CAF50'], ['#4CAF50', '#4CAF50', '#4CAF50'], ['#4CAF50', '#4CAF50', '#4CAF50']]
			this.R = [['#F44336', '#F44336', '#F44336'], ['#F44336', '#F44336', '#F44336'], ['#F44336', '#F44336', '#F44336']]
			this.B = [['#2196F3', '#2196F3', '#2196F3'], ['#2196F3', '#2196F3', '#2196F3'], ['#2196F3', '#2196F3', '#2196F3']]
			this.D = [['#FFEB3B', '#FFEB3B', '#FFEB3B'], ['#FFEB3B', '#FFEB3B', '#FFEB3B'], ['#FFEB3B', '#FFEB3B', '#FFEB3B']]
		},
		scramble() {
			const scramble = generateScramble({ formatted: false })
			this.reset()
			scramble.forEach(move => {
				const count = move.double ? 2 : move.inverted ? 3 : 1
				this[move.face.toLowerCase()](count)
			})
			this.$forceUpdate()
			return formatScramble(scramble)
		},
		u(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [...this.F[0]]
				this.F[0] = this.R[0]
				this.R[0] = this.B[0]
				this.B[0] = this.L[0]
				this.L[0] = lineAux
				const cornerAux = this.U[0][0]
				this.U[0][0] = this.U[2][0]
				this.U[2][0] = this.U[2][2]
				this.U[2][2] = this.U[0][2]
				this.U[0][2] = cornerAux
				const middleAux = this.U[0][1]
				this.U[0][1] = this.U[1][0]
				this.U[1][0] = this.U[2][1]
				this.U[2][1] = this.U[1][2]
				this.U[1][2] = middleAux
			}
		},
		d(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [...this.F[2]]
				this.F[2] = this.L[2]
				this.L[2] = this.B[2]
				this.B[2] = this.R[2]
				this.R[2] = lineAux
				const cornerAux = this.D[0][0]
				this.D[0][0] = this.D[2][0]
				this.D[2][0] = this.D[2][2]
				this.D[2][2] = this.D[0][2]
				this.D[0][2] = cornerAux
				const middleAux = this.D[0][1]
				this.D[0][1] = this.D[1][0]
				this.D[1][0] = this.D[2][1]
				this.D[2][1] = this.D[1][2]
				this.D[1][2] = middleAux
			}
		},
		l(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [this.F[0][0], this.F[1][0], this.F[2][0]]
				this.F[0][0] = this.U[0][0]
				this.F[1][0] = this.U[1][0]
				this.F[2][0] = this.U[2][0]
				this.U[0][0] = this.B[2][2]
				this.U[1][0] = this.B[1][2]
				this.U[2][0] = this.B[0][2]
				this.B[0][2] = this.D[2][0]
				this.B[1][2] = this.D[1][0]
				this.B[2][2] = this.D[0][0]
				this.D[0][0] = lineAux[0]
				this.D[1][0] = lineAux[1]
				this.D[2][0] = lineAux[2]
				const cornerAux = this.L[0][0]
				this.L[0][0] = this.L[2][0]
				this.L[2][0] = this.L[2][2]
				this.L[2][2] = this.L[0][2]
				this.L[0][2] = cornerAux
				const middleAux = this.L[0][1]
				this.L[0][1] = this.L[1][0]
				this.L[1][0] = this.L[2][1]
				this.L[2][1] = this.L[1][2]
				this.L[1][2] = middleAux
			}
		},
		r(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [this.F[0][2], this.F[1][2], this.F[2][2]]
				this.F[0][2] = this.D[0][2]
				this.F[1][2] = this.D[1][2]
				this.F[2][2] = this.D[2][2]
				this.D[0][2] = this.B[2][0]
				this.D[1][2] = this.B[1][0]
				this.D[2][2] = this.B[0][0]
				this.B[0][0] = this.U[2][2]
				this.B[1][0] = this.U[1][2]
				this.B[2][0] = this.U[0][2]
				this.U[0][2] = lineAux[0]
				this.U[1][2] = lineAux[1]
				this.U[2][2] = lineAux[2]
				const cornerAux = this.R[0][0]
				this.R[0][0] = this.R[2][0]
				this.R[2][0] = this.R[2][2]
				this.R[2][2] = this.R[0][2]
				this.R[0][2] = cornerAux
				const middleAux = this.R[0][1]
				this.R[0][1] = this.R[1][0]
				this.R[1][0] = this.R[2][1]
				this.R[2][1] = this.R[1][2]
				this.R[1][2] = middleAux
			}
		},
		f(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [this.L[2][2], this.L[1][2], this.L[0][2]]
				this.L[0][2] = this.D[0][0]
				this.L[1][2] = this.D[0][1]
				this.L[2][2] = this.D[0][2]
				this.D[0][0] = this.R[2][0]
				this.D[0][1] = this.R[1][0]
				this.D[0][2] = this.R[0][0]
				this.R[0][0] = this.U[2][0]
				this.R[1][0] = this.U[2][1]
				this.R[2][0] = this.U[2][2]
				this.U[2][0] = lineAux[0]
				this.U[2][1] = lineAux[1]
				this.U[2][2] = lineAux[2]
				const cornerAux = this.F[0][0]
				this.F[0][0] = this.F[2][0]
				this.F[2][0] = this.F[2][2]
				this.F[2][2] = this.F[0][2]
				this.F[0][2] = cornerAux
				const middleAux = this.F[0][1]
				this.F[0][1] = this.F[1][0]
				this.F[1][0] = this.F[2][1]
				this.F[2][1] = this.F[1][2]
				this.F[1][2] = middleAux
			}
		},
		b(count = 1) {
			for (let i = 0; i < count; i++) {
				const lineAux = [this.L[0][0], this.L[1][0], this.L[2][0]]
				this.L[0][0] = this.U[0][2]
				this.L[1][0] = this.U[0][1]
				this.L[2][0] = this.U[0][0]
				this.U[0][0] = this.R[0][2]
				this.U[0][1] = this.R[1][2]
				this.U[0][2] = this.R[2][2]
				this.R[0][2] = this.D[2][2]
				this.R[1][2] = this.D[2][1]
				this.R[2][2] = this.D[2][0]
				this.D[2][0] = lineAux[0]
				this.D[2][1] = lineAux[1]
				this.D[2][2] = lineAux[2]
				const cornerAux = this.B[0][0]
				this.B[0][0] = this.B[2][0]
				this.B[2][0] = this.B[2][2]
				this.B[2][2] = this.B[0][2]
				this.B[0][2] = cornerAux
				const middleAux = this.B[0][1]
				this.B[0][1] = this.B[1][0]
				this.B[1][0] = this.B[2][1]
				this.B[2][1] = this.B[1][2]
				this.B[1][2] = middleAux
			}
		}
	}
}
</script>
