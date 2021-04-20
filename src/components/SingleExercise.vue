<template>
  <section>
    <b-collapse
      class="card"
      :open.sync="showCard"
      animation="slide"
      aria-id="contentIdForA11y3"
    >
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
        >
          <p class="card-header-title">{{ exerciseName }}</p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
          </a>
        </div>
      </template>

      <div class="card-content">
        <div v-if="this.name == 'Rest'" class="grid-container-half">
          <b-progress
            class="grid-item-wide"
            v-bind:type="{
              'is-info': this.time < this.timeGoal,
              'is-danger': this.time >= this.timeGoal,
            }"
            size="is-medium"
            :max="this.timeGoal"
            :value="this.time || 0"
            show-value
            >{{ this.time || 0 }} / {{ this.timeGoal }} seconds</b-progress
          >
          <b-button
            type="is-success"
            class="grid-item-halfwide"
            v-on:click="startRest"
            >Start Rest</b-button
          >
          <b-button
            class="grid-item-halfwide"
            type="is-danger"
            v-on:click="endRest"
            >End Rest</b-button
          >
        </div>
        <div v-if="this.name != 'Rest'" class="grid-container">
          <div class="grid-item header">Category</div>
          <div class="grid-item header">Goal</div>
          <div class="grid-item header">You</div>

          <div class="grid-item header">Reps</div>
          <div class="grid-item">{{ repGoal }}</div>
          <div class="grid-item">
            <b-numberinput
              size="is-small"
              controls-position="compact"
              min="0"
              v-model="reps"
              >0</b-numberinput
            >
          </div>
          <div class="grid-item header">Weight</div>
          <div class="grid-item">{{ weightGoal }} kg</div>
          <div class="grid-item">
            <b-numberinput
              size="is-small"
              controls-position="compact"
              min="-50"
              step="5"
              v-model="weight"
            ></b-numberinput>
          </div>
          <!-- <div class="grid-item header">Rythm</div>
          <div class="grid-item">{{ bpmGoal }} BpM</div>
          <div class="grid-item">
            <b-input v-bind:value="computedBpm"></b-input>
          </div> -->
          <div class="grid-item header">Type</div>
          <div class="grid-item">{{ typeGoal }}</div>
          <div class="grid-item">
            <b-field>
              <b-select v-model="type" placeholder="full">
                <option value="full">Full Reps</option>
                <option value="half">Half Reps</option>
                <option value="quarter">Quarter Reps</option>
                <option value="assisted full">Assisted Full</option>
                <option value="assisted half">Assisted Half</option>
                <option value="assisted quarter">Assisted Quarter</option>
              </b-select>
            </b-field>
          </div>
        </div>
        <div class="box" v-if="this.name != 'Rest'">
          <b-button type="is-primary" v-on:click="createTimestamp" expanded
            >Complete Exercise</b-button
          >
        </div>
      </div>
    </b-collapse>
    <br />
  </section>
</template>

<script>
import store from "../main.js";
export default {
  name: "SingleExercise",
  store: store,
  props: {
    exerciseName: String,
    exerciseDescription: String,
    exerciseId: Number,
    goalExerciseReps: Number,
    goalExerciseTime: Number,
    goalExerciseBpm: Number,
    goalExerciseWeight: Number,
    goalExerciseType: String,
    actualExerciseReps: Number,
    actualExerciseRest: Number,
    actualExerciseType: String,
    actualExerciseWeight: Number,
    actualExerciseTime: Number,
    isExtra: Boolean,
  },
  data() {
    return {
      name: this.$props.exerciseName,
      description: this.$props.exerciseDescription,
      id: this.$props.exerciseId,
      repGoal: this.$props.goalExerciseReps,
      timeGoal: this.$props.goalExerciseTime,
      typeGoal: this.$props.goalExerciseType,
      weightGoal: this.$props.goalExerciseWeight,
      bpmGoal:
        this.$props.goalExerciseReps / (this.$props.goalExerciseTime / 60),
      reps: this.$props.actualExerciseReps,
      time: this.$props.actualExerciseTime,
      weight: this.$props.actualExerciseWeight,
      type: this.$props.actualExerciseType,
      notes: null,
      timestamp: null,
      showCard: true,
      restTimerInterval: null,
    };
  },
  methods: {
    completedMessage: function () {
      return this.complete ? "yes" : "no";
    },
    markComplete() {
      this.complete = true;
    },
    startRest() {
      if (this.time == null) this.time = 0;
      this.restTimerInterval = setInterval(() => {
        this.time++;
      }, 1000);
    },
    endRest() {
      if (this.time == null) this.time = 0;
      clearInterval(this.restTimerInterval);
      this.createTimestamp();
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    createTimestamp() {
      this.timestamp = new Date();
      this.showCard = !this.showCard;
    },
  },
  computed: {
    username() {
      // We will see what `params` is shortly
      return this.$route.params.username;
    },
    complete() {
      if (!this.$store.getters.getCompletedExercises) return false;
      if (
        this.$store.getters.getCompletedExercises.indexOf(
          this.exerciseId.toString()
        ) >= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    computedBpm() {
      if (this.reps && this.time) {
        return this.reps / (this.time / 60);
      } else {
        return 0;
      }
    },
  },
  watch: {
    reps: function (newVal) {
      this.$emit("new-data", this.exerciseName, "reps", newVal, this.uid);
    },
    weight: function (newVal) {
      this.$emit("new-data", this.exerciseName, "weight", newVal, this.uid);
    },
    time: function (newVal) {
      this.$emit("new-data", this.exerciseName, "time", newVal, this.uid);
    },
    type: function (newVal) {
      this.$emit("new-data", this.exerciseName, "type", newVal, this.uid);
    },
    notes: function (newVal) {
      this.$emit("new-data", this.exerciseName, "notes", newVal, this.uid);
    },
    timestamp: function (newVal) {
      this.$emit("new-data", this.exerciseName, "timestamp", newVal, this.uid);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  margin: 5px;
  padding: 5px;
}
.card {
  box-shadow: 0px 0 9px rgba(119, 119, 119, 0.8);
}
.card-content {
  padding: 5px;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
}
.grid-container-half {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
}
.header {
  font-weight: bold;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(173, 173, 173, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  text-align: center;
}
.grid-item-wide {
  grid-column: span 2 / auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 6px;
  padding: 6px;
}
.grid-item-halfwide {
  grid-column: 1fr;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 6px;
  padding: 6px;
}
</style>
