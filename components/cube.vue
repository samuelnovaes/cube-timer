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
			let formula = ''
			const faces = {
				u: 'U',
				uc: 'U\'',
				u2: 'U2',
				f: 'F',
				fc: 'F\'',
				f2: 'F2',
				d: 'D',
				dc: 'D\'',
				d2: 'D2',
				b: 'B',
				bc: 'B\'',
				b2: 'B2',
				l: 'L',
				lc: 'L\'',
				l2: 'L2',
				r: 'R',
				rc: 'R\'',
				r2: 'R2'
			}
			const keys = Object.keys(faces)
			let key
			this.reset()
			const generate = () => {
				const newKey = keys[Math.floor(Math.random() * keys.length)]
				if (!key || newKey[0] != key[0]) {
					key = newKey
					this[key]()
					formula += faces[key] + ' '
				}
				else generate()
			}
			for (let i = 0; i < 20; i++) {
				generate()
			}
			return formula
		},
		u() {
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
			this.$forceUpdate()
		},
		uc() {
			const lineAux = [...this.F[0]]
			this.F[0] = this.L[0]
			this.L[0] = this.B[0]
			this.B[0] = this.R[0]
			this.R[0] = lineAux
			const cornerAux = this.U[0][0]
			this.U[0][0] = this.U[0][2]
			this.U[0][2] = this.U[2][2]
			this.U[2][2] = this.U[2][0]
			this.U[2][0] = cornerAux
			const middleAux = this.U[0][1]
			this.U[0][1] = this.U[1][2]
			this.U[1][2] = this.U[2][1]
			this.U[2][1] = this.U[1][0]
			this.U[1][0] = middleAux
			this.$forceUpdate()
		},
		dc() {
			const lineAux = [...this.F[2]]
			this.F[2] = this.R[2]
			this.R[2] = this.B[2]
			this.B[2] = this.L[2]
			this.L[2] = lineAux
			const cornerAux = this.D[0][0]
			this.D[0][0] = this.D[0][2]
			this.D[0][2] = this.D[2][2]
			this.D[2][2] = this.D[2][0]
			this.D[2][0] = cornerAux
			const middleAux = this.D[0][1]
			this.D[0][1] = this.D[1][2]
			this.D[1][2] = this.D[2][1]
			this.D[2][1] = this.D[1][0]
			this.D[1][0] = middleAux
			this.$forceUpdate()
		},
		d() {
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
			this.$forceUpdate()
		},
		l() {
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
			this.$forceUpdate()
		},
		lc() {
			const lineAux = [this.F[0][0], this.F[1][0], this.F[2][0]]
			this.F[0][0] = this.D[0][0]
			this.F[1][0] = this.D[1][0]
			this.F[2][0] = this.D[2][0]
			this.D[0][0] = this.B[2][2]
			this.D[1][0] = this.B[1][2]
			this.D[2][0] = this.B[0][2]
			this.B[0][2] = this.U[2][0]
			this.B[1][2] = this.U[1][0]
			this.B[2][2] = this.U[0][0]
			this.U[0][0] = lineAux[0]
			this.U[1][0] = lineAux[1]
			this.U[2][0] = lineAux[2]
			const cornerAux = this.L[0][0]
			this.L[0][0] = this.L[0][2]
			this.L[0][2] = this.L[2][2]
			this.L[2][2] = this.L[2][0]
			this.L[2][0] = cornerAux
			const middleAux = this.L[0][1]
			this.L[0][1] = this.L[1][2]
			this.L[1][2] = this.L[2][1]
			this.L[2][1] = this.L[1][0]
			this.L[1][0] = middleAux
			this.$forceUpdate()
		},
		rc() {
			const lineAux = [this.F[0][2], this.F[1][2], this.F[2][2]]
			this.F[0][2] = this.U[0][2]
			this.F[1][2] = this.U[1][2]
			this.F[2][2] = this.U[2][2]
			this.U[0][2] = this.B[2][0]
			this.U[1][2] = this.B[1][0]
			this.U[2][2] = this.B[0][0]
			this.B[0][0] = this.D[2][2]
			this.B[1][0] = this.D[1][2]
			this.B[2][0] = this.D[0][2]
			this.D[0][2] = lineAux[0]
			this.D[1][2] = lineAux[1]
			this.D[2][2] = lineAux[2]
			const cornerAux = this.R[0][0]
			this.R[0][0] = this.R[0][2]
			this.R[0][2] = this.R[2][2]
			this.R[2][2] = this.R[2][0]
			this.R[2][0] = cornerAux
			const middleAux = this.R[0][1]
			this.R[0][1] = this.R[1][2]
			this.R[1][2] = this.R[2][1]
			this.R[2][1] = this.R[1][0]
			this.R[1][0] = middleAux
			this.$forceUpdate()
		},
		r() {
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
			this.$forceUpdate()
		},
		f() {
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
			this.$forceUpdate()
		},
		fc() {
			const lineAux = [this.L[0][2], this.L[1][2], this.L[2][2]]
			this.L[0][2] = this.U[2][2]
			this.L[1][2] = this.U[2][1]
			this.L[2][2] = this.U[2][0]
			this.U[2][0] = this.R[0][0]
			this.U[2][1] = this.R[1][0]
			this.U[2][2] = this.R[2][0]
			this.R[0][0] = this.D[0][2]
			this.R[1][0] = this.D[0][1]
			this.R[2][0] = this.D[0][0]
			this.D[0][0] = lineAux[0]
			this.D[0][1] = lineAux[1]
			this.D[0][2] = lineAux[2]
			const cornerAux = this.F[0][0]
			this.F[0][0] = this.F[0][2]
			this.F[0][2] = this.F[2][2]
			this.F[2][2] = this.F[2][0]
			this.F[2][0] = cornerAux
			const middleAux = this.F[0][1]
			this.F[0][1] = this.F[1][2]
			this.F[1][2] = this.F[2][1]
			this.F[2][1] = this.F[1][0]
			this.F[1][0] = middleAux
			this.$forceUpdate()
		},
		bc() {
			const lineAux = [this.L[2][0], this.L[1][0], this.L[0][0]]
			this.L[0][0] = this.D[2][0]
			this.L[1][0] = this.D[2][1]
			this.L[2][0] = this.D[2][2]
			this.D[2][0] = this.R[2][2]
			this.D[2][1] = this.R[1][2]
			this.D[2][2] = this.R[0][2]
			this.R[0][2] = this.U[0][0]
			this.R[1][2] = this.U[0][1]
			this.R[2][2] = this.U[0][2]
			this.U[0][0] = lineAux[0]
			this.U[0][1] = lineAux[1]
			this.U[0][2] = lineAux[2]
			const cornerAux = this.B[0][0]
			this.B[0][0] = this.B[0][2]
			this.B[0][2] = this.B[2][2]
			this.B[2][2] = this.B[2][0]
			this.B[2][0] = cornerAux
			const middleAux = this.B[0][1]
			this.B[0][1] = this.B[1][2]
			this.B[1][2] = this.B[2][1]
			this.B[2][1] = this.B[1][0]
			this.B[1][0] = middleAux
			this.$forceUpdate()
		},
		b() {
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
			this.$forceUpdate()
		},
		u2() {
			this.u()
			this.u()
		},
		f2() {
			this.f()
			this.f()
		},
		d2() {
			this.d()
			this.d()
		},
		b2() {
			this.b()
			this.b()
		},
		l2() {
			this.l()
			this.l()
		},
		r2() {
			this.r()
			this.r()
		}
	}
}
</script>
